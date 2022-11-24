
export const state = {
    // userPros:null,
    // baseData:[],
    funcAddress: [],
    tableHeight: parseInt(document.documentElement.clientHeight-230),// 右侧面板最小长度
    headerWidth: parseInt(document.documentElement.clientWidth-230),// 右侧面板最小宽度
    token: null,
    title: '',
    roles: null,
    userId: null,
    errorData: null,
    showErrorStatus:false,
    resultData: {'details':[{'records':[]}]},
    showResultStatus:false,
    platformsUrl:'http://43.138.146.161/#/login'
}
export default state
