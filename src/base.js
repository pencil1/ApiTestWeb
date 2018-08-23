
exports.install = function (Vue, options) {
    Vue.prototype.sureView = function (func, arg) {
        // this.$alert('确认要删除吗?', '确认框', {
        //                 confirmButtonText: '确定',
        //                 callback: action => {
        //                     func(arg);
        //                 }
        //             });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            func(arg);
        }).catch(() => {
        });
    };
    Vue.prototype.messageShow = function (_this, response) {
        if (response.data['status'] === 0) {
            _this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'warning',
            });
        }
        else {
            _this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'success',
            });
        }
    };

    Vue.prototype.getBaseData = function (_this) {
        _this.$axios.get('/api/api/proGather/list').then((response) => {
            _this.GLOBAL.proModelData = response.data['data'];
            _this.GLOBAL.configNameData = response.data['config_name_list'];
            _this.GLOBAL.proUrlData = response.data['urlData'];
            _this.GLOBAL.projectName = response.data['user_pro']['pro_name'];
            _this.GLOBAL.configName = response.data['config_name_list'][_this.GLOBAL.projectName][0].toString();
            _this.GLOBAL.modelName = response.data['user_pro']['model_list'][0].toString();
            }
        );
    };
};

