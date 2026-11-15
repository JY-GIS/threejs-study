import './style.css'

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

// 模型是异步加载的。
// 动画循环启动时这个数组为空，加载完成后再放入车轮节点。
const truckWheels = []

loadGLTFModel(
  '/models/CesiumMilkTruck.glb',
  scene,

  (model) => {
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
    }
    if (secondWheels) {
      truckWheels.push(secondWheels)
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
  },
})

// 停止当前场景的持续渲染和用户交互。
function stopSceneActivity() {
  // 不再接收迟到的 GLB 加载结果。
  sceneIsActive = false

  // 停止持续渲染和各项事件监听。
  stopAnimationLoop()
  disposePicking()
  disposeResponsiveCanvas()
  controls.dispose()

  // 1. 从场景中移除，后续帧不再绘制这个立方体。
  scene.remove(cube)
  // 2. 从拾取列表中移除，避免射线继续检测它。
  const index = pickableObjects.indexOf(cube)
  if (index !== -1) {
    pickableObjects.splice(index, 1)
  }
  // 3. 释放当前立方体独占的渲染资源。
  cube.geometry.dispose()
  cube.material.dispose()
  colorTexture.dispose()

  // 虽然动画循环已经停止，但仍可以手动渲染一次。
  // 此时 cube 已不在 scene 中，所以新画面不会包含它。
  renderer.render(scene, camera)

  console.log('场景交互已停止，立方体资源已请求释放')
}

// // 仅用于实验：10 秒后停止场景交互。
// setTimeout(() => {
//   stopSceneActivity()
// }, 10000)