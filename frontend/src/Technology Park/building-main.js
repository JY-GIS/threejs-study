import '../style.css'
import {
    createAxesHelper,
    createCamera,
    createRenderer,
    createScene,
} from '../topics/01-scene-camera-renderer.js'
import { createOrbitControls } from '../topics/04-orbit-controls.js'
import { createLights } from '../topics/05-light-and-shadow.js'
import { startAnimationLoop } from '../topics/06-animation-loop.js'
import { setupResponsiveCanvas } from '../topics/09-responsive-canvas.js'
import { createCampus } from './create-campus.js'
import { setupCampusShadows } from './campus-shadows.js'

const scene = createScene()

const { ground, road, building, plinth, office } = createCampus()
scene.add(ground, road, building)

const axes = createAxesHelper(100)
// 略抬高坐标轴，让水平轴线清楚地显示在地面上。
axes.position.y = 0.05
scene.add(axes)

// 地面的 MeshStandardMaterial 使用场景灯光来计算表面明暗。
const { ambientLight, directionalLight } = createLights()
scene.add(ambientLight, directionalLight)

const camera = createCamera()
// 拉远相机，从斜上方看清地面的范围。
camera.position.set(92, 66, 92)

const container = document.querySelector('#app')
const renderer = createRenderer(container)
setupResponsiveCanvas(camera, renderer)

setupCampusShadows({ renderer, light: directionalLight, ground, plinth, office })

const controls = createOrbitControls(camera, renderer.domElement)
// 开启镜头滑动阻尼
controls.enableDamping = true
// 围绕原点观察时，把俯仰限制在地平线以上。
controls.maxPolarAngle = Math.PI / 2 - 0.02

startAnimationLoop({
    renderer,
    scene,
    camera,
    onUpdate() {
        controls.update()
    },
})