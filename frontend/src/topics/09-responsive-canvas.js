// 让 Renderer 和 PerspectiveCamera 响应浏览器窗口尺寸变化。
export function setupResponsiveCanvas(
    camera,
    renderer,
) {
    // 每次窗口尺寸发生变化时执行。
    function handleResize() {
        const width = window.innerWidth
        const height = window.innerHeight

        // devicePixelRatio 表示一个 CSS 像素对应多少物理像素。
        // 高分屏使用更高像素比会更清晰，但也会增加 GPU 开销。
        // 最大限制为 2，避免超高分屏产生过大的绘制缓冲区。
        const pixelRatio = Math.min(
            window.devicePixelRatio,
            2,
        )

        // 设置设备像素比。
        // 之后 setSize() 会根据它计算 Canvas 内部绘制分辨率。
        renderer.setPixelRatio(pixelRatio)

        // 更新 Canvas 和 WebGL viewport 的尺寸。
        renderer.setSize(
            width,
            height,
        )

        // PerspectiveCamera 的宽高比必须与 Canvas 一致。
        camera.aspect = width / height

        // 修改相机投影参数后，必须重新计算投影矩阵。
        // 只修改 camera.aspect 不调用此方法，不会真正生效。
        camera.updateProjectionMatrix()
    }

    // 监听浏览器窗口尺寸变化。
    window.addEventListener(
        'resize',
        handleResize,
    )

    // 页面首次加载时主动执行一次，
    // 不必等到用户第一次调整窗口。
    handleResize()
}