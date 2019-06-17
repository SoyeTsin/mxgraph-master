<template>
  <ElContainer
    class="app-canvas">

    <!--    <ElAside-->
    <!--      class="app-canvas__left"-->
    <!--      width="234px">-->
    <!--      <Panel-->
    <!--        class="element-panel"-->
    <!--        title="元模型">-->
    <!--        <div>-->
    <!--          元模型分类区域-->
    <!--        </div>-->
    <!--      </Panel>-->

    <!--    </ElAside>-->
    <ElMain
      class="app-canvas__main">
      <div
        class="tool-bar">

        <ElButton
          @click=""
          type="text"
          size="mini">
          返回
        </ElButton>

      </div>
      <div id="graphContainer">
        <!--        <ElSelect-->
        <!--          v-if="normalTypeSelectVisible"-->
        <!--          class="normal-type-select"-->
        <!--          :style="{-->
        <!--          top:normalTypePosition.top,-->
        <!--          left:normalTypePosition.left-->
        <!--          }"-->
        <!--          :value="selectVertex.data.normalType"-->
        <!--          @input="changeNormalType">-->
        <!--          <ElOption-->
        <!--            v-for="item in normalTypeOptions"-->
        <!--            :key="item.label"-->
        <!--            :label="item.label"-->
        <!--            :value="item.icon">-->
        <!--            <div-->
        <!--              class="normal-type-item">-->
        <!--              <img-->
        <!--                :src="`/static/images/normal-type/${item.icon}`"-->
        <!--                :alt="item.icon">-->
        <!--              <span-->
        <!--                class="ml8">{{ item.label }}</span>-->
        <!--            </div>-->
        <!--          </ElOption>-->
        <!--        </ElSelect>-->
      </div>
    </ElMain>
    <el-aside class="app-canvas__right"
              width="234px">
      <EdgePanel
        v-if="!_.isEmpty(this.selectEdgeStyle)"
        :selectData='selectEdge.data'
        :selectEdgeStyle="selectEdgeStyle"
        :dashed="selectEdgeStyle.dashed"
        :color="selectEdgeStyle.strokeColor"
        :handleStyleChange="changeEdgeStyle"/>
      <MetamodelPanel
        v-if="!_.isEmpty(this.selectVertexStyle)&&selectVertex.levelType==0"
        :selectData='selectVertex.data.Ci'
        :childIndex='selectVertex.childIndex'
        :levelType='selectVertex.levelType'
        :selectChildren="selectVertex.children"
        :vertex-style='selectVertexStyle'
        :dashed="selectVertexStyle.dashed"
        :handleStyleChange="changeVertexStyle"
        :editChildrenContent="editChildrenContent"
        ref="MetamodelPanelRef"
      />
      <ChildMetamodelPanel
        v-if="!_.isEmpty(this.selectVertexStyle)&&selectVertex.levelType==1"
        :selectData='selectVertex.data'
        :levelType='selectVertex.levelType'
        :vertex-style='selectVertexStyle'
        :dashed="selectVertexStyle.dashed"
        :handleStyleChange="changeVertexStyle"
        :editChildrenContent="editChildrenContent"
        ref="MetamodelPanelRef"
      />
    </el-aside>
    <div class="outline-wrapper">
      <div class="title">导航器</div>
      <div id="graphOutline"/>
    </div>
    <div class="add-node">
      <section>
        <ul
          class="elements">
          <li class="element">
            <el-tooltip class="item" effect="dark" content="拖拽新增节点" placement="right">
              <img
                v-bind="elements.Ci"
                class="element-img"
                :src="`/static/images/normal-type/add_database.png`"
                :alt="elements.Ci.NameCn"/></el-tooltip>
          </li>
        </ul>
      </section>
      <div class="icon" @click="createCiFun">
        <el-tooltip class="item" effect="dark" content="保存" placement="right">
          <img :src="`/static/images/normal-type/save.png`"/>
        </el-tooltip>
      </div>
      <div class="icon" @click="importFile">
        <el-tooltip class="item" effect="dark" content="导入" placement="right">

          <img :src="`/static/images/normal-type/import.png`"/></el-tooltip>
        <input
          @change="readFile"
          ref="importInput"
          class="hide"
          type="file">
      </div>
      <div class="icon" @click="exportFile">
        <el-tooltip class="item" effect="dark" content="导出" placement="right">

          <img :src="`/static/images/normal-type/export.png`"/></el-tooltip>
      </div>
      <div class="icon" @click="del">
        <el-tooltip class="item" effect="dark" content="删除" placement="right">

          <img :src="`/static/images/normal-type/delete.png`"
               :class="_.isEmpty(selectVertex) && _.isEmpty(selectEdge)?'hild':''"/></el-tooltip>
      </div>
    </div>
  </ElContainer>
</template>

<script>
  import FileSaver from 'file-saver';
  import Panel from 'components/Panel';
  import mxgraph from '../graph/index';
  import {genGraph, destroyGraph, Graph} from '../graph/Graph';
  import EdgePanel from './components/EdgePanel';
  import MetamodelPanel from './components/MetamodelPanel';
  import ChildMetamodelPanel from './components/ChildMetamodelPanel';
  import {elements, normalTypeOptions, ciEdge, Attributes} from '../common/data';

  const {
    mxGraph,
    mxOutline,
    mxEvent,
    mxCell,
    mxGeometry,
    mxUtils,
    mxEventObject,
    mxConnectionHandler,
  } = mxgraph;

  Object.assign(mxEvent, {
    NORMAL_TYPE_CLICKED: 'NORMAL_TYPE_CLICKED',
  });

  let graph = null;
  let outline = null;
  let idSeed = 0;

  const insertVertex = (dom, target, x, y) => {
    // const src = dom.getAttribute('src');
    const Id = Number(dom.getAttribute('Id'));
    let newGeometry = new mxGeometry(0, 0, 100, 50)
    const title = dom.getAttribute('alt');

    const nodeRootVertex = new mxCell(title, newGeometry, 'verticalAlign=top;overflow=fill;fontSize=12;fontFamily=Helvetica;strokeWidth=1;html=1;');
    // const nodeRootVertex = new mxCell(null, new mxGeometry(0, 0, 100, 135), `node;image=${src}`);
    nodeRootVertex.vertex = true;
    // 禁用折叠
    nodeRootVertex.foldingEnabled = false;
    // 内部cell 跟随 父cell 等比例缩放
    nodeRootVertex.recursiveResize = true;

    // 自定义的业务数据放在 data 属性
    idSeed++;
    // levelType 等级类型 0 父级 1 子级 -1图标

    nodeRootVertex.levelType = 0
    nodeRootVertex.data = elements;
    const itemVertex = graph.insertVertex(nodeRootVertex, null, null,
      0.42, 0.2, 16, 16,
      'normalType;constituent=1;fillColor=none;image=/static/images/normal-type/add.png',
      true);
    itemVertex.levelType = -1
    itemVertex.setConnectable(false);

    // const child = nodeRootVertex.data.Attributes
    const child = []
    insertChild(child, 0, nodeRootVertex, () => {
      const cells = graph.importCells([nodeRootVertex], x, y, target);
      if (cells != null && cells.length > 0) {
        graph.setSelectionCells(cells);
      }
    })
  };

  const insertChild = (child, index, nodeRootVertex, cb) => {
    if (index < child.length) {
      const itemVertex = graph.insertVertex(nodeRootVertex, null, child[index].Name,
        0, 0.15 * (index + 1), 100, 20,
        'text;strokeColor=none;fontSize=12;fillColor=none;align=left;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;',
        true);
      itemVertex.setConnectable(false);
      itemVertex.levelType = 1
      itemVertex.data = child[index]
      index++
      insertChild(child, index, nodeRootVertex, cb)
    } else {
      cb()
    }
  }
  const makeDraggable = (sourceEles) => {
    const dropValidate = function (evt) {
      const x = mxEvent.getClientX(evt);
      const y = mxEvent.getClientY(evt);
      // 获取 x,y 所在的元素
      const elt = document.elementFromPoint(x, y);
      // 如果鼠标落在graph容器
      if (mxUtils.isAncestorNode(graph.container, elt)) {
        return graph;
      }
      // 鼠标落在其他地方
      return null;
    };

    // drop成功后新建一个节点
    const dropSuccessCb = function (_graph, evt, target, x, y) {

      insertVertex(this.element, target, x, y);
      //添加数据
    };

    Array.from(sourceEles).forEach((ele) => {
      //创建一个图片标签
      const dragElt = document.createElement('div');
      //给表情赋予属性
      // dragElt.setAttribute('src', ele.getAttribute('src'));
      dragElt.setAttribute('style', 'width:120px;height:120px;background-color: #e5e5e5;');

      mxUtils.makeDraggable(ele, dropValidate, dropSuccessCb, dragElt,
        null, null, null, true);
    });
  };

  const listenGraphEvent = () => {
    graph.addListener(mxEvent.CLICK, (sender, evt) => {
      const cell = evt.properties.cell;
      if (!cell) {
        return;
      }

      //给小图标添加事件
      const clickNormalType = cell.style.includes('normalType');
      if (clickNormalType) {
        // 使用 mxGraph 事件中心，触发自定义事件
        graph.fireEvent(new mxEventObject(mxEvent.NORMAL_TYPE_CLICKED, 'cell', cell));
      }
    });
  };

  const setCursor = () => {
    const oldGetCursorForCell = mxGraph.prototype.getCursorForCell;
    graph.getCursorForCell = function (...args) {
      const [cell] = args;
      return cell.style.includes('normalType') ?
        'pointer' :
        oldGetCursorForCell.apply(this, args);
    };
  };

  const setConnectValidation = () => {
    // 连接边校验
    mxGraph.prototype.isValidConnection = (source, target) => {
      // const sourceElementId = source.data.Ci.Id;
      // const targetElementId = target.data.Ci.Id;
      // // 如果源点是智爷，终点必须是 皮卡丘 或 我是皮卡丘的超级超级进化
      // if (sourceElementId === 1) {
      //   return targetElementId === 2 || targetElementId === 3;
      // }
      //
      // // 如果终点是智爷同理
      // if (targetElementId === 1) {
      //   return sourceElementId === 2 || sourceElementId === 3;
      // }

      return true;
    };
  };

  const initGraph = () => {
    graph = genGraph(document.getElementById('graphContainer'));
    graph.setHtmlLabels(true);
    outline = new mxOutline(graph, document.getElementById('graphOutline'));
    // 将外元素拖拽进画布参考这个例子
    // https://github.com/jinzhanye/mxgraph-demos/blob/master/src/07.drag.html
    makeDraggable(document.getElementsByClassName('element-img'));
    listenGraphEvent();
    setCursor();
    setConnectValidation();
  };


  export default {
    name: 'AppCanvas',

    data() {
      return {
        normalTypeSelectVisible: false,
        normalTypePosition: {
          top: '0',
          left: '0',
        },
        normalTypeOptions,
        elements,
        Attributes,
        ciEdge,
        AttributesArr: [],
        createCiParameter: {},
        selectEdge: {},
        selectVertex: {},
      };
    },

    components: {
      Panel,
      EdgePanel,
      MetamodelPanel,
      ChildMetamodelPanel
    },

    computed: {
      selectEdgeStyle() {
        if (!_.isEmpty(this.selectEdge)) {
          return graph.getCellStyle(this.selectEdge);
        }
        return {};
      },
      selectVertexStyle() {
        if (!_.isEmpty(this.selectVertex)) {
          return graph.getCellStyle(this.selectVertex);
        }
        return {};
      }
    },

    methods: {
      exportPic() {
        const data = graph.exportPicXML();
        console.log(data);
        // 发送 data 到服务端 ....
        // 服务端如果是使用 Java 可以参考官方这例子
        // https://github.com/jgraph/mxgraph/blob/master/java/test/com/mxgraph/test/mxImageExportTest.java
      },
      logXML() {
        this.$message.info('已经输出，请在控制台查看');
        const xml = graph.exportModelXML();
        console.log(xml);
        console.log('mode:', graph.getModel());
        this.saveCellXML()
      },
      //*******
      // File
      //*******
      // 导出、导入功能参考这个例子
      // https://github.com/jgraph/mxgraph/blob/master/javascript/examples/fileio.html
      exportFile() {
        //导出文件
        const xml = graph.exportModelXML();
        const blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "pocket_monster.xml");
      },
      readFile(evt) {
        //读取文件
        const file = evt.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const txt = e.target.result;
          graph.importModelXML(txt);
        };
        reader.readAsText(file);
      },
      importFile() {
        //导入文件
        this.$refs.importInput.click();
      },
      //
      del() {
        if (!_.isEmpty(this.selectVertex)) {
          graph.deleteSubtree(this.selectVertex);
        } else {
          graph.removeCells([this.selectEdge]);
        }
      },
      //
      changeEdgeStyle(key, value) {
        //更改边缘样式
        graph.setStyle(this.selectEdge, key, value);
      },
      changeVertexStyle(key, value) {
        //更改边缘样式
        graph.setStyle(this.selectVertex, key, value);
      },
      editChildrenContent(type, value) {
        //改变子属性名字，更新到图形上
        this.$message.info(type + ':' + value);
        let cell = this.selectVertex
        cell.setValue(value)
        graph.refresh(this.selectVertex)//重绘

      },
      //************
      // NormalType
      //************
      changeNormalType(val) {
        //更改普通类型
        this.hideTypeSelect();
        this.selectVertex.data.normalType = val;
        const normalTypeVertex = this.selectVertex.children[1];
        graph.setStyle(normalTypeVertex, 'image', `/static/images/normal-type/${val}`);
        // normalTypeVertex.setNamedItem('qwe')

      },
      hideTypeSelect() {
        //隐藏类型选择
        this.normalTypeSelectVisible = false;
      },
      showNormalTypeSelect(sender, evt) {
        //添加一个新的子cell
        let index = this.selectVertex.children.length - 1
        let Attributes = JSON.parse(JSON.stringify(this.Attributes))
        const itemVertex = graph.insertVertex(this.selectVertex, null, Attributes.Name,
          0, 0.15 + 0.15 * index, 100, 20,
          'text;strokeColor=none;fontSize=12;fillColor=none;align=left;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;',
          true);
        itemVertex.setConnectable(false);
        itemVertex.levelType = 1
        this.AttributesArr.push(Attributes)
        itemVertex.data = this.AttributesArr[this.AttributesArr.length - 1]
        itemVertex.childIndex = index
        this.updateGeometry()
      },
      updateGeometry() {
        //更新布局和大小 初版
        let index = this.selectVertex.children.length - 1
        const addVertex = this.selectVertex.children[0];
        let geometry = addVertex.geometry;
        geometry.y += 0.15;
        const total = 50 + index * 20
        this.selectVertex.geometry.height = total
        const childrenArr = this.selectVertex.children
        for (let i in childrenArr) {
          if (i != 0) {
            childrenArr[i].geometry.y = (i * 1) * (20 / (total));
          }
          if (i == 0) {
            childrenArr[i].geometry.y = (index * 1 + 1) * (20 / (total - 10));
          }
        }
        graph.refresh(this.selectVertex)//重绘
      },
      /**
       * 选中cell事件处理@@@@@@
       * @param selectModel
       */
      handleSelectionChange(selectModel) {
        //处理选择cell更改

        this.selectVertex = {};
        this.selectEdge = {};
        if (!selectModel.cells.length) {
          return;
        }

        const cell = selectModel.cells[0];

        if (cell.vertex) {
          this.selectVertex = cell;
          this.selectData = this.selectVertex.data
          if (cell.levelType == 0) {
            this.updateGeometry()
          }

        } else {
          this.selectEdge = cell;
        }
      },
      /**
       * 事件管理
       * @private
       */
      _listenEvent() {
        const that = this
        // 监听自定义事件
        graph.addListener(mxEvent.NORMAL_TYPE_CLICKED, this.showNormalTypeSelect);
        graph.addListener(mxEvent.VERTEX_START_MOVE, this.hideTypeSelect);


        // 监听 mxGraph 事件
        const mxGraphSelectionModel = graph.getSelectionModel();
        mxGraphSelectionModel.addListener(mxEvent.CHANGE, this.handleSelectionChange);

        const vm = this;
        graph.addListener(mxEvent.MOVE_CELLS, (sender, evt) => {
          const cell = evt.properties.cells[0];
          const position = Graph.getCellPosition(cell);
          setTimeout(() => {
            // vm.$message.info(`节点被移动到 ${JSON.stringify(position)}`);
          }, 1000);
        });

        graph.addListener(mxEvent.CELLS_ADDED, (sender, evt) => {
          const cell = evt.properties.cells[0];
          if (graph.isPart(cell)) {
            return;
          }

          if (cell.vertex) {
            this.$message.info('添加了一个节点');
          } else if (cell.edge) {
            this.$message.info('添加了一条线');
            cell.data = ciEdge
          }
        });

        graph.addListener(mxEvent.LABEL_CHANGED, (sender, evt) => {
          vm.$message.info(`内容改变为：${evt.getProperty('value')}`);
          let Id = evt.properties.cell.data.Id
          for (let i in vm.elements) {
            if (vm.elements[i].Id === Id) {
              // vm.elements[i].name = evt.getProperty('value')
              // that.selectData.data.name=evt.getProperty('value')
              that.$refs.MetamodelPanelRef.selectData.Ci.NameCn = evt.getProperty('value')
              // that.MetamodelPanelRef
            }
          }
        });

        graph.addListener(mxEvent.CONNECT_CELL, (sender, evt) => {
          vm.$message.info(`改变了连线`);

        });
      },
      createCiFun() {
        this.saveModel()
      },
      saveCellXML() {
        //保存XML
        const xml = graph.exportModelXML();
        let parameter = {
          "Content": xml,
          "Id": 0,
          "Type": "mata"
        }
        this.$post(this.$api.AddXml, parameter).then((response) => {
          this.$message.info(`XML保存操作已提交`);
        })
      },
      saveModel() {
        let node = []
        let line = []
        //保存所有的元模型
        const cellArr = graph.model.root.children[0].children
        for (let i in cellArr) {
          let cell = cellArr[i]
          if (cell.vertex && cell.levelType == 0) {
            node.push(cell)
          } else {
            line.push(cell)
          }
        }
        let submitNodeIndex = 0
        const submitNode = () => {
          if (submitNodeIndex < node.length) {
            let parameter = node[submitNodeIndex].data
            let nodeChildren = node[submitNodeIndex].children
            for (let i in nodeChildren) {
              if (nodeChildren[i].levelType == 1) {
                parameter.Attributes.push(nodeChildren[i].data)
              }
            }
            this.$post(this.$api.CreateCi, parameter).then((response) => {

              if (response.ErrorCode == 0) {
                node[submitNodeIndex].data.Ci.Id = response.Data.Ci.Id
                submitNodeIndex++
                submitNode()
              } else {
                this.$message.error(response.ErrorMsg);
              }
            })
          } else {
            this.$message.info(`全部node保存操作已提交`);
            this.saveContact(line)
          }
        }
        submitNode()
      },
      saveContact(edge) {
        //保存所有的连线关系
        console.log(edge)
        let lineArr = []
        for (let i in edge) {
          edge[i].data.SrcCiTypeId = edge[i].source.data.Ci.Id
          edge[i].data.TarCiTypeId = edge[i].target.data.Ci.Id
          lineArr.push(edge[i].data)
        }
        let submitNodeIndex = 0
        const submitNode = () => {
          if (submitNodeIndex < lineArr.length) {

            this.$post(this.$api.AddCiTypeRef, lineArr[submitNodeIndex]).then((response) => {
              if (response.ErrorCode == 0) {
                edge[submitNodeIndex].data.Id = response.Data.Id
                submitNodeIndex++
                submitNode()
              } else {
                this.$message.error(response.ErrorMsg);
              }
            })
          } else {
            this.$message.info(`连线保存操作已提交`);
            this.saveCellXML()
          }
        }
        submitNode()
      }
    },

    mounted() {
      initGraph();
      this._listenEvent();
    },

    beforeDestroy() {
      destroyGraph();
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/style/module/util";

  .app-canvas {
    #graphContainer {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 90vh;
      background: #eee url('../assets/images/grid.gif') 0 0 repeat;
      /*border-radius: 2px;*/
    }

    &__main {
      .tool-bar {
        background: #eee;
        padding-left: 10px;
        /*border-radius: 2px;*/
        margin-bottom: 10px;
      }

      .normal-type-select {
        position: fixed;
        width: 150px;
      }
    }

    &__right, &__left {
      position: relative;
      box-sizing: border-box;
      padding: 20px 20px 0 0;


      .elements {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        cursor: pointer;

        .element {
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
          border: solid 1px #e5e5e5;
          height: 35px;
          line-height: 35px;
          -webkit-border-radius: 2px;
          -moz-border-radius: 2px;
          border-radius: 2px;

          > img {
            /*border-radius: 2px;*/
            cursor: pointer;
            width: 100%;
            height: 100px;
          }

          > p {
            color: #333;
            margin-top: 8px;
          }
        }
      }
    }

    &__left {
      padding: 20px 0 0 20px;
    }

    .outline-wrapper {
      border: 1px solid #dedede;
      background: #fff;
      position: absolute;
      left: 28px;
      bottom: 22px;
      border-radius: 2px;
      z-index: 10;

      > .title {
        height: 20px;
        line-height: 20px;
        box-sizing: border-box;
        padding: 0 4px;
        font-size: 12px;
        border-bottom: 1px solid #e6e6e6;
      }

      #graphOutline {
        width: 140px;
        height: 80px;
      }
    }

    .add-node {
      border: 1px solid #dedede;
      background: #fff;
      position: absolute;
      left: 28px;
      top: 65px;
      border-radius: 2px;
      z-index: 10;
      width: 36px;

      img {
        width: 36px;
        height: 36px;
        cursor: crosshair;
      }

      .icon {
        box-sizing: border-box;
        padding: 4px;
        width: 36px;
        height: 36px;
        cursor: pointer;

        > img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .hild {
          opacity: 0.3;
          cursor: default;
        }
      }
    }
  }

  .normal-type-item {
    display: flex;
    align-items: center;

    & > img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
</style>
