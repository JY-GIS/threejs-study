// 启动动画循环。
// onUpdate 是外部传入的函数，负责更新每帧的场景状态。
export function startAnimationLoop({
    renderer,
    scene,
    camera,
    onUpdate,
}) {
    let previousTime

    // 保存最近一次申请动画帧时返回的编号。
    let animationFrameId

    // 记录循环是否已经停止。
    let stopped = false

    // 浏览器调用时传入 currentTime，单位为毫秒。
    function animate(currentTime) {
        if (stopped) return

        // 第一帧还没有上一帧，让时间差为 0。
        if (previousTime === undefined) {
            previousTime = currentTime
        }

        // 两帧之间经过的时间，单位转换为秒。
        const deltaTime = (currentTime - previousTime) / 1000
        previousTime = currentTime

        // 先更新物体状态，再绘制当前帧。
        onUpdate(deltaTime)
        renderer.render(scene, camera)

        // onUpdate 可能触发停止操作；停止后不再申请下一帧。
        if (!stopped) {
            animationFrameId = requestAnimationFrame(animate)
        }
    }

    // 启动第一帧，并保存返回的请求编号。
    animationFrameId = requestAnimationFrame(animate)

    // 返回停止函数，交给调用方在适当的时候使用。
    return function stopAnimationLoop() {
        stopped = true
        cancelAnimationFrame(animationFrameId)
    }
}