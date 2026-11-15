import * as THREE from 'three'

// 创建自由视角与跟随视角切换器。
//
// controls：OrbitControls
// getTarget：用于取得当前车辆模型的函数
export function setupCameraMode(
    controls,
    getTarget,
) {
    const targetWorldPosition = new THREE.Vector3()

    // 默认使用第三人称跟随模式。
    let cameraMode = 'follow'
    controls.enabled = false

    function handleKeyDown(event) {
        // 只处理 V 键。
        if (event.code !== 'KeyV') return

        // 按住 V 时浏览器会重复触发 keydown。
        // 这里只允许每次实际按下切换一次。
        if (event.repeat) return

        if (cameraMode === 'follow') {
            cameraMode = 'free'
            controls.enabled = true

            // 自由视角应围绕车辆当前位置旋转，
            // 而不是继续围绕初始世界原点。
            const target = getTarget()

            if (target) {
                target.getWorldPosition(targetWorldPosition)

                controls.target.copy(targetWorldPosition)
                controls.update()
            }

            console.log('切换到自由视角')
        } else {
            cameraMode = 'follow'
            controls.enabled = false

            console.log('切换到第三人称跟随视角')
        }
    }

    window.addEventListener('keydown', handleKeyDown)

    // 外部动画循环通过这个函数查询当前模式。
    function isFollowMode() {
        return cameraMode === 'follow'
    }

    function disposeCameraMode() {
        window.removeEventListener('keydown', handleKeyDown)
    }

    return {
        isFollowMode,
        disposeCameraMode,
    }
}