const baseDataApi = '/api/proGather/list';
const getFuncAddressApi = '/api/func/getAddress';

const findProApi = '/api/project/find';
const addProApi = '/api/project/add';
const editProApi = '/api/project/edit';
const delProApi = '/api/project/del';

const findReportApi = '/api/report/find';
const delReportApi = '/api/report/del';

const findApiSetApi = '/api/apiSet/find';
const addApiSetApi = '/api/apiSet/add';
const editApiSetApi = '/api/apiSet/edit';
const delApiSetApi = '/api/apiSet/del';
const stickApiSetApi = '/api/apiSet/stick';

const findConfigApi = '/api/config/find';
const addConfigApi = '/api/config/add';
const editConfigApi = '/api/config/edit';
const delConfigApi = '/api/config/del';

const loginApi = '/api/login';
const loginSsoApi = '/api/loginSso';
const logoutApi = '/api/logout';
const registerApi = '/api/register';
const changePasswordApi = '/api/changePassword';
const msgApi = '/api/msg';

const findApiApi = '/api/apiMsg/find';
const delApiApi = '/api/apiMsg/del';
const runApiApi = '/api/apiMsg/run';
const addApiApi = '/api/apiMsg/add';
const editAndCopyApiApi = '/api/apiMsg/editAndCopy';

const findCaseSetApi = '/api/caseSet/find';
const delCaseSetApi = '/api/caseSet/del';
const addCaseSetApi = '/api/caseSet/add';
const stickCaseSetApi = '/api/caseSet/stick';

const startTaskApi = '/api/task/start';
const pauseTaskApi = '/api/task/pause';
const resumeTaskApi = '/api/task/resume';
const removeTaskApi = '/api/task/remove';
const runTaskApi = '/api/task/run';
const delTaskApi = '/api/task/del';
const editTaskApi = '/api/task/edit';
const addTaskApi = '/api/task/add';
const findTaskApi = '/api/task/find';

const findCaseApi = '/api/case/find';
const delCaseApi = '/api/case/del';
const runCaseApi = '/api/report/run';
const runStepApi = '/api/step/run';
const editCaseApi = '/api/case/edit';
const addCaseApi = '/api/case/add';
const delStepApi = '/api/step/del';
const addStepApi = '/api/step/add';
const configDataApi = '/api/config/data';


const fileUploadingApi = '/api/upload';
const checkFileApi = '/api/checkFile';
const importApiApi = '/api/apiMsg/fileChange';

const findFuncFileApi = '/api/FuncFile/find';
const addFuncFileApi = '/api/FuncFile/add';
const checkFuncFileApi = '/api/func/check';
const saveFuncFileApi = '/api/FuncFile/save';
const delFuncFileApi = '/api/FuncFile/del';
const getFuncFileApi = '/api/FuncFile/get';

const findUserApi = '/api/user/find';
const editUserApi = '/api/user/edit';
const delUserApi = '/api/user/del';
const changeStatusUserApi = '/api/user/changeStatus';

const findMockApiApi = '/mock/mockApi/find';
const delMockApiApi = '/mock/mockApi/del';
const addMockApiApi = '/mock/mockApi/add';
const editMockApi = '/mock/mockApi/edit';
// const saveTestCaseFileApi = '/api/testCaseFile/save';

export default {
    // addTestCaseFileApi,
    // findTestCaseFileApi,
    // delTestCaseFileApi,
    // getTestCaseFileApi,
    // saveTestCaseFileApi,
    addStepApi,
    delStepApi,

    findFuncFileApi,
    addFuncFileApi,
    checkFuncFileApi,
    saveFuncFileApi,
    delFuncFileApi,
    getFuncFileApi,

    baseDataApi,
    getFuncAddressApi,
    checkFileApi,

    findUserApi,
    editUserApi,
    delUserApi,
    changeStatusUserApi,

    findReportApi,
    delReportApi,

    startTaskApi,
    pauseTaskApi,
    resumeTaskApi,
    removeTaskApi,
    runTaskApi,
    delTaskApi,
    editTaskApi,
    addTaskApi,
    findTaskApi,

    findCaseApi,
    delCaseApi,
    runCaseApi,
    editCaseApi,
    addCaseApi,
    configDataApi,
    runStepApi,

    findCaseSetApi,
    delCaseSetApi,
    addCaseSetApi,
    stickCaseSetApi,

    findProApi,
    addProApi,
    editProApi,
    delProApi,

    findApiSetApi,
    addApiSetApi,
    editApiSetApi,
    delApiSetApi,
    stickApiSetApi,

    findConfigApi,
    addConfigApi,
    editConfigApi,
    delConfigApi,

    loginApi,
    loginSsoApi,
    logoutApi,
    registerApi,
    changePasswordApi,
    msgApi,

    findApiApi,
    delApiApi,
    runApiApi,
    addApiApi,
    editAndCopyApiApi,

    fileUploadingApi,
    importApiApi,

    findMockApiApi,
    delMockApiApi,
    addMockApiApi,
    editMockApi,
}