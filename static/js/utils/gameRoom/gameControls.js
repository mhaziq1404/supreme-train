import { initPongGameVS } from "../../game/PongGameVS.js";
import { authService } from "../../services/api/authService.js";

export function initGameControls(room, join) {
    const roomid = room.id;
    const readyBtn = document.getElementById('readyBtn');
    const startBtn = document.getElementById('startBtn');
    const leaveRoom = document.getElementById('leaveRoom');

    readyBtn?.addEventListener('click', () => {
        const isReady = readyBtn.classList.contains('btn-success');
        const data = {
            type:  isReady ? 'not_ready' : 'ready'
        };
        socket.send(JSON.stringify(data));
        readyBtn.classList.toggle('btn-success');
        readyBtn.classList.toggle('btn-light');
        readyBtn.innerHTML = isReady ? 
            '<i class="bi bi-check-circle-fill"></i> Ready' : 
            '<i class="bi bi-check-circle-fill"></i> Ready!';
    });

    startBtn?.addEventListener('click', () => {
        const data = {
            type: 'game_start'
        };
        socket.send(JSON.stringify(data));
        initPongGameVS(room.players[0].name,room.players[1].name,room.players[0].name);
        const isReady = startBtn.classList.contains('btn-success');
        startBtn.classList.toggle('btn-success');
        startBtn.classList.toggle('btn-light');
        startBtn.innerHTML = isReady ? 
            '<i class="bi bi-check-circle-fill"></i> Ready' : 
            '<i class="bi bi-check-circle-fill"></i> Ready!';
        startBtn.style.display = 'none';
    });

    leaveRoom?.addEventListener('click', () => {
        window.location.href = '#/lobby';
    });

    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let socket = new WebSocket(wsProtocol + window.location.host + `/ws/api/room/${roomid}/?token=${token}`);

    // WebSocket Event Handlers
    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    socket.onclose = function(e) {
        console.log('Socket closed.', e.reason);
        setTimeout(() => {
            socket = new WebSocket(wsProtocol + window.location.host + `/ws/api/room/${roomid}/?token=${token}`);
        }, 1000);
    };

    socket.onopen = () => {
        console.log('Room WebSocket connected');

        if (join == 'player') {
            const data2 = {
                room_data: room,
                type:  'player_update'
            };
            socket.send(JSON.stringify(data2));
        } else if (join == 'host'){
            console.log(join);
            console.log(join);
            const data3 = {
                room_data: room,
                type:  'is_host'
            };
            socket.send(JSON.stringify(data3));
        }
        // const data = {
        //     room_data: room,
        //     type: 'update_list'
        // };
        // socket.send(JSON.stringify(data));
    };
                
    socket.onmessage = function(e) {
        try {
            const data = JSON.parse(e.data);
            console.log(data);
            if (data.type === 'game_start') {
                initPongGameVS(data.room_data.players[0].name,data.room_data.players[1].name,data.room_data.players[1].name);
                updateRoomInfo(room);
            } else if (data.type === 'kick_all') {
                socket.close();
                window.location.href = '#/'
            } else if (data.type === 'host_update') {
                if (join == 'player') {
                    room = data.room_data;
                    updateRoomInfo(data.room_data);
                }
            } else if (data.type === 'player_update') {
                if (join == 'host') {
                    if (room.players.length == 1) { 
                        room.players.push(data.room_data.players[0]);
                    }
                    const data2 = {
                        room_data: room,
                        type:  'host_update'
                    };
                    socket.send(JSON.stringify(data2));
                    updateRoomInfo(room);
                }
            } else if (data.type === 'ready') {
                readyBtn.style.display = 'none';
                startBtn.style.display = 'block';
            } else if (data.type === 'not_ready') {
                readyBtn.style.display = 'block';
                startBtn.style.display = 'none';
            } else {
                console.error("Unexpected message type", data.type);
            }
        } catch (error) {
            console.error("Error processing message", error);
        }
    };
}

function updateRoomInfo(room) {
    const txtRoomName = document.getElementById('txtRoomName');
    const txtRoomType = document.getElementById('txtRoomType');

    if (txtRoomName)
        txtRoomName.innerHTML = room.name;
    if (txtRoomType)
        txtRoomType.innerHTML = room.type;

    const playersList = document.getElementById('playersList');
    if (playersList) {
        playersList.innerHTML = generatePlayersList(room.players);
    }
}

function generatePlayersList(players) {
    return players.map(player => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <i class="bi bi-person-fill me-2"></i>
                ${player.name}
                ${player.host ? '<span class="badge bg-primary ms-2">Host</span>' : ''}
            </div>
            <span style="display:none" class="badge bg-${player.ready ? 'success' : 'secondary'} rounded-pill">
                ${player.ready ? 'Ready' : 'Not Ready'}
            </span>
        </div>
    `).join('');
}