<template>
  <ElContainer
    class="app-canvas">

    <ElAside
      class="app-canvas__left"
      width="234px">
      <Panel
        class="element-panel"
        title="元模型">
        <section>
          <ul
            class="elements">
            <li
              class="element"
              v-for="(element,idx) in elements"
              :key="idx">
              <div
                v-bind="element"
                class="element-img"
                :src="`/static/images/ele/${element.icon}`"
                :alt="element.name">
                <p>{{ element.name }}</p>
              </div>

            </li>
          </ul>
        </section>
      </Panel>

    </ElAside>
    <ElMain
      class="app-canvas__main">
      <div
        class="tool-bar">
        <input
          @change="readFile"
          ref="importInput"
          class="hide"
          type="file">
        <ElButton
          type="text"
          size="mini"
          @click="importFile">
          导入
        </ElButton>
        <ElButton
          @click="exportFile"
          type="text"
          size="mini">
          导出
        </ElButton>
        <ElButton
          @click="logXML"
          type="text"
          size="mini">
          输出XML
        </ElButton>
        <ElButton
          type="text"
          size="mini"
          @click="del"
          :disabled="_.isEmpty(selectVertex) && _.isEmpty(selectEdge)">
          删除
        </ElButton>
        <ElButton
          @click="exportPic"
          type="text"
          size="mini">
          导出图片
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
        :width="selectEdgeStyle.strokeWidth"
        :dashed="selectEdgeStyle.dashed"
        :color="selectEdgeStyle.strokeColor"
        :handleStyleChange="changeEdgeStyle"/>
      <MetamodelPanel
        v-if="!_.isEmpty(this.selectVertexStyle)&&selectVertex.levelType==0"
        :selectData='selectVertex.data'
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
    <div
      class="outline-wrapper">
      <h4>导航器</h4>
      <div
        id="graphOutline"/>
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
  import {elements, normalTypeOptions} from '../common/data';

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
    const id_adm_ci_type = Number(dom.getAttribute('id_adm_ci_type'));
    let newGeometry = new mxGeometry(20, 20, 100, 135)
    const title = dom.getAttribute('alt');

    const nodeRootVertex = new mxCell(title, newGeometry, 'verticalAlign=top;overflow=fill;fontSize=12;fontFamily=Helvetica;strokeWidth=1;html=1;');
    // const nodeRootVertex = new mxCell(null, new mxGeometry(0, 0, 100, 135), `node;image=${src}`);
    nodeRootVertex.vertex = true;

    // 自定义的业务数据放在 data 属性
    idSeed++;
    // levelType 等级类型 0 父级 1 子级 -1图标

    nodeRootVertex.levelType = 0
    nodeRootVertex.data = {
      id: idSeed,
      element: elements.find((element) => element.id_adm_ci_type === id_adm_ci_type),
      normalType: '',
    };
    const itemVertex = graph.insertVertex(nodeRootVertex, null, null,
      0, 0, 20, 20,
      'normalType;constituent=1;fillColor=none;image=/static/images/normal-type/add.png',
      true);
    itemVertex.levelType = -1

    itemVertex.setConnectable(false);
    const child = nodeRootVertex.data.element.child
    insertChild(child, 0, nodeRootVertex, () => {
      const cells = graph.importCells([nodeRootVertex], x, y, target);
      if (cells != null && cells.length > 0) {
        graph.setSelectionCells(cells);
      }
    })
  };

  const insertChild = (child, index, nodeRootVertex, cb) => {
    if (index < child.length) {
      const itemVertex = graph.insertVertex(nodeRootVertex, null, child[index].name,
        0, 0.15 + 0.15 * index, 100, 20,
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
      const sourceElementId = source.data.element.id;
      const targetElementId = target.data.element.id;
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
      editChildrenContent(index, value) {
        //点击子属性名字执行的方法
        this.$message.info(index + ':' + value.data.name);
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
        //显示正常类型选择
        // const normalTypeDom = graph.getDom(evt.getProperty('cell'));
        // const {left, top} = normalTypeDom.getBoundingClientRect();
        // this.normalTypePosition.left = `${left + 80}px`;
        // this.normalTypePosition.top = `${top + 20}px`;
        // this.normalTypeSelectVisible = true;
        let index = this.selectVertex.children.length - 1
        const itemVertex = graph.insertVertex(this.selectVertex, null, elements[0].child[0].name,
          0, 0.15 + 0.15 * index, 100, 20,
          'text;strokeColor=none;fontSize=12;fillColor=none;align=left;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;',
          true);
        itemVertex.setConnectable(false);
        itemVertex.levelType = 1
        itemVertex.data = elements[0].child[0]
        const addVertex = this.selectVertex.children[0];
        let geometry = addVertex.geometry;
        geometry.y += 0.15;
        setTimeout(()=>{
          addVertex.setGeometry(geometry)
        },1000)
      },

      handleSelectionChange(selectModel) {
        //处理选择更改

        this.selectVertex = {};
        this.selectEdge = {};
        if (!selectModel.cells.length) {
          return;
        }

        const cell = selectModel.cells[0];

        if (cell.vertex) {
          this.selectVertex = cell;
        } else {
          this.selectEdge = cell;
        }
        console.log(cell);
      },
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
            vm.$message.info(`节点被移动到 ${JSON.stringify(position)}`);
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
          }
        });

        graph.addListener(mxEvent.LABEL_CHANGED, (sender, evt) => {
          vm.$message.info(`内容改变为：${evt.getProperty('value')}`);
          let id_adm_ci_type = evt.properties.cell.data.element.id_adm_ci_type
          for (let i in vm.elements) {
            if (vm.elements[i].id_adm_ci_type === id_adm_ci_type) {
              // vm.elements[i].name = evt.getProperty('value')
              // that.selectData.data.name=evt.getProperty('value')
              that.$refs.MetamodelPanelRef.selectData.element.name = evt.getProperty('value')
              // that.MetamodelPanelRef
            }
          }
        });

        graph.addListener(mxEvent.CONNECT_CELL, (sender, evt) => {
          vm.$message.info(`改变了连线`);
        });
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
      position: fixed;
      right: 260px;
      bottom: 20px;
      border-radius: 2px;
      z-index: 10;

      > h4 {
        padding: 6px;
        font-size: 12px;
        border-bottom: 1px solid #e6e6e6;
      }

      #graphOutline {
        width: 200px;
      }
    }
  }
</style>

<style lang="less">
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
