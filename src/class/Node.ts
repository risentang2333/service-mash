import {Position} from './Position'
/**
 * 节点类
 * @class Node
 */
export class Node {
    // 节点id
    id: number
    // 节点ip
    ip: string
    // 节点名
    name: string
    // 节点描述
    describe: string
    // 节点类型
    position: Position
    // 节点高度
    height: number
    // 节点宽度
    width: number
    // 背景图片
    image: string
    // 节点类型
    kind: string = ''
    // 构造
    constructor(id = Date.now(), position: {x: number, y: number}={x: 0, y: 0}){
        this.id = id
        this.position = new Position(position.x, position.y)
        this.height = 60
        this.width = 60
        this.image = '';
        this.describe = '节点描述'
    }
    //通过当前原型克隆数据
    clone(): Node{
        const node = new Node(this.id, this.position)
        node.ip = this.ip
        node.name = this.name
        node.kind = this.kind
        node.height = this.height
        node.width = this.width
        node.image = this.image
        node.describe = this.describe

        return node
    }
}
