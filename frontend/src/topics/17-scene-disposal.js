// 递归收集并释放 Object3D 树中的渲染资源。
// roots 可以同时传入立方体、地面、辅助器和 GLB 模型等多个根对象。
export function disposeObjectTrees(roots) {
  // Set 会自动去重：多个 Mesh 共享同一资源时，只 dispose 一次。
  const geometries = new Set()
  const materials = new Set()
  const textures = new Set()
  const skeletons = new Set()

  for (const root of roots) {
    // 异步模型还没有加载完成时，truckModel 可能是 null。
    if (!root) continue

    // traverse() 会访问 root 以及它的全部子孙节点。
    root.traverse((object) => {
      if (object.geometry) {
        geometries.add(object.geometry)
      }

      // 一个 Mesh 可能使用单个材质，也可能使用材质数组。
      const objectMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      for (const material of objectMaterials) {
        if (material) materials.add(material)
      }

      // 骨骼模型还会拥有 Skeleton 资源。
      if (object.skeleton) {
        skeletons.add(object.skeleton)
      }
    })
  }

  // Material.dispose() 不会自动释放它引用的 Texture，必须单独查找。
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value?.isTexture) {
        textures.add(value)
      }
    }
  }

  for (const texture of textures) texture.dispose()
  for (const material of materials) material.dispose()
  for (const geometry of geometries) geometry.dispose()
  for (const skeleton of skeletons) skeleton.dispose()

  // dispose() 释放 GPU 资源；removeFromParent() 负责断开场景树关系。
  for (const root of roots) {
    root?.removeFromParent()
  }

  // 把统计结果交给主程序，便于在控制台检查。
  return {
    geometries: geometries.size,
    materials: materials.size,
    textures: textures.size,
    skeletons: skeletons.size,
  }
}
