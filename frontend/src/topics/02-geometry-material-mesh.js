import * as THREE from 'three'

// 创建一个带颜色纹理的立方体。
// colorTexture 由外部加载后传入，当前模块只负责 Geometry、Material 和 Mesh。
export function createCube(colorTexture) {
    // BoxGeometry(width, height, depth)
    // 三个参数分别表示沿 X、Y、Z 轴方向的尺寸。
    const geometry = new THREE.BoxGeometry(
        1,  // width
        1,  // height
        1,  // depth
    )

    // MeshStandardMaterial 是响应场景光照的 PBR 材质。
    const material = new THREE.MeshStandardMaterial({
        // map 接收颜色纹理。
        // BoxGeometry 已经包含 UV 坐标，可以直接使用纹理。
        map: colorTexture,

        // color 会与纹理颜色相乘。
        // 白色不会明显改变纹理原有颜色。
        color: 'white',

        // 粗糙度：0 接近光滑镜面，1 表示非常粗糙。
        roughness: 0.4,

        // 金属度：0 表示非金属，1 表示金属。
        metalness: 0.8,
    })

    // Mesh 将几何数据和材质组合为可渲染物体。
    const cube = new THREE.Mesh(
        geometry,
        material,
    )

    return cube
}