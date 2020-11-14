// initial state
const state = {
    isShowDrawer: false,
    isLoading: false,
    showDialog: false,
    title: '菜单列表'
}

// mutations
const mutations = {
    loadingStatus(state1, payload) {
        state.isLoading = payload.isLoading
    },
    loadingDrawer(state1, payload) {
        state.isShowDrawer = payload.isShowDrawer
    },
    setShowDialog(state1, payload) {
        state.showDialog = payload.showDialog
    },
    setTitle(state1, payload) {
        state.title = payload.title
    }
}

export default {
    state,
    mutations
}