import SceneManager from './SceneManager.js'

const canvas = document.getElementById('canvas');
const sceneManager = new SceneManager(canvas);
bindEventListeners();
render();

function bindEventListeners() {
	window.onresize = resizeCanvas;
	window.onpointermove = movePointer;
	window.onclick = click;
	resizeCanvas();	
}

function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height = '100vh';
	
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize();
}

function movePointer(event) {
	const x = event.clientX
	const y = event.clientY

	sceneManager.onPointerMove(x, y);
}

function click() {
	sceneManager.onClick();
}

function render() {
    requestAnimationFrame(render);
    sceneManager.update();
}


// TODO: create a readme, crediting the organizing code