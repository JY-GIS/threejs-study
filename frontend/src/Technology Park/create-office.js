import * as THREE from 'three'
import { createWindowRow } from './create-window-row.js'
import { createRoof } from './create-roof.js'
import { createEntrance } from './create-entrance.js'

export function createOffice() {
    const office = new THREE.Group()
    office.name = '办公楼主体'

    const floorCount = 5
    const floorHeight = 3.8
    const slabHeight = 0.2
    const wallHeight = floorHeight - slabHeight
    const wallWidth = 26
    const wallDepth = 16

    const slabGeometry = new THREE.BoxGeometry(26.4, slabHeight, 16.4)
    const wallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth)
    const slabMaterial = new THREE.MeshStandardMaterial({ color: '#d2d7d6' })
    const wallMaterial = new THREE.MeshStandardMaterial({ color: '#63829a' })

    const windowSpacing = 3
    const glassGeometry = new THREE.PlaneGeometry(2.4, 2.2)
    const glassMaterial = new THREE.MeshStandardMaterial({
        color: '#23485f',
        roughness: 0.25,
    })

    const frontOffset = wallDepth / 2 + 0.02
    const sideOffset = wallWidth / 2 + 0.02

    const facadeLayouts = [
        { count: 8, rotationY: 0, offset: frontOffset },             // +Z
        { count: 8, rotationY: Math.PI, offset: frontOffset },       // -Z
        { count: 5, rotationY: Math.PI / 2, offset: sideOffset },    // +X
        { count: 5, rotationY: -Math.PI / 2, offset: sideOffset },   // -X
    ]

    for (let index = 0; index < floorCount; index++) {
        const floor = new THREE.Group()
        floor.name = `第 ${index + 1} 层`
        // 每层原点在本层底面，相邻两层的原点相差一个层高。
        floor.position.y = index * floorHeight

        const slab = new THREE.Mesh(slabGeometry, slabMaterial)
        slab.position.y = slabHeight / 2

        const wall = new THREE.Mesh(wallGeometry, wallMaterial)
        // 墙体底面贴住楼板顶面。
        wall.position.y = slabHeight + wallHeight / 2

        floor.add(slab, wall)

        for (const { count, rotationY, offset } of facadeLayouts) {
            const row = createWindowRow({
                count,
                spacing: windowSpacing,
                geometry: glassGeometry,
                material: glassMaterial,
                skipCenter: index === 0 && rotationY === 0,
            })

            row.position.y = wall.position.y
            row.rotation.y = rotationY
            // 先转向，再沿窗排的局部 +Z 轴向外移。
            row.translateZ(offset)
            floor.add(row)
        }

        if (index === 0) {
            const entrance = createEntrance()
            entrance.position.set(0, slabHeight, wallDepth / 2)
            floor.add(entrance)
        }

        office.add(floor)
    }

    const roof = createRoof(wallWidth + 0.4, wallDepth + 0.4)
    // 五个楼层叠起来的高度，就是屋顶组的底面高度。
    roof.position.y = floorCount * floorHeight
    office.add(roof)

    return office
}