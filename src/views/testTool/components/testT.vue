<template>
  <div class="my-tree-main">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      :render-content="renderContent"
      :highlight-current="showTree"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "MyTree",
  data() {
    return {
      showTree: true,
      treeData: [
        {
          id: "1",
          name: "schoolDb",
          type: "category",
          children: [
            { id: "1-1", name: "user_t", type: "rain" },
            { id: "1-2", name: "class_t", type: "rain" },
            { id: "1-3", name: "grade_t", type: "rain" },
          ],
        },
      ],
      defaultProps: {
        //el-tree 树结构默认渲染的字段
        children: "children",
        label: "name",
        isLeaf:'isLeaf' //isLeaf在tree组件里面算是判断有没有子集 相当于可以控制三角显示▶️
      },


      //   这个函数要的是要返回一个dom结构,具体为啥应该是和组件有关系
      //   传参第一个应该是一个dom节点，后面会用到，但是我不知道为什么不直接取而是再去取自身的，可能会有好处吧
      // 第二个就是ES6的结构写法

    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    renderContent (h, { node, data, store }) {
        /**
            这个addElement等于的是一个自身的索引为0的东西
            我也不晓得这是个啥回来console看看吧
            大概率是一个dom结构或者是新增dom的东西
        */
        let addElement = arguments[0];
        // 这里判断这个rain类型，是和上面 children 有关系
        /*
            反正在最后返回了一个dom元素，一个i标签和俩span标签
            i标签添加个类名是放置icon图标，后面空span不知道干嘛的
            最后一个span是吧你要填写的文字传进去，他拿的是自身的索引为1的里面的
            我懂了，这个索引应该就是参数，这里拿到的是第二个参数中的数据
         */
        if (data.type === "rain") {
            return addElement("span", [
              addElement("i", { class: "el-icon-s-promotion" }), //可以自定义图标
              addElement("span", "    "),
              addElement("span", arguments[1].node.label),
            ]);
        } else {
          return addElement("span", [
            addElement("i", { class: "el-icon-s-promotion" }), // 类名自定义图标
            addElement("span", "    "),
            addElement("span", arguments[1].node.label),
          ]);
        }
      },
  },
};
</script>

<style scoped>
/*.icon {*/
/*  width:10px;*/
/*  height:10px;*/
/*  background:url('@assets/icon/logo.png');*/
/*  background-size:100% 100%;*/
/*}*/
</style>