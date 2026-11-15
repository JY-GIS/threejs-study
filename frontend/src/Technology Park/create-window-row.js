import * as THREE from 'three'

export function createWindowRow({
    count,
    spacing,
    geometry,
    material,
    skipCenter = false
}) {
    const row = new THREE.Group()

    for (let index = 0; index < count; index++) {
        const centeredIndex = index - (count - 1) / 2
        // 跳过离中心最近的窗位，其余窗仍按原来的间距排列。
        if (skipCenter && Math.abs(centeredIndex) <= 0.5) continue

        const glass = new THREE.Mesh(geometry, material)
        glass.position.x = centeredIndex * spacing
        glass.userData.skipShadow = true
        row.add(glass)
    }

    return row
}