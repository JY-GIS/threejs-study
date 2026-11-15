import { configureShadows } from '../topics/05-light-and-shadow.js'

export function setupCampusShadows({ renderer, light, ground, plinth, office }) {
    // 平行光照向原点，从斜上方照亮楼体。
    light.position.set(32, 52, 38)

    configureShadows({ renderer, light, caster: plinth, receiver: ground })
    plinth.receiveShadow = true

    // 遍历楼体组，把投影开关设到每个楼板和墙体网格上。
    office.traverse((object) => {
        if (object.isMesh && !object.userData.skipShadow) object.castShadow = true
    })

    // 在光源视角下，框住楼体和落影区域。
    const shadow = light.shadow
    shadow.camera.left = -30
    shadow.camera.right = 30
    shadow.camera.top = 30
    shadow.camera.bottom = -30
    shadow.camera.far = 120
    shadow.camera.updateProjectionMatrix()

    shadow.mapSize.set(2048, 2048)
}