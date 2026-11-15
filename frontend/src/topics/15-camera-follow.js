import * as THREE from 'three'

// 复用 Vector3，避免每一帧创建新对象。
const targetWorldPosition = new THREE.Vector3()

// 相机相对车辆的世界坐标偏移：
// Y +3：车辆上方
// Z -6：车辆后方
const cameraOffset = new THREE.Vector3(
    0,
    6,
    -3,
)

// 每帧更新一次相机位置和朝向。
export function updateCameraFollow(
    camera,
    target,
) {
    // GLB 尚未加载完成时，没有可跟随目标。
    if (!target) return

    // 获取车辆根节点在世界坐标中的位置。
    target.getWorldPosition(targetWorldPosition)

    // 将相机放到车辆世界位置。
    camera.position.copy(targetWorldPosition)

    // 再加上“后上方”的偏移。
    camera.position.add(cameraOffset)

    // 让相机始终看向车辆世界位置。
    camera.lookAt(targetWorldPosition)
}