import store, {topologyEditTypes} from '../store/'
import {File} from '../class/File'
import {Node} from '../class/Node'
import {Line} from '../class/Line'
import {Position} from '../class/Position'
import fileService from './fileService'

/**
 * 屏幕相关的坐标，如触摸事件的touch，鼠标事件的clientX、clineY等
 */
type DomPoint = {
    x: number,
    y: number,
}

//将dom坐标转为编辑器坐标的方法
var calcCoordinate: {(point: DomPoint): Position}

export default {
    //初始化文件
    initFile(): Promise<any>{
        return fileService.getFile().then(data=>{
            var file = new File()
            if(data){
                file.getDataFromJSON(data)
            }
            store.state.file = file.clone()
        })
    },
    //保存文件
    saveFile(): Promise<any>{
        var file = store.state.topologyEdit.file
        if(file.nodeList.reduce((bool, node)=>{
            return !!node.ip && bool
        }, true)){
            return fileService.saveFile(file.saveJSON())
            .then(()=>{
                store.state.edit = false
                store.state.file = file.clone()
            })
        } else {
            throw new Error("存在没有绑定IP的节点")
        }

    },
    //编辑节点
    initEdit(){
        var file: File = store.state.file
        store.commit(topologyEditTypes.INIT_PAGE, file.clone())
        store.state.edit = true
    },
    //检验设备
    async checkIps(ips: string[]){
        var ipsMap = await fileService.checkIps(ips)
        store.state.checkMap = ipsMap
    },
    //初始化坐标转换函数。将鼠标事件的client坐标转为file坐标
    initService(fn: {(point: DomPoint): Position}){
        calcCoordinate = fn;
    },

    //-------------------增加控件相关逻辑
    /**
     * 检验是否可以增加控件
     * @param {Node} control        增加的控件原型
     * @param {DomPoint} position   屏幕坐标上控件放置点
     * @returns
     */
    checkAddControl(control:Node, addPosition:DomPoint){
        let file = store.state.topologyEdit.file
        let position = calcCoordinate(addPosition)

        if(position.x >= control.width / 2 && position.y  >= control.height / 2
            && position.x <= file.width - control.width / 2 && position.y <= file.height - control.height / 2){
                return true
        } else {
            return false
        }
    },
    /**
     * 设置检查的结构
     * @param {Node} control        增加的控件原型
     * @param {DomPoint} position   屏幕坐标上控件放置点
     * @returns
     */
    setCheckAddControl(control:Node, addPosition:DomPoint){
        if(this.checkAddControl(control, addPosition)){
            store.state.topologyEdit.state.canAddNode = true;
        } else {
            store.state.topologyEdit.state.canAddNode = false;
        }
    },
    //增加控件
    addControl(control:Node, addPosition:DomPoint){
        if(this.checkAddControl(control, addPosition)){

            store.state.topologyEdit.state.canAddNode = false;

            var control = control.clone()
            control.id = Date.now()
            var position = calcCoordinate(addPosition)
            control.position = new Position(position.x - control.width / 2, position.y - control.height / 2);

            store.commit(topologyEditTypes.ADD_NODE, control)
        }
    },
    //取消增加控件
    cancelAddControl(){
        store.state.topologyEdit.state.canAddNode = false;
    },

    //------------------编辑控件
    startEidtControl(nodeId){
        store.state.topologyEdit.state.edittingLineId = 0
        store.state.topologyEdit.state.edittingNodeIds = [nodeId]
    },
    addStartEidtControl(nodeId){
        store.state.topologyEdit.state.edittingLineId = 0
        store.state.topologyEdit.state.edittingNodeIds.push(nodeId)
    },
    startMoveControl(id: number){
        store.commit(topologyEditTypes.START_MOVE_NODE, id)
    },
    moveControl(id:number, ids: number[], x, y){
        var {nodeList, width, height} = store.state.topologyEdit.file
        var map:{[id: number]: Node} = store.state.topologyEdit.file.nodeList.reduce((map, node)=>{
            map[node.id] = node
            return map
        }, {})

        var editingNodes = ids.map(id=>map[id])

        //分别取出各个方向的最值
        if(x > 0){
            var rightX = Math.min(...editingNodes.map(node=>width - node.position.x - node.width))
            x = Math.min(rightX, x)
        } else {
            var leftX = Math.min(...editingNodes.map(node=>node.position.x))
            x = Math.max(x, -leftX)
        }
        if(y > 0){
            var rightY = Math.min(...editingNodes.map(node=>height - node.position.y - node.height))
            y = Math.min(rightY, y)
        } else {
            var leftY = Math.min(...editingNodes.map(node=>node.position.y))
            y = Math.max(y, -leftY)
        }
        store.state.topologyEdit.state.movingNodeId = id
        editingNodes.forEach(node=>{
            node.position.x += x
            node.position.y += y
        })
    },
    endControl(){
        store.commit(topologyEditTypes.END_MOVE_NODE)
    },

    //------------------删除控件
    deleteNode(nodeId){
        store.commit(topologyEditTypes.DELETE_NODE, nodeId)
        store.state.topologyEdit.state.edittingNodeIds
            = store.state.topologyEdit.state.edittingNodeIds.filter(id=>id!=nodeId)
    },
    deleteNodes(nodeIds: number[]){
        store.commit(topologyEditTypes.DELETE_NODES, nodeIds)
        store.state.topologyEdit.state.edittingNodeIds
            = store.state.topologyEdit.state.edittingNodeIds.filter(id=>nodeIds.indexOf(id) != -1)
    },

    //------------------编辑控件
    editNode(node){
        store.commit(topologyEditTypes.EDIT_NODE, node)
    },

    //-----------------增加线
    startAddLine(startNode: Node){
        store.state.topologyEdit.state.addingLine = true
        store.state.topologyEdit.state.addingLineStart = startNode
    },
    addLine(endNode: Node, centerPoints: Position[]){
        var startNode = store.state.topologyEdit.state.addingLineStart
        store.commit(topologyEditTypes.ADD_LINE, new Line(Date.now(), startNode, endNode, centerPoints))
    },
    cancelAddLine(){
        store.state.topologyEdit.state.addingLine = false
        store.state.topologyEdit.state.addingLineStart = new Node(0)
    },

    //-----------------编辑线
    editLine(line: Line){
        store.state.topologyEdit.state.edittingNodeIds = []
        store.state.topologyEdit.state.edittingLineId = line.id
    },
    endEditLine(){
        store.state.topologyEdit.state.edittingLineId = 0
    },
    addEditLinePoint(point:DomPoint, index: number){
        store.commit(topologyEditTypes.ADD_LINE_Point, {
            lineId: store.state.topologyEdit.state.edittingLineId,
            pointIndex: index,
            position: calcCoordinate(point)
        })
    },
    startMoveEditLinePoint(point:DomPoint, index: number){
        store.commit(topologyEditTypes.START_MOVE_LINE_POINT)
    },
    moveEditLinePoint(point:DomPoint, index: number){
        var {edittingLineId} = store.state.topologyEdit.state
        var {lineList} = store.state.topologyEdit.file
        let position = calcCoordinate(point)
        lineList.forEach(line=>{
            if(line.id == edittingLineId){
                line.centerPoints[index].x = position.x
                line.centerPoints[index].y = position.y
            }
        })
    },
    endMoveLinePoint(){
    },
    //删除编辑线中的点
    deleteEdittingLinePoint(index){
        var {edittingLineId} = store.state.topologyEdit.state
        store.commit(topologyEditTypes.DELETE_LINE_Point, {
            lineId: edittingLineId,
            pointIndex: index
        })
    },
    //删除线点
    deleteLine(lineId){
        store.commit(topologyEditTypes.DELETE_LINE, lineId)

        if(lineId == store.state.topologyEdit.state.edittingLineId){
            store.state.topologyEdit.state.edittingLineId = 0
        }
    },
    //-----------------撤销和重做
    redo(){
        store.commit(topologyEditTypes.REDO)
    },
    undo(){
        store.commit(topologyEditTypes.UNDO)
    },

    //取消选择
    clearSelect(){
        store.state.topologyEdit.state.edittingLineId = 0
        store.state.topologyEdit.state.edittingNodeIds = []
    },

    // 编译页面大小
    editFileSize(width: number, height: number){
        var file = store.state.topologyEdit.file

        var check = true

        check = file.lineList.reduce((check, line: Line)=>{
            return check && line.centerPoints.reduce((check, point)=>{
                return check && point.x <= width && point.y <= height
            }, true)
        }, check)

        check = file.nodeList.reduce((check, node: Node)=>{
            return check && node.position.x + node.width <= width
                && node.position.y + node.height <= height
        }, check)

        if(check){
            store.commit(topologyEditTypes.EDIT_FILE_SIZE, {
                width,
                height
            })
        } else {
            throw new Error("当前尺寸存在错误，这个尺寸有控件将无法显示到页面中")
        }
    },

    //开始进行多选选择
    startSelect(point: DomPoint){
        var position = calcCoordinate(point)
        store.state.topologyEdit.state.selectBoxStart = position;
        store.state.topologyEdit.state.selectBoxEnd = position;
        store.state.topologyEdit.state.edittingLineId = 0
        store.state.topologyEdit.state.edittingNodeIds = []
    },
    moveSelectBox(point: DomPoint){
        var position = calcCoordinate(point)
        store.state.topologyEdit.state.selectBoxEnd = position;
    },
    endSelectBox(point: DomPoint){
        var {selectBoxStart, selectBoxEnd} = store.state.topologyEdit.state
        store.state.topologyEdit.state.selectBoxEnd = null;
        store.state.topologyEdit.state.selectBoxStart = null;
        if(!selectBoxStart){
            return
        }
        store.state.topologyEdit.state.edittingNodeIds = []
        var maxX = Math.max(selectBoxStart.x, selectBoxEnd.x)
        var minX = Math.min(selectBoxStart.x, selectBoxEnd.x)
        var maxY = Math.max(selectBoxStart.y, selectBoxEnd.y)
        var minY = Math.min(selectBoxStart.y, selectBoxEnd.y)

        store.state.topologyEdit.file.nodeList.forEach(node=>{
            if(node.position.x > minX && node.position.x + node.width < maxX
                && node.position.y > minY && node.position.y + node.height < maxY){
                store.state.topologyEdit.state.edittingNodeIds.push(node.id)
            }
        })
    },
}
