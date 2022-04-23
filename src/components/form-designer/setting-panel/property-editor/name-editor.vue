<template>
  <el-form-item prop="name" :rules="nameRequiredRule">
    <span slot="label">{{i18nt('designer.setting.uniqueName')}}
      <el-tooltip effect="light" :content="i18nt('designer.setting.editNameHelp')" v-if="selectedWidget.type !== 'sub-form'">
        <i class="el-icon-info"></i></el-tooltip>
    </span>
    <div v-if="selectedWidget.type === 'sub-form'">
      <el-input type="text" v-model="optionModel.name" readonly></el-input>
    </div>
    <div v-else>
      <template v-if="(!!selectedWidget.category && (selectedWidget.type !== 'sub-form')) || noFieldList">
        <el-input type="text" v-model="optionModel.name" :readonly="widgetNameReadonly" @change="updateWidgetNameAndRef"></el-input>
      </template>
      <template v-else>
        <el-select v-model="optionModel.name" allow-create filterable :disabled="widgetNameReadonly" @change="updateWidgetNameAndRef"
                   :title="i18nt('designer.setting.editNameHelp')" v-if="_isSubFormChildWidget">
          <el-option v-for="(sf, sfIdx) in _parentWidgetOptions" :key="sfIdx" :label="sf.label" :value="sf.name"></el-option>
        </el-select>
        <el-select v-model="optionModel.name" allow-create filterable :disabled="widgetNameReadonly" @change="updateWidgetNameAndRef"
                   :title="i18nt('designer.setting.editNameHelp')" v-else>
          <el-option v-for="(sf, sfIdx) in serverFieldList" :key="sfIdx" :label="sf.label" :value="sf.name"></el-option>
        </el-select>
      </template>
    </div>
  </el-form-item>
</template>

<script>
import i18n from "@/utils/i18n";
import { isEmptyStr } from "@/utils/util";

export default {
  name: "name-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  inject: [
    "serverFieldList",
    "getDesignerConfig",
    "isSubFormChildWidget",
    "parentWidget",
  ], //接收上面一个文件，也就是外层组件 provide的两个属性
  data() {
    return {
      nameRequiredRule: [{ required: true, message: "name required" }],
    };
  },
  computed: {
    noFieldList() { //注意 这里加入判断父组件的 subOptionList数组长度，只有sub-form才有
      // return !this.serverFieldList || this.serverFieldList.length <= 0;
      return (!this.serverFieldList || this.serverFieldList.length <= 0) && this.parentWidget()?.subOptionList.length<=0;
    },

    widgetNameReadonly() {
      return !!this.getDesignerConfig().widgetNameReadonly;
    },

    _isSubFormChildWidget() {
      return this.isSubFormChildWidget();
    },
    _parentWidgetOptions() {
      return this.parentWidget()?.subOptionList;
    },
  },
  methods: {
    updateWidgetNameAndRef(newName) {
      let oldName = this.designer.selectedWidgetName;
      if (isEmptyStr(newName)) {
        this.selectedWidget.options.name = oldName;
        this.$message.info(this.i18nt("designer.hint.nameRequired"));
        return;
      }

      if (!!this.designer.formWidget) {
        //检查newName是否已存在！！
        let foundRef = this.designer.formWidget.getWidgetRef(newName);
        if (!!foundRef) {
          this.selectedWidget.options.name = oldName;
          this.$message.info(
            this.i18nt("designer.hint.duplicateName") + newName
          );
          return;
        }

        let fieldWidget = this.designer.formWidget.getWidgetRef(oldName);
        if (!!fieldWidget && !!fieldWidget.registerToRefList) {
          fieldWidget.registerToRefList(oldName); //注册组件新的ref名称并删除老的ref！！
          let newLabel = this.getLabelByFieldName(newName);
          this.designer.updateSelectedWidgetNameAndRef(
            this.selectedWidget,
            newName,
            newLabel
          );
        }
      }
    },

    getLabelByFieldName(fieldName) {
      for (let i = 0; i < this.serverFieldList.length; i++) {
        if (this.serverFieldList[i].name === fieldName) {
          return this.serverFieldList[i].label;
        }
      }

      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
