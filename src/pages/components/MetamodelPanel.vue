<template>
  <div class="metamodel-panel">
    <Panel
      title="设置">
      <el-tabs value="first">
        <el-tab-pane label="信息" name="first">
          <el-form :model="selectData" :rules="rules" ref="selectData" label-width="70px">
            <el-form-item label="名称" prop="NameCn">
              <el-input
                v-model="selectData.NameCn"
                class="edge-width"
                type="text"
                @input="editChildrenContent('NameCn',selectData.NameCn)"/>
            </el-form-item>
            <el-form-item label="标识" prop="Name">
              <el-input
                v-model="selectData.Name"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="selectData.description"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="样式" name="second">
          <el-form ref="form"  label-width="70px">
            <el-form-item label="边框大小">
              <el-input-number v-model="vertexStyle.strokeWidth" size="mini" :min="1" :max="100" label="边框大小"
                               @input="handleStyleChange('strokeWidth',vertexStyle.strokeWidth)"></el-input-number>
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
              <el-input-number v-model="vertexStyle.fontSize" size="mini" :min="12" :max="36" label="字体大小"
                               @input="handleStyleChange('fontSize',vertexStyle.fontSize)"></el-input-number>
            </el-form-item>
            <el-form-item label="字体颜色">
              <el-color-picker v-model="vertexStyle.fontColor" show-alpha
                               @input="handleStyleChange('fontColor',vertexStyle.fontColor)"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-color-picker v-model="vertexStyle.fillColor" show-alpha
                               @input="handleStyleChange('fillColor',vertexStyle.fillColor)"></el-color-picker>
            </el-form-item>
            <el-form-item label="边框颜色">
              <el-color-picker v-model="vertexStyle.strokeColor" show-alpha
                               @input="handleStyleChange('strokeColor',vertexStyle.strokeColor)"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-color-picker v-model="vertexStyle.fillColor" show-alpha
                               @input="handleStyleChange('fillColor',vertexStyle.fillColor)"></el-color-picker>
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
      return {
        dialogFormVisible: false,
        formLabelWidth: '120px',
        rules: {
          NameCn: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
          Name: [
            {required: true, message: '请输入标识', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
          description: [
            {required: false, message: '请输入描述', trigger: 'blur'},
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
      levelType: {
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
      bsName() {
        return this.selectData.Name
      }
    },
    components: {
      Panel,
    },
    mounted() {
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
      },
      bsName(val, oval) {
        this.selectData.InstanceTableName = val
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
