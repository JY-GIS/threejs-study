import * as THREE from 'three'

// 创建场景所需的基础灯光。
export function createLights() {
    // 环境光没有明确方向，会均匀照亮物体。
    const ambientLight = new THREE.AmbientLight(
        'white',
        0.4,
    )

    // 平行光的光线互相平行，常用于模拟太阳光。
    const directionalLight = new THREE.DirectionalLight(
        'white',
        3,
    )

    // 平行光默认从自身位置照向坐标原点。
    directionalLight.position.set(
        5,
        5,
        5,
    )

    return {
        ambientLight,
        directionalLight,
    }
}

// 创建接收阴影的地面。
// 当前函数只负责创建地面，receiveShadow 稍后统一配置。
export function createFloor() {
    const geometry = new THREE.PlaneGeometry(
        10,
        10,
    )

    const material = new THREE.MeshStandardMaterial({
        color: '#808080',
        roughness: 1,
        metalness: 0,
    })

    const floor = new THREE.Mesh(
        geometry,
        material,
    )

    // PlaneGeometry 默认位于 XY 平面。
    // 绕 X 轴旋转 -90°，将它放倒到 XZ 平面。
    floor.rotation.x = -Math.PI / 2

    floor.position.y = -0.25

    return floor
}

// 统一配置阴影成立所需的四个条件。
export function configureShadows({
    renderer,
    light,
    caster,
    receiver,
}) {
    // 条件一：渲染器开启 Shadow Map。
    renderer.shadowMap.enabled = true

    // 条件二：光源允许生成阴影。
    light.castShadow = true

    // 条件三：物体参与阴影深度图渲染。
    caster.castShadow = true

    // 条件四：另一个物体接收阴影。
    receiver.receiveShadow = true
}