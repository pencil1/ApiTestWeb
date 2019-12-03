<template>
    <div class="main-container">
        <caseTree></caseTree>
        <div>
            <header-menu v-if="update"></header-menu>
            <mainEditor v-if="update"></mainEditor>
            <navigator v-if="update"></navigator>
        </div>
    </div>

</template>

<script>
    import caseTree from '@/components/testCaseEdit/case_tree'
    import headerMenu from '@/components/testCaseEdit/header'
    import mainEditor from '@/components/testCaseEdit/main_editor/main_editor'
    import navigator from '@/components/testCaseEdit/main_editor/navigator'

    export default {

        name: 'editor',
        components: {
            caseTree,
            headerMenu,
            mainEditor,
            navigator
        },
        data() {
            return {
                update: false,

            }
        },
        created() {
            this.$eventBus.$on('getTestCaseFileData', (msg) => {
                // 移除组件
                this.update = false;
                // 在组件移除后，重新渲染组件
                // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
                if(msg){
                     this.$nextTick(() => {
                    this.update = true
                })
                }

            })


        },
    }

</script>

<style>
    @import "style/normalize.css";


</style>