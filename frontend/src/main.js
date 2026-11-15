import './style.css'
import * as THREE from 'three'

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
import {
  setupResponsiveCanvas,
} from './topics/09-responsive-canvas.js'
import {
  setupPicking,
} from './topics/10-raycaster.js'
import {
  printObjectTree,
} from './topics/11-object3d-hierarchy.js'
import {
  updateWheelRotation,
} from './topics/12-wheel-animation.js'
import {
  logObjectCoordinates,
  logPointConversion,
} from './topics/13-coordinate-space.js'
import {
  setupKeyboardMovement,
} from './topics/14-keyboard-movement.js'
import {
  updateCameraFollow,
} from './topics/15-camera-follow.js'
import {
  setupCameraMode,
} from './topics/16-camera-mode.js'
import {
  disposeObjectTrees,
} from './topics/17-scene-disposal.js'

// ==================== 1. Scene、Camera、Renderer ====================

const scene = createScene()

const axesHelper = createAxesHelper(3)
scene.add(axesHelper)

const camera = createCamera()

const renderer = createRenderer(
  document.querySelector('#app'),
)

// 同步 Canvas 尺寸与相机宽高比，并监听窗口变化。
const disposeResponsiveCanvas = setupResponsiveCanvas(
  camera,
  renderer,
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

// userData 是 Object3D 自带的普通对象 , 可以在里面保存项目需要的自定义信息
cube.userData.info = {
  id: 'cube-001',
  name: '猪小屁立方体',
  category: '练习物体',
}

// 集中设置立方体的初始位置、旋转和缩放。
applyCubeTransform(cube)

scene.add(cube)

// ==================== 5. 地面与阴影 ====================

const floor = createFloor()
floor.userData.info = {
  id: 'floor-001',
  name: '灰色地面',
  category: '地面',
}
scene.add(floor)

// 保存需要参与射线拾取的对象。模型加载完成后，会继续添加到这个数组中。
const pickableObjects = [cube, floor]

// 立方体和地面都创建完成后，再传给拾取函数。
const disposePicking = setupPicking(
  camera,
  renderer.domElement,
  cube,
  floor,
  pickableObjects,
)

// 集中配置渲染器、灯光、投射物和接收物。
configureShadows({
  renderer,
  light: directionalLight,
  caster: cube,
  receiver: floor,
})

// ==================== 8. glTF 模型加载 ====================
// true 表示当前场景仍然需要接收异步加载结果。
let sceneIsActive = true

// 模型加载完成前为 null。
let truckModel = null

// 模型是异步加载的。
// 动画循环启动时这个数组为空，加载完成后再放入车轮节点。
const truckWheels = []

loadGLTFModel(
  '/models/CesiumMilkTruck.glb',
  scene,

  (model) => {
    // 保存模型根节点，供动画循环和键盘控制使用。
    truckModel = model

    model.scale.setScalar(0.5)

    // 将业务信息放到模型根对象上。
    model.userData.info = {
      id: 'model-001',
      name: 'Cesium 牛奶车',
      category: '多层级 GLB 模型',
    }

    // 从模型根节点开始，递归输出完整场景树。
    printObjectTree(model)

    // getObjectByName() 会从 model 开始递归查找后代。
    const wheels = model.getObjectByName('Wheels')
    const secondWheels = model.getObjectByName('Wheels001')
    const truckBody = model.getObjectByName('Cesium_Milk_Truck')

    // getObjectByName() 找不到对象时会返回 undefined。
    // 只有查找成功才放入动画数组。
    if (wheels) {
      truckWheels.push(wheels)
      logObjectCoordinates(wheels, '第一组车轮')

      // 车轮局部坐标中的一个点。
      // 它位于车轮自身原点沿局部 X 轴 0.4 个单位的位置。
      const localWheelPoint = new THREE.Vector3(0.4, 0, 0)

      logPointConversion(wheels, localWheelPoint, '第一组车轮表面点')
    }
    if (secondWheels) {
      truckWheels.push(secondWheels)
      logObjectCoordinates(secondWheels, '第二组车轮')
    }
    console.log(`找到 ${truckWheels.length} 组车轮节点`)

    console.log('车身节点：', truckBody)
    console.log('第一组车轮：', wheels)
    console.log('第二组车轮：', secondWheels)

    // parent 只表示直接父节点。
    console.log('第一组车轮的直接父节点：', wheels?.parent)
    console.log('第一组车轮的上两级节点：', wheels?.parent?.parent)

    // 将模型根节点登记为一个可拾取整体。
    pickableObjects.push(model)

    console.log('牛奶车已加入拾取列表')
  },

  // 加载完成时调用这个函数，读取 sceneIsActive 的最新值。
  () => sceneIsActive,
)

// ==================== 4. OrbitControls ====================

const controls = createOrbitControls(
  camera,
  renderer.domElement,
)

const {
  updateMovement,
  disposeKeyboardMovement,
} = setupKeyboardMovement()

const {
  isFollowMode,
  disposeCameraMode,
} = setupCameraMode(
  controls,

  // 这里必须传函数，而不是直接传 truckModel。调用时会读取异步加载完成后的最新值。
  () => truckModel,
)

// ==================== 6. 动画循环 ====================

const stopAnimationLoop = startAnimationLoop({
  renderer,
  scene,
  camera,

  onUpdate(deltaTime) {
    // 原有立方体动画。
    updateCubeRotation(cube, deltaTime)

    // 更新牛奶车的两组车轮。
    updateWheelRotation(
      truckWheels,
      deltaTime,
    )

    // 先移动汽车。
    updateMovement(
      truckModel,
      deltaTime,
    )

    if (isFollowMode()) {
      updateCameraFollow(
        camera,
        truckModel,
      )
    }
  },
})

const destroyButton = document.querySelector('#destroy-scene-button')
const infoPanel = document.querySelector('#info-panel')

// 点击按钮后彻底停止并销毁当前 Three.js 场景。
function destroyScene() {
  // 防止重复执行销毁逻辑。
  if (!sceneIsActive) return

  // 不再接收迟到的 GLB 加载结果。
  sceneIsActive = false

  // 第一层：停止会持续运行的动画和全部事件监听。
  stopAnimationLoop()
  disposePicking()
  disposeResponsiveCanvas()
  disposeCameraMode()
  disposeKeyboardMovement()
  controls.dispose()
  destroyButton.removeEventListener('click', destroyScene)

  // 第二层：递归释放场景对象持有的 Geometry、Material 和 Texture。
  // cube 的 colorTexture 会从 cube.material.map 中找到，无需再次手动 dispose。
  const disposedResources = disposeObjectTrees([
    axesHelper,
    cube,
    floor,
    truckModel,
  ])

  // 清空仍然保存 Object3D 引用的业务数组和变量。
  pickableObjects.length = 0
  truckWheels.length = 0
  truckModel = null

  // 清除剩余的灯光等节点，并解除背景颜色引用。
  scene.clear()
  scene.background = null

  // 第三层：释放渲染器内部资源，并移除它创建的 Canvas。
  renderer.dispose()
  renderer.domElement.remove()

  // 按钮保留在页面上，用来显示最终状态，但已经不能再次点击。
  destroyButton.disabled = true
  destroyButton.textContent = '场景已销毁'
  infoPanel.textContent = '动画、事件、场景资源和 Canvas 已全部销毁'

  console.log('已释放的场景资源：', disposedResources)
}

destroyButton.addEventListener('click', destroyScene)
