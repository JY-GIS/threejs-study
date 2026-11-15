import * as THREE from 'three'

// 输出一个 Object3D 的局部位置和世界位置。
export function logObjectCoordinates(
    object,
    label = object.name,
) {
    // position 是一个实时 Vector3 对象。
    // clone() 创建快照，防止后续修改影响日志中的引用。
    const localPosition = object.position.clone()

    // getWorldPosition() 要求传入一个 Vector3，
    // Three.js 会把计算结果写入这个对象。
    const worldPosition = new THREE.Vector3()

    object.getWorldPosition(worldPosition)

    console.log(`${label}的局部位置：`, localPosition)
    console.log(`${label}的世界位置：`, worldPosition)

    return {
        localPosition,
        worldPosition,
    }
}

// 演示一个点在局部坐标和世界坐标之间的转换。
export function logPointConversion(
    object,
    localPoint,
    label = object.name,
) {
    // localToWorld() 会直接修改传入的 Vector3。
    // 因此先 clone()，保留原始局部坐标。
    const worldPoint = object.localToWorld(
        localPoint.clone(),
    )

    // worldToLocal() 同样会修改传入对象，
    // 所以再次 clone()，保留 worldPoint。
    const convertedBack = object.worldToLocal(
        worldPoint.clone(),
    )

    console.log(`${label}原始局部点：`, localPoint)
    console.log(`${label}转换后的世界点：`, worldPoint)
    console.log(`${label}转换回的局部点：`, convertedBack)

    return {
        localPoint,
        worldPoint,
        convertedBack,
    }
}