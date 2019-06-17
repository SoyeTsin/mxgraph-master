<template>
  <div class="metamodel-panel">
    <Panel
      title="设置">
      <el-tabs value="first">
        <el-tab-pane label="信息" name="first">
          <el-form ref="form" :model="childData" :rules="rules" label-width="70px">
            <el-form-item label="名称" prop="Name">
              <el-input
                v-model="childData.Name"
                class="edge-width"
                type="text"
                @input="editChildrenContent('Name',childData.Name)"/>
            </el-form-item>
            <el-form-item label="标识" prop="ColumnName">
              <el-input
                v-model="childData.ColumnName"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
            <el-form-item label="描述" prop="Description">
              <el-input
                v-model="childData.Description"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
            <el-form-item label="类型" prop="ColumnType">
              <el-select v-model="childData.ColumnType" placeholder="请选择">
                <el-option
                  v-for="item in ColumnType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="显示类型" prop="DisplayType">
              <el-select v-model="childData.DisplayType" placeholder="请选择">
                <el-option
                  v-for="item in DisplayType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="长度" prop="Length">
              <el-input
                v-model="childData.Length"
                class="edge-width"
                type="number"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                @input=""/>
            </el-form-item>
            <el-form-item label="是否为空" prop="IsNull">
              <el-switch
                v-model="childData.IsNull"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item label="枚举值" v-if="childData.ColumnType=='reference'" prop="ReferenceId">
              <el-input
                v-model="childData.ReferenceId"
                class="edge-width"
                type="text"
                @input=""/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="样式" name="second">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="字体大小">
              <el-input-number v-model="vertexStyle.fontSize" size="mini" :min="12" :max="36" label="字体大小"
                               @input="handleStyleChange('fontSize',vertexStyle.fontSize)"></el-input-number>
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
  import {ColumnType, DisplayType} from '../../common/data';


  export default {
    name: "AttributePanel",
    data() {
      const checkLength = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('长度不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value <= 0) {
              callback(new Error('必须大于0'));
            } else if (value > 1000000) {
              callback(new Error('必须小于1000000'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        form: {},
        formLabelWidth: '120px',
        childData: {}, ColumnType, DisplayType,
        rules: {
          Name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
          ColumnName: [
            {required: true, message: '请输入标识', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
          Description: [
            {required: false, message: '请输入描述', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ], ColumnType: [
            {required: false, message: '请输入描述', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ], DisplayType: [
            {required: false, message: '请输入描述', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ], Length: [
            {required: true, message: '请输入长度', trigger: 'blur'},
            { validator: checkLength, trigger: 'blur' }
          ], IsNull: [
            {required: true, message: '请选择是否为空', trigger: 'blur'},
          ], ReferenceId: [
            {required: false, message: '请输入描述', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ]
        }
      }

    },
    props: {
      selectData: {
        type: Object,
        required: true,
      },
      childIndex: {
        type: Number,
        default: 0,
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
    },
    components: {
      Panel,
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.childData = this.selectData
    },
    watch: {
      selectVertexStyle(val, oval) {
        console.log(val)
        console.log(oval)
      },
      selectData: {
        immediate: true,
        handler(val) {
          this.childData = val
        }
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
