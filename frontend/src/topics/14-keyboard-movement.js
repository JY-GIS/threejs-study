import * as THREE from 'three'

// 车辆每秒移动 2 个世界单位。
const movementSpeed = 2

// 创建键盘移动控制器。
export function setupKeyboardMovement() {
    // Set 用于保存当前正被按住的按键。
    const pressedKeys = new Set()

    // 复用同一个 Vector3，避免每一帧创建新对象。
    const movementDirection = new THREE.Vector3()

    function handleKeyDown(event) {
        // event.code 使用键盘物理按键位置，不受 Shift 大小写状态影响。
        pressedKeys.add(event.code)
    }

    function handleKeyUp(event) {
        pressedKeys.delete(event.code)
    }

    function handleWindowBlur() {
        // 窗口失去焦点时可能收不到 keyup，所以清空状态，避免车辆持续移动。
        pressedKeys.clear()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)

    // 每一帧调用一次。
    function updateMovement(object, deltaTime) {
        // GLB 尚未加载完成时，object 为 null。
        if (!object) return

        // 每一帧先清空上次方向。
        movementDirection.set(0, 0, 0)

        // 牛奶车车头经过模型根节点旋转后朝向世界 +Z。
        if (pressedKeys.has('KeyW')) {
            movementDirection.z += 1
        }

        if (pressedKeys.has('KeyS')) {
            movementDirection.z -= 1
        }

        if (pressedKeys.has('KeyA')) {
            movementDirection.x += 1
        }

        if (pressedKeys.has('KeyD')) {
            movementDirection.x -= 1
        }

        // 没有按移动键时不进行计算。
        if (movementDirection.lengthSq() === 0) {
            return
        }

        // normalize() 将方向长度变为 1。
        // 这样同时按 W+D 时不会比只按 W 移动得更快。
        movementDirection.normalize()

        // 移动方向 × 每秒速度 × 帧间隔。
        movementDirection.multiplyScalar(
            movementSpeed * deltaTime,
        )

        // 修改模型根节点，所有车身和车轮都会跟随。
        object.position.add(movementDirection)
    }

    // 移除本模块注册的全部监听器。
    function disposeKeyboardMovement() {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        window.removeEventListener('blur', handleWindowBlur)

        pressedKeys.clear()
    }

    return {
        updateMovement,
        disposeKeyboardMovement,
    }
}