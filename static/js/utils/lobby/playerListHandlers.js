import { animate } from '../animation.js';

export function initPlayerListHandlers() {
    const onlinePlayersList = document.querySelector('.list-group-flush');
    if (onlinePlayersList) {
        animate.staggerChildren(onlinePlayersList, '.list-group-item');
    }
}