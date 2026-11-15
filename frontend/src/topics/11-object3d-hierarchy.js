// 递归输出 Object3D 的父子层级。
//
// root：从哪个对象开始输出。
// depth：当前层级深度，用来生成缩进。
export function printObjectTree(
    root,
    depth = 0,
) {
    // 每深入一层，增加两个空格。
    const indent = '  '.repeat(depth)

    // name 是对象名称，type 是 Group、Mesh、Scene 等类型。
    console.log(
        `${indent}${root.name || '未命名节点'} [${root.type}]`,
    )

    // children 只包含当前对象的直接子节点。
    root.children.forEach((child) => {
        // 对每个子节点继续执行相同操作。
        printObjectTree(
            child,
            depth + 1,
        )
    })
}