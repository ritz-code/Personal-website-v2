import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
* Base
*/
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const city = new THREE.Object3D()
const smoke = new THREE.Object3D()
const cubesAll = new THREE.Object3D()
scene.add(cubesAll)

//Logo
/*var context = canvas.getContext("2d");
context.fillStyle = "white";
context.font = "bold 18px Arial";
context.fillText("Text", 20, 20); */

/**
 * Debug
 */
const gui = new dat.GUI()
//#050506
const parameters = {
    materialColor: '#050506',
    backgroundColor: '#0f0e16'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        //scene.background = new THREE.Color(parameters.backgroundColor)
    })

gui
    .addColor(parameters, 'backgroundColor')
    .onChange(() => {
        scene.background = new THREE.Color(parameters.backgroundColor)
    })

const createCarPos = true
const uSpeed = 0.001

//FOG background
var setColor = 0xF02050

scene.background = new THREE.Color(parameters.backgroundColor)
scene.fog = new THREE.Fog(parameters.backgroundColor, 2, 17)

// Cube Design

const geometry = new THREE.IcosahedronGeometry(0.3)
const material = new THREE.MeshLambertMaterial({
    color: parameters.materialColor,
    //opacity: 0.03,
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

    //floor.scale.y = 0.05

    const cubeWidth = 0.5
    var s = .1 + Math.random()
    //cube.scale.set(Math.random() * )
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
var aparticular = 5;

for (var h = 1; h < 300; h++) {
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5);
    particular.rotation.set(Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5, Math.random() * 5 - Math.random() * 5);
    smoke.add(particular);
};

scene.add(smoke)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 15
scene.add(camera)

/*
* Lights
*/
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 10)
var lightFront = new THREE.SpotLight(0xFFFFFF, 30, 10, 90)
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


//Grid helper
var gridHelper = new THREE.GridHelper(60, 120, 0x999999, 0x999999);
gridHelper.position.z = -9
gridHelper.rotation.x = 45 * Math.PI / 180
scene.add(gridHelper)

/**
* Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //to make the background transparent from initial black
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Orbit Control
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const animate = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (camera.position.z >= 7) {
        //camera.position.z = 10
        camera.position.z -= elapsedTime / 1000
    }

    // Render
    renderer.render(scene, camera)
    controls.update()

    smoke.rotation.y += 0.005;
    smoke.rotation.x += 0.005;

    cubesAll.rotation.x += 0.005;
    //cubesAll.rotation.z += 0.005;

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}
animate()

