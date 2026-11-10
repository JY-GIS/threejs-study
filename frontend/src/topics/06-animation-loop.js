// 启动动画循环。
// onUpdate 是外部传入的函数，负责更新每帧的场景状态。
export function startAnimationLoop({
    renderer,
    scene,
    camera,
    onUpdate,
}) {
    let previousTime

    // 浏览器调用时传入 currentTime，单位为毫秒。
    function animate(currentTime) {
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

        // 再申请下一帧。
        requestAnimationFrame(animate)
    }

    // 申请第一帧，启动循环。
    requestAnimationFrame(animate)
}