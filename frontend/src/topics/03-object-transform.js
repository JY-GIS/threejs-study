import * as THREE from 'three'

// 将“每秒旋转多少度”转换为“每秒旋转多少弧度”。
// 这些值只需要计算一次，不需要在每一帧重复计算。
const rotationSpeedX = THREE.MathUtils.degToRad(20)
const rotationSpeedY = THREE.MathUtils.degToRad(45)
const rotationSpeedZ = THREE.MathUtils.degToRad(30)

// 设置立方体的初始变换。
// object 的 position、rotation、scale 都来自 Object3D。
export function applyCubeTransform(cube) {
    // rotation 使用弧度。
    cube.rotation.x = THREE.MathUtils.degToRad(30)
    cube.rotation.y = THREE.MathUtils.degToRad(45)

    // 三个轴使用相同数值，表示等比放大 1.5 倍。
    cube.scale.set(
        1.5,
        1.5,
        1.5,
    )

    // 设置立方体在父级坐标系中的位置。
    cube.position.set(
        1, // X
        1, // Y
        0, // Z
    )
}

// 根据当前帧经过的时间更新旋转。
// deltaTime 的单位是秒。
export function updateCubeRotation(cube, deltaTime) {
    // 旋转速度 × 经过时间 = 当前帧需要增加的角度。
    cube.rotation.x += rotationSpeedX * deltaTime
    cube.rotation.y += rotationSpeedY * deltaTime
    cube.rotation.z += rotationSpeedZ * deltaTime
}