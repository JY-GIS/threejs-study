import * as THREE from 'three'
import { createFloor } from '../topics/05-light-and-shadow.js'
import { createOffice } from './create-office.js'
import { createRoad } from './create-road.js'

export function createCampus() {
    const ground = createFloor()
    ground.position.y = 0
    ground.scale.set(16.4, 15.6, 1)
    ground.material.color.set('#aab6aa')

    const road = createRoad()
    road.position.set(0, ground.position.y, 16)

    const building = new THREE.Group()
    building.name = '办公楼'
    // 建筑组的原点放在地面高度。
    building.position.y = ground.position.y

    const plinthHeight = 0.6
    const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(30, plinthHeight, 19),
        new THREE.MeshStandardMaterial({ color: '#d2d7d6' }),
    )
    // 基座中心比地面高半个基座厚度。
    plinth.position.y = plinthHeight / 2

    const office = createOffice()
    // 楼体组的原点在首层底面，对齐基座顶面。
    office.position.y = plinth.position.y + plinthHeight / 2

    building.add(plinth, office)

    return { ground, road, building, plinth, office }
}