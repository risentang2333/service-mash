import {Position} from './Position'
import {Node} from './Node'

export class Line{

    id:number
    centerPoints: Position[]
    startNode: Node
    endNode: Node

    constructor(id = Date.now(), startNode = new Node(0), endNode = new Node(0), centerPoints: Position[] = []){
        this.id = id
        this.startNode = startNode
        this.endNode = endNode
        this.centerPoints = centerPoints
    }

    clone(nodeMap:{[id:string]: Node}): Line{
        return new Line(this.id, nodeMap[this.startNode.id], nodeMap[this.endNode.id], this.centerPoints.map(p=> p.clone()))
    }
}