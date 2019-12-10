export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    tableHeight: 0
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateTableHeight (state, height) {
      state.tableHeight = height
    }
  },
  actions: {
    updateHeight (context, height) {
      context.commit('updateDocumentClientHeight', height)
      context.commit('updateTableHeight', (height - 160))
    }
  }
}
