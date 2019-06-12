<template>
  <div class="metamodel-panel">
    <Panel
      :title="selectData.element.name">
      <el-tabs value="first">
        <el-tab-pane label="信息" name="first">
          <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="名称">
              <el-input
                v-model="selectData.element.name"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
            <el-form-item label="标识">
              <el-input
                v-model="selectData.element.id_adm_ci_type"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="selectData.element.description"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="样式" name="second">
          <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="边框大小">
              <el-input
                v-model="vertexStyle.strokeWidth"
                class="edge-width"
                min="1"
                type="number"
                @input="handleStyleChange('strokeWidth',vertexStyle.strokeWidth)"/>
            </el-form-item>
            <el-form-item label="边框样式">
              <section class="content">
                <ElPopover
                  popper-class="line-popper"
                  placement="bottom"
                  width="80"
                  trigger="click">
                  <div
                    class="style-select-box"
                    slot="reference">
                    <div :class="selectStyleClass"></div>
                  </div>
                  <ul
                    class="line-box">
                    <li
                      @click="handleStyleChange('dashed',0)">
                      <div class="solid-line"></div>
                    </li>
                    <li
                      @click="handleStyleChange('dashed',1)">
                      <div class="dashed-line"></div>
                    </li>
                  </ul>
                </ElPopover>
              </section>
            </el-form-item>
            <el-form-item label="字体大小">
              <el-input
                v-model="vertexStyle.fontSize"
                class="edge-width"
                min="1"
                type="number"
                @input="handleStyleChange('fontSize',vertexStyle.fontSize)"/>
            </el-form-item>
            <el-form-item label="字体颜色">
              <el-input
                v-model="vertexStyle.fontColor"
                class="edge-color"
                type="color"
                @input="handleStyleChange('fontColor',vertexStyle.fontColor)"/>
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-input
                v-model="vertexStyle.fillColor"
                class="edge-color"
                type="color"
                @input="handleStyleChange('fillColor',vertexStyle.fillColor)"/>
            </el-form-item>
            <el-form-item label="边框颜色">
              <el-input
                v-model="vertexStyle.strokeColor"
                class="edge-color"
                type="color"
                @input="handleStyleChange('strokeColor',vertexStyle.strokeColor)"/>
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-input
                v-model="vertexStyle.fillColor"
                class="edge-color"
                type="color"
                @input="handleStyleChange('fillColor',vertexStyle.fillColor)"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </Panel>
  </div>
</template>

<script>
  import Panel from 'components/Panel';

  export default {
    name: "AttributePanel",
    data() {
      return {form: {}}
    },
    props: {
      selectData: {
        type: Object,
        required: true,
      },
      selectChildren: {
        type: Array,
        required: true,
      },
      vertexStyle: {
        type: Object,
        required: true,
      },
      dashed: {
        type: Number,
        default: 0,
      },
      levelType:{
        type: Number,
        default: 0,
      },
      handleStyleChange: {
        type: Function,
        required: true,
      },
      editChildrenContent: {
        type: Function,
        required: true,
      },
    },
    computed: {
      selectVertexStyle() {
        return this.vertexStyle
      },
      selectStyleClass() {
        return this.dashed ? 'dashed-line' : 'solid-line';
      },
    },
    components: {
      Panel,
    },
    methods: {
      // editContent(item){
      //   console.log(item)
      // }
    },
    watch: {
      selectVertexStyle(val, oval) {
        console.log(val)
        console.log(oval)
      }
    },
  }
</script>

<style scoped lang="less">
  .content {
    .edge-width {
      padding-left: 2px;
      border-radius: 4px;
    }

    .edge-color {
      border-radius: 2px;
    }

    .style-select-box {
      display: flex;
      align-items: center;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 8px;
      height: 40px;
      cursor: pointer;
    }
    .style-select-box:active{
      border: 1px solid #599df8;
    }
  }
  .line-popper {
    min-width: 40px;

    .line-box {
      > li {
        cursor: pointer;
        padding: 9px 0;
      }
    }
  }

  .solid-line {
    width: 100%;
    border-bottom: 1px solid #000;
  }

  .dashed-line {
    width: 100%;
    border-bottom: 1px dashed #000;
  }
</style>
