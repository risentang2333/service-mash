import {Node} from './Node'
import {Line} from './Line'
import {Position} from './Position'
import nodeList from './nodeList/'

var fnMap:{[name:string]: {new(id, position: {x: number, y: number}): Node}} = nodeList.reduce((map, {name,Fn})=>{
    map[name] = Fn
    return map
}, {})

export class File{
    width: number = 1200
    height: number = 1000
    nodeList: Node[] = []
    lineList: Line[] = []

    constructor(){

    }

    //通过当前数据作为原型，克隆出新数据
    clone(): File{
        const file = new File
        file.width = this.width
        file.height = this.height
        file.nodeList = this.nodeList.map(item=>item.clone())
        var nodeMap = file.nodeList.reduce((json,node)=>{
            json[node.id] = node
            return json
        },{})
        file.lineList = this.lineList.map(item=>item.clone(nodeMap))

        return file
    }

    //将数据保存成json文件
    saveJSON(){
        var {width, height} = this
        
        var nodeList = this.nodeList.map(element => {
            return {
                id: element.id,
                ip: element.ip,
                kind: element.kind,
                name: element.name,
                position: element.position,
            }
        });
        
        var lineList = this.lineList.map(element => {
            return {
                id: element.id,
                startNodeId: element.startNode.id,
                endNodeId: element.endNode.id,
                centerPoints: element.centerPoints
            }
        });
        
        return JSON.stringify({
            width, height,
            nodeList, lineList
        })
    }
    //从json文件中获取数据
    getDataFromJSON(json: any){
        if(typeof json == 'string'){
            json = JSON.parse(json)
        }

        var {width, height, nodeList, lineList} = json

        var idNodeMap :{[id: number]:Node} = {}

        this.width = width
        this.height = height
        this.nodeList = nodeList.map(node=>{
            var Fn = fnMap[node.kind] || fnMap['AC']
            var _node = idNodeMap[node.id] = new Fn(node.id, node.position)
            _node.ip = node.ip
            _node.name = node.name
            return _node
        })
        this.lineList = lineList.map(line=>{
            var _line = new Line(line.id, 
                idNodeMap[line.startNodeId], 
                idNodeMap[line.endNodeId],
                line.centerPoints.map(point=>new Position(point.x, point.y))
            )
            return _line
        })
        
    }
}