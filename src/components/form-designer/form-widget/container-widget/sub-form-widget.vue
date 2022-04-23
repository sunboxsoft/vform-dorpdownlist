<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
                     :index-of-parent-list="indexOfParentList">

    <div :key="widget.id" class="sub-form-container"
         :class="{'selected': selected}" @click.stop="selectWidget(widget)">
      <el-form label-position="top">
        <draggable :list="widget.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
                   handle=".drag-handler"
                   @add="(evt) => onSubFormDragAdd(evt, widget.widgetList)"
                   @end="onSubFormDragEnd"
                   @update="onContainerDragUpdate" :move="checkContainerMove">
          <transition-group name="fade" tag="div" class="sub-form-table">
            <template v-for="(subWidget, swIdx) in widget.widgetList">
              <div class="sub-form-table-column" :key="subWidget.id + 'tc'" :style="{width: subWidget.options.columnWidth}">
                <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="designer" :key="subWidget.id"
                              :parent-list="widget.widgetList" :index-of-parent-list="swIdx" :parent-widget="widget"
                              :design-state="true" :sub-form-item-flag="true"></component>
              </div>
            </template>
          </transition-group>
        </draggable>
      </el-form>
    </div>

  </container-wrapper>
</template>

<script>
  import Draggable from 'vuedraggable'
  import i18n from "@/utils/i18n"
  import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin"
  import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "sub-form-widget",
    componentName: 'ContainerWidget',
    mixins: [i18n, containerMixin],
    components: {
      ContainerWrapper,
      Draggable,
      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,
    },
    computed: {
      selected() {
        return this.widget.id === this.designer.selectedId
      },

      customClass() {
        return this.widget.options.customClass || ''
      },

    },
    watch: {
      //
    },
    mounted() {
      //
    },
    methods: {

      onSubFormDragAdd(evt, subList) {
        const newIndex = evt.newIndex
        if (!!subList[newIndex]) {
          this.designer.setSelected( subList[newIndex] )
        }

        this.designer.emitHistoryChange()
        console.log('test', 'onSubFormDragAdd')
        this.designer.emitEvent('field-selected', this.widget)
      },

      onSubFormDragEnd(evt) {
        console.log('sub form drag end: ', evt)
      },

    }
  }
</script>

<style lang="scss" scoped>
  .sub-form-container {
    //width: 100%;
    padding: 8px;
    border: 1px dashed #336699;

    ::v-deep .sub-form-table {
      min-height: 68px;

      div.sub-form-table-column {
        display: inline-block;
        //width: 200px;
      }
    }

    ::v-deep .ghost{
      content: '';
      font-size: 0;
      //height: 3px;
      height: 74px;
      width: 1px;
      box-sizing: border-box;
      display: inline-block;
      background: $--color-primary;
      border: 2px solid $--color-primary;
      outline-width: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
  }

  .sub-form-container.selected {
    outline: 2px solid $--color-primary !important;
  }

</style>
