import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 创建轨道相机控制器。
// camera：需要被控制的相机。
// domElement：监听鼠标和滚轮事件的 HTML 元素。
export function createOrbitControls(camera, domElement) {
    const controls = new OrbitControls(
        camera,
        domElement,
    )

    // target 是相机环绕观察的中心点。
    // 当前设置为世界坐标原点。
    controls.target.set(
        0, // X
        0, // Y
        0, // Z
    )

    // 相机位置或 target 被手动修改后，
    // 调用 update() 让控制器应用当前状态。
    controls.update()

    return controls
}