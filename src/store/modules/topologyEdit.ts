import { File } from '../../class/File'
import { Node } from '../../class/Node'
import { Line } from '../../class/Line';
import { TopologyEditState } from '../../class/TopologyEditState'

export const topologyEditTypes = {
    //初始化页面
    INIT_PAGE: 'topologyEdit/INIT_PAGE',
    //新建节点
    ADD_NODE: 'topologyEdit/ADD_NODE',
    //编辑节点
    EDIT_NODE: 'topologyEdit/EDIT_NODE',
    //开始移动节点
    START_MOVE_NODE: 'topologyEdit/START_MOVE_NODE',
    //移动节点
    MOVE_NODE: 'topologyEdit/MOVE_NODE',
    //删除节点
    DELETE_NODE: 'topologyEdit/DELETE_NODE',
    //删除节点
    DELETE_NODES: 'topologyEdit/DELETE_NODES',
    //移动节点结束
    END_MOVE_NODE: 'topologyEdit/END_MOVE_NODE',
    //新建线
    ADD_LINE: 'topologyEdit/ADD_LINE',
    //删除线
    DELETE_LINE: 'topologyEdit/DELETE_LINE',
    //增加线的点
    ADD_LINE_Point: 'topologyEdit/ADD_LINE_Point',
    //删除线的点
    DELETE_LINE_Point: 'topologyEdit/DELETE_LINE_Point',
    //开始移动线
    START_MOVE_LINE_POINT: 'topologyEdit/START_MOVE_LINE_POINT',

    //撤销
    UNDO: 'topologyEdit/UNDO',
    //重做
    REDO: 'topologyEdit/REDO',

    //编辑页面大小
    EDIT_FILE_SIZE: 'topologyEdit/EDIT_FILE_SIZE',
}

export default {
    state: {
        //状态
        state: {
            scale: 1,

            canAddNode: false,

            edittingNodeIds: [],
            movingNodeId: 0,

            addingLine: false,
            addingLineStart: new Node(0),

            edittingLineId: 0,

            selectBoxStart: null,
            selectBoxEnd: null,
        },
        //当前编辑的状态
        file: new File,
        //备忘录，保存20条编辑历史。当从备忘录中取回历史状态时候，当前数据会被放进回收站里面，并将最后一条备忘录数据替换当前数据
        memento: [],
        //回收站。当从回收站找回丢弃的状态时候，当前状态会被放进备忘录，并用最后一条回收站记录替换当前记录
        recycle: [],
    },
    mutations:{
        [topologyEditTypes.INIT_PAGE]: function(state, file){
            state.file = file
            state.recycle = []
            state.memento = []
        },
        [topologyEditTypes.ADD_NODE]: function(state, node){
            state.memento.push(state.file.clone())
            state.file.nodeList.push(node)
            state.state.edittingNodeIds = [node.id]
            state.recycle = []
        },

        //撤销重做
        [topologyEditTypes.UNDO]: function(state, node){
            state.recycle.push(state.file)
            state.file = state.memento.pop()
        },
        [topologyEditTypes.REDO]: function(state, node){
            state.memento.push(state.file)
            state.file = state.recycle.pop()
        },

        //移动节点
        [topologyEditTypes.START_MOVE_NODE]: function(state, id){
            state.memento.push(state.file.clone())
            state.recycle = []
            state.state.movingNodeId = id
        },
        [topologyEditTypes.MOVE_NODE]: function(state, {id, position}){
            var node = state.file.nodeList.find(node=>node.id == id)
            if(node){
                node.position.x = position.x
                node.position.y = position.y
            }
        },
        [topologyEditTypes.END_MOVE_NODE]: function(state){
            state.state.movingNodeId = 0
        },

        //增加线
        [topologyEditTypes.ADD_LINE]: function(state:TopologyEditState, line: Line){
            state.memento.push(state.file.clone())
            state.recycle = []
            state.file.lineList.push(line)

            state.state.addingLine = false
            state.state.movingNodeId = 0
        },
        [topologyEditTypes.DELETE_LINE]: function(state:TopologyEditState, lineId: number){
            state.memento.push(state.file.clone())
            state.recycle = []

            state.file.lineList = state.file.lineList.filter(line=>{
                return line.id != lineId
            })

        },
        //增加线的点
        [topologyEditTypes.ADD_LINE_Point]: function(state:TopologyEditState, {lineId, pointIndex, position}){
            state.memento.push(state.file.clone())
            state.recycle = []
            state.file.lineList.forEach(item=>{
                if(item.id == lineId){
                    item.centerPoints.splice(pointIndex, 0, position)
                }
            })
        },
        //删除线的点
        [topologyEditTypes.DELETE_LINE_Point]: function(state:TopologyEditState, {lineId, pointIndex}){
            state.memento.push(state.file.clone())
            state.recycle = []
            state.file.lineList.forEach(item=>{
                if(item.id == lineId){
                    item.centerPoints.splice(pointIndex, 1)
                }
            })
        },
        //开始移动线
        [topologyEditTypes.START_MOVE_LINE_POINT]: function(state:TopologyEditState){
            state.memento.push(state.file.clone())
            state.recycle = []
        },

        //删除节点
        [topologyEditTypes.DELETE_NODE]: function(state:TopologyEditState, nodeId: number){
            state.memento.push(state.file.clone())
            state.recycle = []
            state.file.lineList = state.file.lineList.filter(line=>{
                return line.endNode.id != nodeId && line.startNode.id != nodeId
            })
            state.file.nodeList = state.file.nodeList.filter(node=>{
                return node.id != nodeId
            })
        },
        //删除节点
        [topologyEditTypes.DELETE_NODES]: function(state:TopologyEditState, nodeIds: number[]){
            state.memento.push(state.file.clone())
            state.recycle = []
            state.file.lineList = state.file.lineList.filter(line=>{
                return nodeIds.indexOf(line.endNode.id) == -1 && nodeIds.indexOf(line.startNode.id)  == -1
            })
            state.file.nodeList = state.file.nodeList.filter(node=>{
                return nodeIds.indexOf(node.id) == -1
            })
            state.state.edittingNodeIds = state.state.edittingNodeIds.filter(id=>{
                return nodeIds.indexOf(id) == -1
            })
        },
        //编辑节点
        [topologyEditTypes.EDIT_NODE]: function(state:TopologyEditState, node: Node){
            state.memento.push(state.file.clone())
            state.recycle = []
            state.file.nodeList = state.file.nodeList.map(_node=>{
                if(node.id == _node.id ){
                    _node.ip = node.ip
                    _node.name = node.name
                    return _node
                } else {
                    return _node
                }
            })
        },
        //编辑页面大小
        [topologyEditTypes.EDIT_FILE_SIZE]: function(state:TopologyEditState, {width, height}:{width:number, height: number}){
            state.memento.push(state.file.clone())
            state.recycle = []

            state.file.width = width
            state.file.height = height
        },
    }
}

