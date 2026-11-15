import * as THREE from 'three'

export function createRoof(width, depth) {
    const roof = new THREE.Group()
    roof.name = '屋顶'

    const deckHeight = 0.28
    const deck = new THREE.Mesh(
        new THREE.BoxGeometry(width, deckHeight, depth),
        new THREE.MeshStandardMaterial({ color: '#a1aeb4' }),
    )
    deck.position.y = deckHeight / 2
    deck.receiveShadow = true
    roof.add(deck)

    const parapetHeight = 0.65
    const thickness = 0.22
    const material = new THREE.MeshStandardMaterial({ color: '#d2d7d6' })
    const longGeometry = new THREE.BoxGeometry(width, parapetHeight, thickness)
    // 短墙接在两段长墙之间，两端各留出一段墙厚。
    const shortGeometry = new THREE.BoxGeometry(thickness, parapetHeight, depth - 2 * thickness)
    const parapetY = deckHeight + parapetHeight / 2

    for (const side of [-1, 1]) {
        const longWall = new THREE.Mesh(longGeometry, material)
        longWall.position.set(0, parapetY, side * (depth - thickness) / 2)

        const shortWall = new THREE.Mesh(shortGeometry, material)
        shortWall.position.set(side * (width - thickness) / 2, parapetY, 0)

        roof.add(longWall, shortWall)
    }

    return roof
}