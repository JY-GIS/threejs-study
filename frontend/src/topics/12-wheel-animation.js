import * as THREE from 'three'

// 车轮每秒旋转 360°。
// Three.js 内部旋转使用弧度，所以先转换。
const wheelRotationSpeed = THREE.MathUtils.degToRad(360)

// 更新所有车轮节点的局部旋转。
export function updateWheelRotation(
    wheels,
    deltaTime,
) {
    wheels.forEach((wheel) => {
        // rotateY() 表示围绕物体自身的局部 Y 轴旋转。
        //
        // 旋转速度 × 两帧间隔时间
        // 得到这一帧应该增加的旋转角度。
        wheel.rotateY(
            wheelRotationSpeed * deltaTime,
        )
    })
}