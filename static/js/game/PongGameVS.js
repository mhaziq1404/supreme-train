import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';

export function initPongGameVS(player1 = null, player2 = null, socketuser = null, roomid = 0) {
    // Game state
    console.log("PONG GAME VS INITIALISE");

    const state = {
        paused: false,
        gameOver: false,
        scores: { player1: 0, player2: 0 },
        paddleSpeed: 0.1,
        ballSpeed: { x: 0, y: 0 }
    };

    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let socket = new WebSocket(wsProtocol + window.location.host + `/ws/api/pong/${roomid}/?token=${token}`);

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    socket.onopen = function() {
        console.log('Pong game WebSocket connection established');
    };

    socket.onclose = function(e) {
        console.log('Socket closed. Reconnecting in 1 second.', e.reason);
        setTimeout(() => {
            socket = new WebSocket(wsProtocol + window.location.host + `/ws/api/pong/${roomid}/?token=${token}`);
        }, 1000);
    };
                
    socket.onmessage = function(e) {
        try {
            const data = JSON.parse(e.data);
            if (data.type === 'start_game') {
                console.log('game started.....')
                resetGame();
                animate();
                resetBall(1);
            } else if (data.type === 'score_update') {
                document.getElementById('vsplayer1Score').textContent = data.scores.player1;
                document.getElementById('vsplayer2Score').textContent = data.scores.player2;
            } else if (data.type === 'ball_update') {
                ball.position.x = data.ball.x;
                ball.position.y = data.ball.y;
                state.ballSpeed.x = data.ballSpeed.x;
                state.ballSpeed.y = data.ballSpeed.y;
            }else if (data.type === 'paddle1_update') {
                paddle1.position.y = data.paddle1.y;
            }else if (data.type === 'paddle2_update') {
                paddle2.position.y = data.paddle2.y;
            } else if (data.type === 'game_over') {
                gameOver = true;
            } else {
                console.error("Unexpected message type", data.type);
            }
        } catch (error) {
            console.error("Error processing message", error);
        }
    };

    let animationFrameId; // Variable to store the animation frame ID
    let lastSendTime = 0;
    let debounceTime = 100;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.rotation.x = THREE.MathUtils.degToRad(45);
    camera.position.y = -20;
    camera.position.z = 20;

    // Renderer setup
    const canvas = document.getElementById('vspongCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Game objects (initial setup will be done inside a reset function)
    let paddle1, paddle2, ball, centerLine, wall, wall2;

    // Function to reset the game state and scene
    function resetGame() {
        // Reset game state
        state.paused = false;
        state.gameOver = false;
        state.scores.player1 = 0;
        state.scores.player2 = 0;

        // Reset score display
        document.getElementById('vsplayer1Score').textContent = '0';
        document.getElementById('vsplayer2Score').textContent = '0';

        // Clear previous game objects if any
        if (paddle1) scene.remove(paddle1);
        if (paddle2) scene.remove(paddle2);
        if (wall) scene.remove(wall);
        if (wall2) scene.remove(wall2);
        if (ball) scene.remove(ball);
        if (centerLine) scene.remove(centerLine);
        
        // Recreate game objects
        paddle1 = createPaddle(-7);
        paddle2 = createPaddle(7);
        ball = createBall();
        centerLine = createCenterLine();
        wall = createWall(3);
        wall2 = createWall(-3)

        // Add new objects to the scene
        scene.add(paddle1, paddle2, ball, centerLine, wall, wall2);
    }

    function createPaddle(x) {
        const geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const paddle = new THREE.Mesh(geometry, material);
        paddle.position.x = x;
        return paddle;
    }

    function createWall(x) {
        const geometry = new THREE.BoxGeometry(15, 0.2, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const wall = new THREE.Mesh(geometry, material);
        wall.position.y = x;
        return wall;
    }

    function createBall() {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    function createCenterLine() {
        const geometry = new THREE.PlaneGeometry(0.1, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const line = new THREE.Mesh(geometry, material);
        line.position.x = 0;
        return line;
    }

    function resetBall(x) {
        if (socketuser != player1)
            return ;
        ball.position.set(0, 0, 0);
        state.ballSpeed.x = 0.05 * (x == 1 ? 1 : -1);
        state.ballSpeed.y = 0.05 * (x == 1 ? 1 : -1);
        const gamestate = {
            ball: { x: ball.position.x, y: ball.position.y },
            ballSpeed: { x: state.ballSpeed.x, y: state.ballSpeed.y },
            type: 'ball_update'
        };
        socket.send(JSON.stringify(gamestate));
    }

    function updateScore(player) {
        if (player === 1) state.scores.player1 += 1;
        else state.scores.player2 += 1;

        document.getElementById('vsplayer1Score').textContent = state.scores.player1;
        document.getElementById('vsplayer2Score').textContent = state.scores.player2;
        if (socketuser == player1) {
            const gamestate = {
                scores: { player1: state.scores.player1, player2: state.scores.player2 },
                type: 'score_update'
            };
            socket.send(JSON.stringify(gamestate));
        }

        if (state.scores.player1 >= 11 || state.scores.player2 >= 11) {
            endGame();
        } else if (socketuser == player1) {
            resetBall(player);
        }
    }

    function updateBall() {
        if (state.gameOver)
            return ;
        if (socketuser == player1) {
            ball.position.x += state.ballSpeed.x;
            ball.position.y += state.ballSpeed.y;
            const gamestateball = {
                ball: { x: ball.position.x, y: ball.position.y },
                ballSpeed: { x: state.ballSpeed.x, y: state.ballSpeed.y },
                type: 'ball_update'
            };
            socket.send(JSON.stringify(gamestateball));

            // Wall collisions
            if (ball.position.y >= 2.85 || ball.position.y <= -2.85) {
                if (ball.position.y >= 2.85)
                    ball.position.y = 2.85;
                if (ball.position.y <= -2.85)
                    ball.position.y = -2.85;
                state.ballSpeed.y *= -1;
                ball.position.x += state.ballSpeed.x;
                ball.position.y += state.ballSpeed.y;
                const gamestatewall = {
                    ball: { x: ball.position.x, y: ball.position.y },
                    ballSpeed: { x: state.ballSpeed.x, y: state.ballSpeed.y },
                    type: 'ball_update'
                };
                socket.send(JSON.stringify(gamestatewall));
            }

            // Paddle collisions
            if (ball.position.x <= -6.85 && ball.position.x >= -7.0) {
                if (ball.position.y <= paddle1.position.y + 1 &&
                    ball.position.y >= paddle1.position.y - 1) {
                    state.ballSpeed.x *= -1; // Increase speed slightly
                    state.ballSpeed.y = (ball.position.y - paddle1.position.y) * 0.5; // Add spin
                    const gamestatepaddle1 = {
                        ball: { x: ball.position.x, y: ball.position.y },
                        ballSpeed: { x: state.ballSpeed.x, y: state.ballSpeed.y },
                        type: 'ball_update'
                    };
                    socket.send(JSON.stringify(gamestatepaddle1));
                }
            }

            if (ball.position.x >= 6.85 && ball.position.x <= 7.0) {
                if (ball.position.y <= paddle2.position.y + 1 &&
                    ball.position.y >= paddle2.position.y - 1) {
                    state.ballSpeed.x *= -1; // Increase speed slightly
                    state.ballSpeed.y = (ball.position.y - paddle2.position.y) * 0.5; // Add spin
                    const gamestatepaddle2 = {
                        ball: { x: ball.position.x, y: ball.position.y },
                        ballSpeed: { x: state.ballSpeed.x, y: state.ballSpeed.y },
                        type: 'ball_update'
                    }
                    socket.send(JSON.stringify(gamestatepaddle2));
                }
            }
        }

        // Scoring
        if (ball.position.x < -8) updateScore(2);
        if (ball.position.x > 8) updateScore(1);
    }

    function endGame() {
        state.gameOver = true;
        const p1 = player1 ? player1 : 'Player 1';
        const p2 = player2 ? player2 : 'Player 2';
        const winner = state.scores.player1 > state.scores.player2 ? p1 : p2;
        const overlay = document.getElementById('vsgameOverlay');
        const message = document.getElementById('vsoverlayMessage');

        message.textContent = `${winner} Wins!`;
        overlay.style.display = 'flex';
        if (socketuser == player1) {
            const endgame = {
                type: 'end_game'
            };
            socket.send(JSON.stringify(endgame));
        }
    }

    function handleInput() {
        // Player 1 controls (W/S)
        let shouldSendUpdate = false;

        if (socketuser == player1){
            if (keys['KeyW'] && paddle1.position.y < 2) {
                paddle1.position.y += state.paddleSpeed;
                shouldSendUpdate = true
            }
            if (keys['KeyS'] && paddle1.position.y > -2) {
                paddle1.position.y -= state.paddleSpeed;
                shouldSendUpdate = true
            }
            
            if (shouldSendUpdate){
                const gamestate = {
                    paddle1: { y: paddle1.position.y },
                    type: 'paddle1_update'
                };
                socket.send(JSON.stringify(gamestate));
            }
        }
        else if (socketuser == player2){
            if (keys['ArrowUp'] && paddle2.position.y < 2) {
                paddle2.position.y += state.paddleSpeed;
                shouldSendUpdate = true
            }
            if (keys['ArrowDown'] && paddle2.position.y > -2) {
                paddle2.position.y -= state.paddleSpeed;
                shouldSendUpdate = true
            }
            
            if (shouldSendUpdate){
                const gamestate = {
                    paddle2: { y: paddle2.position.y },
                    type: 'paddle2_update'
                };
                socket.send(JSON.stringify(gamestate));
            }
        }
    }

    // Input handling
    const keys = {};
    window.addEventListener('keydown', e => keys[e.code] = true);
    window.addEventListener('keyup', e => keys[e.code] = false);

    // Button handlers
    document.getElementById('vspauseBtn')?.addEventListener('click', () => {
        state.paused = !state.paused;
        const btn = document.getElementById('vspauseBtn');
        btn.innerHTML = state.paused ?
            '<i class="bi bi-play-fill"></i> Resume' :
            '<i class="bi bi-pause-fill"></i> Pause';
    });

    document.getElementById('vsresetBtn')?.addEventListener('click', () => {
        resetGame();
        document.getElementById('vsgameOverlay').style.display = 'none';
    });

    document.getElementById('vsproceedBtn')?.addEventListener('click', () => {
        window.location.href = '#/';
    });

    // Animation loop
    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        if (!state.paused && !state.gameOver) {
            handleInput();
            updateBall();
        }

        renderer.render(scene, camera);
    }

    // Handle window resize
    function onWindowResize() {
        const container = document.getElementById('vsgameContainer');
        const aspect = container.clientWidth / container.clientHeight;

        camera.left = -aspect;
        camera.right = aspect;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    // Cancel any ongoing animation frame before starting a new one
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}