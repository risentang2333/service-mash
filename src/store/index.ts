import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import topologyEdit, { topologyEditTypes } from './modules/topologyEdit'
import { File } from '../class/File'
import { TopologyEditState } from '../class/TopologyEditState'

Vue.use(Vuex)

export default new Vuex.Store<{
    edit: boolean,
    file: File,
    scale: Number,
    checkMap: {[ip: string]: boolean},
    topologyEdit: TopologyEditState
}>({
    state: {
        edit: false,
        file: null,
        scale: 1,
        checkMap: {},
        topologyEdit: null
    },
    modules: {
        common,
        topologyEdit
    }
})
// 输出vuex，编辑节点的方法名
export {
    topologyEditTypes
}
