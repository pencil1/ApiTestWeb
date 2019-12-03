<template>
<div class="font-group">
  <el-select v-model="fontFamilyDefaultValue" placeholder="字体" class="font-family-select" :disabled="disabledFont" @change="execCommandFontFamily">
    <el-option v-for="item in fontFamilys" :label="item.name" :value="item.value" :key="item.id" :style="{'font-family':item.value}">
    </el-option>
  </el-select>
  <el-select v-model="fontSizeDefaultValue" placeholder="字号" class="font-size-select" :disabled="disabledFontSize" @change="execCommandFontSize">
    <el-option v-for="item in fontSizes" :label="item.label" :value="item.value" :key="item.id" :style="{'font-size':item.value+'px','height':2*item.value+'px', 'line-height':2*item.value+'px','padding':0}">
    </el-option>
  </el-select>
  <span class="font-bold menu-btn tab-icons" @click="execCommandFontStyle('bold')" :class="{'selected':boldSelected}" :disabled="disabledBold"></span>
  <span class="font-italic menu-btn tab-icons" @click="execCommandFontStyle('italic')" :class="{'selected':italicSelected}" :disabled="disabledItalic"></span>
</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      fontFamilys: [
        {
          id: 1,
          value: "宋体,SimSun",
          name: "宋体"
        },
        {
          id: 2,
          value: "微软雅黑,Microsoft YaHei",
          name: "微软雅黑"
        },
        {
          id: 3,
          value: "楷体,楷体_GB2312,SimKai",
          name: "楷体"
        },
        {
          id: 4,
          value: "黑体, SimHei",
          name: "黑体"
        },
        {
          id: 5,
          value: "隶书, SimLi",
          name: "隶书"
        },
        {
          id: 6,
          value: "andale mono",
          name: "Andale Mono"
        },
        {
          id: 7,
          value: "arial,helvetica,sans-serif",
          name: "Arial"
        },
        {
          id: 8,
          value: "arial black,avant garde",
          name: "arialBlack"
        },
        {
          id: 9,
          value: "comic sans ms",
          name: "comic Sans Ms"
        },
        {
          id: 10,
          value: "impact,chicago",
          name: "Impact"
        },
        {
          id: 11,
          value: "times new roman",
          name: "times New Roman"
        },
        {
          id: 12,
          value: "sans-serif",
          name: "Sans-Serif"
        }
      ],

      fontSizes: [
        {
          id: 1,
          value: 10,
          label: 10
        },
        {
          id: 2,
          value: 12,
          label: 12
        },
        {
          id: 3,
          value: 16,
          label: 16
        },
        {
          id: 4,
          value: 18,
          label: 18
        },
        {
          id: 5,
          value: 24,
          label: 24
        },
        {
          id: 6,
          value: 32,
          label: 32
        },
        {
          id: 7,
          value: 48,
          label: 48
        }
      ],
      fontFamilyDefaultValue: "字体",
      fontSizeDefaultValue: "字号"
    };
  },

  computed: {
    ...mapGetters({
      minder: "getMinder"
    }),
    currentTheme() {
      return this.minder.getThemeItems();
    },

    // 直接定义model的计算型属性会时select异常，
    disabledFont() {
      var currentFontFamily =
        this.minder.queryCommandValue &&
        this.minder.queryCommandValue("fontfamily");
      this.fontFamilyDefaultValue = currentFontFamily || "字体";
      return (
        this.minder.queryCommandState &&
        this.minder.queryCommandState("fontfamily") === -1
      );
    },
    disabledFontSize() {
      this.fontSizeDefaultValue =
        (this.minder.queryCommandValue &&
          this.minder.queryCommandValue("fontsize")) ||
        "字号";
      return (
        this.minder.queryCommandState &&
        this.minder.queryCommandState("fontsize") === -1
      );
    },
    disabledBold() {
      return (
        this.minder.queryCommandState &&
        this.minder.queryCommandState("bold") === -1
      );
    },
    disabledItalic() {
      return (
        this.minder.queryCommandState &&
        this.minder.queryCommandState("italic") === -1
      );
    },
    boldSelected() {
      return (
        this.minder.queryCommandState &&
        this.minder.queryCommandState("bold") == 1
      );
    },
    italicSelected() {
      return (
        this.minder.queryCommandState &&
        this.minder.queryCommandState("italic") == 1
      );
    }
  },
  methods: {
    execCommandFontFamily(value) {
      if (value == "字体") {
        return;
      }
      this.minder.execCommand("fontfamily", value);
    },
    execCommandFontSize(value) {
      if (typeof value !== "number") {
        return;
      }
      this.minder.execCommand("fontsize", value);
    },
    execCommandFontStyle(style) {
      var minder = this.minder;
      switch (style) {
        case "bold":
          minder.queryCommandState("bold") === -1 || minder.execCommand("bold");
          break;
        case "italic":
          minder.queryCommandState("italic") === -1 ||
            minder.execCommand("italic");
          break;
      }
    }
  }
};
</script>
