import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// 加载一个 GLB 模型并加入指定场景。
// url：浏览器可访问的模型路径。
// scene：模型加载完成后要加入的 Three.js 场景。
// onModelLoaded 是加载成功后的回调函数。默认给一个空函数，这样不传回调时也不会报错。
export function loadGLTFModel(
    url,
    scene,
    onModelLoaded = () => { },
    isSceneActive = () => true,
) {
    const loader = new GLTFLoader()

    loader.load(
        url,

        // 加载并解析完成后执行。
        (gltf) => {
            // 加载完成时再次检查场景状态。
            if (!isSceneActive()) {
                console.log('场景已停止，跳过模型加入')
                return
            }

            // gltf.scene 是模型的默认场景，内部可能包含多个 Mesh。
            const model = gltf.scene

            // 将模型放到原有立方体左侧。
            model.position.set(
                -1.5,
                0.25,
                0,
            )

            // 递归访问模型内部的所有对象。
            model.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true
                    object.receiveShadow = true
                }
            })

            scene.add(model)
            // 模型加载完成后，把模型根对象交给外部处理。
            onModelLoaded(model)

            console.log('模型加载完成：', gltf)
            console.log('模型根节点：', model)
            console.log('模型动画：', gltf.animations)
        },

        // 加载进度；部分服务器可能不提供 total。
        (event) => {
            if (event.total > 0) {
                const progress = event.loaded / event.total * 100
                console.log(`模型加载进度：${progress.toFixed(1)}%`)
            }
        },

        // 下载或解析失败后执行。
        (error) => {
            console.error('模型加载失败：', error)
        },
    )
}