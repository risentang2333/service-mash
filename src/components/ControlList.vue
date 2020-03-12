<template>
    <div class="editbox-control" :style="{width: width + 'px'}">
        <!-- 侧边的描述框 -->
        <div class="editbox-control-item-side">
            <div class="editbox-control-item-describe" v-show="showHoverNode" :style="{top: hoverNodeTop + 'px'}">
                {{hoverNode.name}}
                <div class="editbox-control-item-describe-text">{{hoverNode.describe}}</div>
                <div draggable="false" class="editbox-control-item-biximage" :style="{backgroundImage:`url(${hoverNode.image})`}"></div>
            </div>
        </div>
        <!-- 控件列表 -->
        <div class="editbox-control-list">
            <div class="editbox-control-item" v-for="node in nodeList" :key="node.name" @mouseover="openControlInfo($event, node)" @mouseout="closeControlInfo">
                <div :style="{'background-image': `url(${node.image})`}" class="editbox-control-item-img"  @mousedown="controlDragStart($event, node)">
                </div>
                {{node.name}}
            </div>
        </div>
        <!-- 用于显示拖动控件的图片 -->
        <div class="editbox-drag-control" v-if="showDragNode && dragNode" :style="{'left': dragNodeLeft + 'px', 'top': dragNodeTop + 'px'}"
            @mousemove="controlDragMove" @mouseup="controlDragEnd">
            <Control :scale="scale" :node="dragNode"></Control>
        </div>
    </div>

</template>

<script>
import node from '../class/nodeList/'
import Control from './ControlList/Control.vue'
import topologyService from '../service/topologyService'
export default {
    data () {
        return {
            //可选控件列表
            nodeList: node.map(fn=>(new fn.Fn(0, {x: 0, y: 0}))),
            //显示控件说明
            hoverNode: {},
            hoverNodeTop: 0,
            showHoverNode: false,
            //拖拽控件
            dragNode: {},
            dragNodeTop: 0,
            dragNodeLeft: 0,
            showDragNode: false,
        }
    },
    components:{
        Control
    },
    computed: {
        scale: {
            get: function(){
                return this.$store.state.topologyEdit.state.scale
            },
        }
    },
    methods:{
        //显示控件说明的方法
        openControlInfo(e, node){
            this.hoverNode = node
            this.hoverNodeTop = e.currentTarget.offsetTop - e.currentTarget.parentElement.scrollTop
            this.showHoverNode = true

        },
        closeControlInfo(e){
            this.showHoverNode = false
        },
        //向编辑面板拖动控件
        controlDragStart(e, node){
            this.dragNode = node
            this.controlDragStartX = e.clientX
            this.controlDragStartY = e.clientY
            this.dragNodeTop = this.controlDragStartTop = e.currentTarget.offsetTop - e.currentTarget.parentElement.parentElement.scrollTop
            this.dragNodeLeft = this.controlDragStartLeft = e.currentTarget.offsetLeft
            this.showDragNode = true
        },
        controlDragMove(e){
            if(this.showDragNode){

                //如果鼠标已经抬起，则直接取消触摸
                if(e.buttons == 0){
                     //获取松手时候控件在屏幕的位置
                    this.controlDragCancel()
                    return
                }

                this.dragNodeTop = this.controlDragStartTop + e.clientY - this.controlDragStartY
                this.dragNodeLeft = this.controlDragStartLeft + e.clientX - this.controlDragStartX


                //获取松手时候控件在屏幕的位置
                var clientRect = e.currentTarget.getBoundingClientRect()

                //对外暴露的事件
                topologyService.setCheckAddControl(this.dragNode, {x: clientRect.left + clientRect.width / 2, y: clientRect.top + clientRect.height / 2})

            }
        },
        controlDragEnd(e){
            if(this.showDragNode){

                //获取松手时候控件在屏幕的位置
                var clientRect = e.currentTarget.getBoundingClientRect()

                //如果移除了屏幕，取消拖拽
                if(clientRect.left + clientRect.width > document.body.clientWidth){
                    this.controlDragCancel()
                    return
                }

                //对外暴露的事件
                topologyService.addControl(this.dragNode, {x: clientRect.left + clientRect.width / 2, y: clientRect.top + clientRect.height / 2})
            }
            this.showDragNode = false
        },
        controlDragCancel(){
            this.showDragNode = false
            //对外暴露的事件
            topologyService.cancelAddControl()
        }
    }
}
</script>

<style scoped>
    /* 控件列表 */
    .editbox-control{
        width: 200px;
        user-select: none;
        z-index: 1;
        height: 100%;
        position: relative;
        border-right: 2px solid transparent;
        box-sizing: border-box;
    }
    .editbox-control-list{
        overflow-y: auto;
        height: 100%;
    }
    .editbox-control-item{
        display: block;
        width: 120px;
        margin: 10px auto;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        overflow-x: visible;
    }
    .editbox-control-item-img{
        width: 60px;
        height: 60px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        box-sizing: border-box;
        border: 1px solid #fff;
        border-radius: 3px;
    }
    .editbox-control-item-img:hover{
        border: 1px solid rgba(64, 64, 64, .5);
        box-shadow: 0 0 4px #aaaaaa;
    }
    .editbox-control-item-side{
        position: relative;
        pointer-events: none;
    }
    .editbox-control-item-describe{
        position: absolute;
        right: -160px;
        width: 150px;
        top: 0;
        background: #fff;
        text-align: center;
        padding-top: 10px;
        border: 1px solid rgba(64, 64, 64, .5);
        border-radius: 3px;
        box-shadow: 6px 6px 9px rgba(128, 128, 128, .5);
    }
    .editbox-control-item-describe-text{
        padding: 10px;
        font-size: 13px;
        color: #333;
        text-align: left;
    }
    .editbox-control-item-biximage{
        width: 150px;
        height: 150px;
        box-sizing: border-box;
        padding: 0 10px;
        background-size: contain;
        background-origin: content-box;
        background-position: center;
        background-repeat: no-repeat;
        background-repeat: no-repeat;
    }
    .editbox-control-drag{
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        height: auto;
        width: 2px;
        cursor: e-resize;
        border: solid rgba(96, 96, 96, .5);
        background-color: #cbcccc;
        border-width: 0 1px;
        content: '';
    }
    /* 拖动控件 */
    .editbox-drag-control{
        position: absolute;
        width: 60px;
        height: 60px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        cursor: move;
        z-index: 100;
    }
    /* 增大触摸体积 */
    .editbox-drag-control::before{
        position: absolute;
        width: 660px;
        height: 660px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        content: ' ';
    }
</style>
