import * as THREE from 'three'

// 从命中的对象开始，沿 parent 向上查找可拾取根对象。
function findPickableRoot(hitObject, pickableObjects) {
    let current = hitObject

    // 当 current 为 null 时，说明已到达场景树顶部。
    while (current) {
        // includes() 判断数组中是否包含这个对象。
        if (pickableObjects.includes(current)) {
            return current
        }

        // 没找到就继续检查父对象。
        current = current.parent
    }

    // 沿父链向上查找后，仍未找到登记的根对象。
    return null
}


// 为一个物体添加鼠标点击拾取。
//
// camera：当前相机
// canvas：渲染画布，负责接收鼠标事件
// object：需要检查的三维物体
export function setupPicking(camera, canvas, cube, floor, pickableObjects) {
    // Raycaster 负责生成射线并计算相交结果。
    const raycaster = new THREE.Raycaster()

    // Vector2 保存二维坐标，这里用于保存鼠标标准化坐标。
    const pointer = new THREE.Vector2()

    // 获取页面中的信息面板。
    const infoPanel = document.querySelector('#info-panel')

    let isHighlighted = false

    // 在 Canvas 上发生点击时执行。
    // 点击处理函数；保存函数引用，后面才能移除监听。
    function handleClick(event) {
        // 获取 Canvas 在浏览器视口中的位置和尺寸。
        const rect = canvas.getBoundingClientRect()

        // clientX/clientY 是鼠标相对于浏览器视口的坐标。
        // 先减去 Canvas 左上角的位置，再除以 Canvas 宽高，
        // 将鼠标位置转换为 Canvas 内 0～1 的比例。
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height

        // setFromCamera 需要标准化设备坐标（NDC）：
        // X：左边 -1，右边 1
        // Y：上边 1，下边 -1
        pointer.x = x * 2 - 1
        pointer.y = -(y * 2 - 1)

        // 根据鼠标坐标和相机，更新射线的起点与方向。
        raycaster.setFromCamera(pointer, camera)

        // 第二个参数 true 表示递归检测每个对象的子孙节点。
        // GLB 的 Mesh 往往嵌套在模型根对象内部。
        const intersections = raycaster.intersectObjects(pickableObjects, true)

        if (intersections.length > 0) {
            const hit = intersections[0]

            // hit.object 是实际命中的子对象。
            // pickedRoot 是 pickableObjects 中登记的所属根对象。
            const pickedRoot = findPickableRoot(hit.object, pickableObjects)

            // 读取根对象上的自定义信息。
            // ?. 表示 pickedRoot 为 null 时，不继续读取属性。
            const info = pickedRoot?.userData.info
            if (info) {
                // textContent 设置纯文本；\n 表示换行。
                // 模板字符串可以通过 ${...} 插入变量。
                infoPanel.textContent =
                    `名称：${info.name}\n` +
                    `编号：${info.id}\n` +
                    `分类：${info.category}`
            } else {
                infoPanel.textContent = '该物体暂无业务信息'
            }

            console.log('实际命中的对象：', hit.object)
            console.log('所属的可拾取根对象：', pickedRoot)

            // hit.object 是射线实际命中的对象。
            if (pickedRoot === cube) {
                isHighlighted = !isHighlighted

                if (isHighlighted) {
                    cube.material.emissive.set('gold')
                } else {
                    cube.material.emissive.set('black')
                }
                console.log('点击了立方体')
            } else if (pickedRoot === floor) {
                isHighlighted = false
                cube.material.emissive.set('black')
                console.log('点击了地面')
            } else {
                // 当前拾取列表中，除立方体和地面外，剩余的是 GLB 模型。
                // 注意：hit.object 通常是模型内部的 Mesh，不一定是模型根对象。
                isHighlighted = false
                cube.material.emissive.set('black')
                console.log('点击了模型根对象：', pickedRoot)
            }

            console.log('交点的世界坐标：', hit.point)
            console.log('交点距离：', hit.distance)
        } else {
            isHighlighted = false
            cube.material.emissive.set('black')
            console.log('没有点中可拾取物体')
            infoPanel.textContent = '请点击场景中的物体'
        }
    }

    // 注册点击监听。
    canvas.addEventListener('click', handleClick)

    // 返回一个清理函数，交给外部在适当的时候调用。
    return function disposePicking() {
        canvas.removeEventListener('click', handleClick)
    }
}