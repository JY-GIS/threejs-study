import * as THREE from 'three'

// 创建场景。
// Scene 是三维对象、灯光和辅助器等内容的根容器。
export function createScene() {
    const scene = new THREE.Scene()

    // 设置场景背景颜色。
    scene.background = new THREE.Color(0x202025)

    return scene
}

// 创建坐标轴辅助器。
// 红色为 X，绿色为 Y，蓝色为 Z。
export function createAxesHelper(size = 3) {
    return new THREE.AxesHelper(size)
}

// 创建透视相机。
export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, // fov：垂直视野角
        window.innerWidth / window.innerHeight, // aspect：宽高比
        0.1, // near：近裁剪面
        1000, // far：远裁剪面
    )

    // position.set(x, y, z) 一次设置相机位置。
    camera.position.set(
        1.5,
        1.5,
        5,
    )

    return camera
}

// 创建 WebGL 渲染器。
// container 是放置 Canvas 的 HTML 元素。
export function createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    })

    // 设置 Canvas 绘制尺寸。
    renderer.setSize(
        window.innerWidth,
        window.innerHeight,
    )

    // renderer.domElement 是渲染器创建的 Canvas。
    container.appendChild(renderer.domElement)

    return renderer
}