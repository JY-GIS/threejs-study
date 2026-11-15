import * as THREE from 'three'

export function createEntrance() {
    const entrance = new THREE.Group()
    entrance.name = '主入口'

    const frameHeight = 2.9
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#d2d7d6' })
    const doorMaterial = new THREE.MeshStandardMaterial({ color: '#19394c' })
    const postGeometry = new THREE.BoxGeometry(0.26, frameHeight, 0.2)
    const doorGeometry = new THREE.BoxGeometry(1.7, frameHeight, 0.08)

    for (const side of [-1, 1]) {
        const post = new THREE.Mesh(postGeometry, frameMaterial)
        post.position.set(side * 1.9, frameHeight / 2, 0.1)

        const door = new THREE.Mesh(doorGeometry, doorMaterial)
        // 两扇门在中央留出一条窄缝。
        door.position.set(side * 0.87, frameHeight / 2, 0.06)
        door.receiveShadow = true

        entrance.add(post, door)
    }

    const canopyHeight = 0.22
    const canopyDepth = 1.25
    const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, canopyHeight, canopyDepth),
        frameMaterial,
    )
    // 雨棚底面贴住门柱顶面，从墙面沿 +Z 向外伸出。
    canopy.position.set(0, frameHeight + canopyHeight / 2, canopyDepth / 2)
    entrance.add(canopy)

    return entrance
}