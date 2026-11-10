import {
  createAxesHelper,
  createCamera,
  createRenderer,
  createScene,
} from './topics/01-scene-camera-renderer.js'
import {
  createCube,
} from './topics/02-geometry-material-mesh.js'
import {
  applyCubeTransform,
  updateCubeRotation,
} from './topics/03-object-transform.js'
import {
  createOrbitControls,
} from './topics/04-orbit-controls.js'
import {
  configureShadows,
  createFloor,
  createLights,
} from './topics/05-light-and-shadow.js'
import {
  startAnimationLoop,
} from './topics/06-animation-loop.js'
import {
  loadColorTexture,
} from './topics/07-texture.js'
import {
  loadGLTFModel,
} from './topics/08-gltf-loader.js'

// ==================== 1. Scene、Camera、Renderer ====================

const scene = createScene()

const axesHelper = createAxesHelper(3)
scene.add(axesHelper)

const camera = createCamera()

const renderer = createRenderer(
  document.querySelector('#app'),
)

// ==================== 5. 光源 ====================

const {
  ambientLight,
  directionalLight,
} = createLights()

scene.add(
  ambientLight,
  directionalLight,
)

// ==================== 7. 纹理 ====================

// public/pig.png 对应浏览器路径 /pig.png。
const colorTexture = loadColorTexture('/pig.png')

// ==================== 4. Geometry、Material、Mesh ====================
const cube = createCube(colorTexture)

// 集中设置立方体的初始位置、旋转和缩放。
applyCubeTransform(cube)

scene.add(cube)

// ==================== 5. 地面与阴影 ====================

const floor = createFloor()
scene.add(floor)

// 集中配置渲染器、灯光、投射物和接收物。
configureShadows({
  renderer,
  light: directionalLight,
  caster: cube,
  receiver: floor,
})

// ==================== 8. glTF 模型加载 ====================

loadGLTFModel('/models/Box.glb', scene)

// ==================== 8. OrbitControls ====================

const controls = createOrbitControls(
  camera,
  renderer.domElement,
)

// ==================== 6. 动画循环 ====================

startAnimationLoop({
  renderer,
  scene,
  camera,

  // deltaTime 由动画模块提供，单位为秒。
  onUpdate(deltaTime) {
    updateCubeRotation(cube, deltaTime)
  },
})