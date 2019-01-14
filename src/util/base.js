
exports.install = function (Vue) {
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
            // if(response.data['error']){
            //     return 'error'
            // }
            return false
        }
        else {
            if(response.data['msg']){
                _this.$message({
                    showClose: true,
                    message: response.data['msg'],
                    type: 'success',
                });
            }

            return true
        }
    };
};

