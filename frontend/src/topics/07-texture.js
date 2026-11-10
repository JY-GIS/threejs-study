import * as THREE from 'three'

// 加载用于材质颜色的纹理。
// url 是浏览器访问路径，例如 '/pig.png'。
export function loadColorTexture(url) {
    const loader = new THREE.TextureLoader()

    // load() 立即返回 Texture，图片在后台异步加载。
    const texture = loader.load(
        url,

        // 图片加载成功后执行。
        () => {
            console.log('纹理加载完成：', url)
        },

        // 本例暂不处理加载进度。
        undefined,

        // 图片加载失败后执行。
        (error) => {
            console.error('纹理加载失败：', url, error)
        },
    )

    // 普通颜色图片使用 sRGB 色彩空间。
    texture.colorSpace = THREE.SRGBColorSpace

    return texture
}