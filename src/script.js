import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/* Canvas for ThreeJS */
const canvas = document.querySelector('canvas.webgl')

/* Scene */
const scene = new THREE.Scene()
const city = new THREE.Object3D()
const smoke = new THREE.Object3D()
const cubesAll = new THREE.Object3D()
scene.add(cubesAll)


const createCarPos = true
const uSpeed = 0.001

/*FOG background */
scene.background = new THREE.Color('#0f0e16')
scene.fog = new THREE.Fog('#0f0e16', 2, 17)


/* Cube Geometry, Material and Design */
const geometry = new THREE.IcosahedronGeometry(0.3)
const material = new THREE.MeshLambertMaterial({
    color: '#27273e',
    opacity: 0.1,
    side: THREE.DoubleSide
})

for (var i = 1; i < 18; i++) {

    const cube = new THREE.Mesh(geometry, material)
    const wire = new THREE.Mesh(geometry, material)
    const floor = new THREE.Mesh(geometry, material)
    const wfloor = new THREE.Mesh(geometry, material)

    cube.add(wfloor)
    cube.castShadow = true
    cube.receiveShadow = true

    var s = .1 + Math.random()

    cube.position.x = (Math.random() - 0.5) * 2
    cube.position.y = (Math.random() - 0.5) * 2
    cube.position.z = (Math.random() - 0.5) * 2

    cube.scale.set(s, s, s)

    cubesAll.add(floor)
    cubesAll.add(cube)
}

//Particular
var gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
var gparticular = new THREE.CircleGeometry(0.0075, 3);

for (var h = 1; h < 300; h++) {
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5);
    particular.rotation.set(Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5);
    smoke.add(particular);
};

scene.add(smoke)


/* Sizes for window width and height */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/* Window resize */
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/* Base camera */
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 11
scene.add(camera)

/* Lights */
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10, 50)
var lightBack = new THREE.PointLight(0xFFFFFF, 0.5)

lightFront.rotation.x = 45 * Math.PI / 180
lightFront.rotation.z = -45 * Math.PI / 180
lightFront.position.set(5, 5, 5)
lightFront.castShadow = true
lightFront.shadow.mapSize.width = 6000
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width
lightFront.penumbra = 0.1
lightBack.position.set(0, 6, 0)

scene.add(ambientLight)
scene.add(lightBack)
scene.add(lightFront);

const clock = new THREE.Clock()
let previousTime = 0


/* Grid helper */
var gridHelper = new THREE.GridHelper(60, 120, 0x999999, 0x999999);
gridHelper.position.z = -9
gridHelper.rotation.x = 45 * Math.PI / 180
scene.add(gridHelper)

/* Renderer */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* Orbit Control */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const animate = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (camera.position.z >= 7) {
        camera.position.z -= elapsedTime / 1000
    }

    /* Render */
    renderer.render(scene, camera)
    controls.update()

    smoke.rotation.y += 0.005;
    smoke.rotation.x += 0.005;

    cubesAll.rotation.x += 0.005;

    window.requestAnimationFrame(animate)
}
animate()

