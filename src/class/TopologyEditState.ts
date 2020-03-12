import { File } from './File'
import { Position } from './Position'
import { Node } from './Node'

//state的类型
export type TopologyEditState = {
    //状态
    state: {
        //比例尺
        scale: number,

        //-----增加节点
        canAddNode: boolean,

        //-----编辑节点
        //当前正在编辑的节点
        edittingNodeIds: number[],
        //是否处于移动node
        movingNodeId: number,

        //-----增加线
        //是否处于增加线状态
        addingLine: boolean,
        //增加线的初始位置
        addingLineStart: Node,

        //-----增加线
        //编辑线
        edittingLineId: number,

        //选择多个
        selectBoxStart: Position,
        selectBoxEnd: Position,
    },
    //当前编辑的状态
    file: File,
    //备忘录，保存20条编辑历史。当从备忘录中取回历史状态时候，当前数据会被放进回收站里面，并将最后一条备忘录数据替换当前数据
    memento: File[],
    //回收站。当从回收站找回丢弃的状态时候，当前状态会被放进备忘录，并用最后一条回收站记录替换当前记录
    recycle: File[],
}
