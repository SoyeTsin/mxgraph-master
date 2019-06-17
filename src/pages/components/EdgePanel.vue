<template>
  <div
    class="edge-panel">
    <Panel
      title="线">
      <el-tabs value="first">
        <el-tab-pane label="属性" name="first">
          <el-form :model="selectData" :rules="rules" ref="selectData" label-width="70px">
            <el-form-item label="名称" prop="Title">
              <el-input
                v-model="selectData.Title"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
            <el-form-item label="标识" prop="Name">
              <el-input
                v-model="selectData.Name"
                class="edge-color"
                type="text"
                @input=""/>
            </el-form-item>
            <el-form-item label="类型" prop="ReferenceType">
              <el-input
                v-model="selectData.ReferenceType"
                class="edge-color"
                type="text"
                @input=""/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="样式" name="second">
          <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="线条宽度">
              <el-input-number v-model="selectEdgeStyle.strokeWidth" size="mini" :min="1" :max="36" label="线条宽度"
                               @input="handleStyleChange('strokeWidth',selectEdgeStyle.strokeWidth)"></el-input-number>
            </el-form-item>
            <el-form-item label="线条样式">
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
            <el-form-item label="线条颜色">
              <el-color-picker v-model="color" show-alpha
                               @input="handleStyleChange('strokeColor',color)"></el-color-picker>
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
    name: 'EdgePanel',
    data() {
      return {
        form: {},
        rules: {
          Title: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
          Name: [
            {required: true, message: '请输入标识', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
          ReferenceType: [
            {required: false, message: '请选择类型', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    props: {
      selectData: {
        type: Object,
        required: true,
      },
      selectEdgeStyle: {
        type: Object,
        required: true,
      },
      dashed: {
        type: Number,
        default: 0,
      },
      color: {
        type: String,
        required: true,
      },
      handleStyleChange: {
        type: Function,
        required: true,
      },
    },

    computed: {
      selectStyleClass() {
        return this.dashed ? 'dashed-line' : 'solid-line';
      },
    },

    components: {
      Panel,
    },
  }
</script>

<style lang="less" scoped>
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
      height: 28px;
      width: 130px;
      margin-top: 6px;
      cursor: pointer;
    }

    .style-select-box:active {
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
