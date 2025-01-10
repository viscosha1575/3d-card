const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const loader = new THREE.GLTFLoader();
let card;

loader.load(
    'squid_game_card.glb', // Замените на путь к вашей GLB модели
    (gltf) => {
        card = gltf.scene; // Загруженная сцена
        card.scale.set(1, 1, 1);

        // Сделать материалы двусторонними
        card.traverse((node) => {
            if (node.isMesh) {
                node.material.side = THREE.DoubleSide;
            }
        });

        scene.add(card);
    },
    undefined,
    (error) => {
        console.error('Ошибка загрузки модели:', error);
    }
);

// Камера
camera.position.set(0, 0, 5); // Камера перед объектом
camera.lookAt(0, 0, 0); // Направлена на центр сцены

// Анимация
let isFlipping = false;
let rotationTarget = 0;

function animate() {
    requestAnimationFrame(animate);

    if (card) { // Убедитесь, что модель загружена
        if (isFlipping) {
            if (Math.abs(card.rotation.y - rotationTarget) > 0.01) {
                card.rotation.y += (rotationTarget - card.rotation.y) * 0.05; // Медленный поворот
            } else {
                card.rotation.y = rotationTarget;
                isFlipping = false;
            }
        }
    }

    renderer.render(scene, camera);
}
animate();

// Событие клика
document.addEventListener('click', () => {
    if (!isFlipping && card) { // Убедитесь, что модель загружена
        isFlipping = true;
        rotationTarget += Math.PI; // Поворот на 180 градусов
    }
});

// Обработка изменения размеров окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
