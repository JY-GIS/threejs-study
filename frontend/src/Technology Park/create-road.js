import * as THREE from 'three'

export function createRoad() {
    const road = new THREE.Group()
    road.name = '园区主路'

    const length = 144
    const width = 8
    const asphalt = new THREE.Mesh(
        new THREE.PlaneGeometry(length, width),
        new THREE.MeshStandardMaterial({ color: '#454b51' }),
    )
    asphalt.rotation.x = -Math.PI / 2
    asphalt.position.y = 0.02
    asphalt.receiveShadow = true
    road.add(asphalt)

    const dashSpacing = 6
    const dashGeometry = new THREE.PlaneGeometry(3, 0.14)
    const dashMaterial = new THREE.MeshStandardMaterial({ color: '#e9c65c' })

    // 第一段从半个间距处起算，让道路两端的留白对称。
    for (let x = -length / 2 + dashSpacing / 2; x < length / 2; x += dashSpacing) {
        const dash = new THREE.Mesh(dashGeometry, dashMaterial)
        dash.rotation.x = -Math.PI / 2
        dash.position.set(x, 0.03, 0)
        dash.receiveShadow = true
        road.add(dash)
    }

    return road
}