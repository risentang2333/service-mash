import {Line} from './Line'
import {Position} from './Position'

export class Node{
    id:number
    ip:string
    name:string
    describe:string
    position:Position
    height: number
    width: number
    image: string
    kind: string = ''

    constructor(id = Date.now(), position: {x: number, y: number}={x: 0, y: 0}){
        this.id = id
        this.position = new Position(position.x, position.y)
        this.height = 60
        this.width = 60
        this.image = '';
        this.describe = '描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述'
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
