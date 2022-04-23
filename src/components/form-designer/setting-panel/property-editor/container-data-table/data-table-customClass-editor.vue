<template>
  <div>
<!--		<el-form :model="optionModel" size="mini" label-position="left" label-width="120px"-->
<!--				 class="setting-form" @submit.native.prevent>-->
			<el-form-item :label="i18nt('designer.setting.tableWidth')">
				<el-input v-model="optionModel.tableWidth"></el-input>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.tableHeight')">
				<el-input v-model="optionModel.tableHeight"></el-input>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.customClass')">
				<el-select v-model="optionModel.customClass" multiple filterable allow-create
									 default-first-option>
					<el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.showIndex')">
				<el-switch v-model="optionModel.showIndex"></el-switch>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.showCheckBox')">
				<el-switch v-model="optionModel.showCheckBox"></el-switch>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.showPagination')">
				<el-switch v-model="optionModel.showPagination"></el-switch>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.smallPagination')">
				<el-switch v-model="optionModel.smallPagination"></el-switch>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.showSummary')">
				<el-switch v-model="optionModel.showSummary"></el-switch>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.stripe')">
				<el-switch v-model="optionModel.stripe"></el-switch>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.rowSpacing')">
				<el-input-number v-model="optionModel.rowSpacing" controls-position="right" :min="0" :max="20" style="width: 100%">
				</el-input-number>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.widgetSize')">
				<el-select v-model="optionModel.tableSize">
					<el-option v-for="item in widgetSizes" :key="item.value" :label="item.label"
										 :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.tableDataEdit')">
				<el-button type="text" @click="openTableDataEdit">{{i18nt('designer.setting.editAction')}}</el-button>
			</el-form-item>
			<el-form-item :label="i18nt('designer.setting.tableColEdit')">
				<el-button type="text" @click="openSetting">{{i18nt('designer.setting.editAction')}}</el-button>
			</el-form-item>
<!--		</el-form>-->

		<el-dialog :title="i18nt('designer.setting.tableDataEdit')" :visible.sync="dataDialogVisible"
							 v-if="dataDialogVisible" :show-close="true" class="small-padding-dialog"
							 v-dialog-drag :close-on-click-modal="false" :close-on-press-escape="false"
							 :destroy-on-close="true" width="75%">
			<code-editor :mode="'json'" :readonly="false" v-model="tableDataOptions"></code-editor>
			<div slot="footer" class="dialog-footer">
				<el-button size="large" type="primary" @click="saveTableData">{{i18nt('designer.hint.confirm')}}</el-button>
				<el-button size="large" type="" @click="dataDialogVisible = false">{{i18nt('designer.hint.cancel')}}</el-button>
			</div>
		</el-dialog>

		<el-dialog :title="i18nt('designer.setting.tableColEdit')" :visible.sync="dialogVisible"
			v-if="dialogVisible" :show-close="true" class="small-padding-dialog"
			v-dialog-drag :close-on-click-modal="false" :close-on-press-escape="false"
			:destroy-on-close="true" width="1120px">
			<el-table :data="optionModel.tableColumns" style="width: 100%" :cell-style="{padding:'1px 0'}"
				  height="500" border row-key="columnId" ref="singleTable" stripe>
					<el-table-column type="index" width="35" fixed="left"></el-table-column>
					<el-table-column label="" width="30">
					  <i class="iconfont icon-drag drag-option"></i>
					</el-table-column>
				  <el-table-column label="columnId" prop="columnId" width="150" v-if="false"></el-table-column>
					<el-table-column :label="i18nt('designer.setting.columnName')" width="150" prop="prop">
					  <template slot-scope="scope">
							<el-input v-model="scope.row.prop"></el-input>
					  </template>
					</el-table-column>
					<el-table-column :label="i18nt('designer.setting.columnLabel')" width="150" prop="label">
					  <template slot-scope="scope">
							<el-input v-model="scope.row.label"></el-input>
					  </template>
					</el-table-column>
					<el-table-column :label="i18nt('designer.setting.columnWidth')" width="100" prop="width">
					  <template slot-scope="scope">
							<el-input v-model="scope.row.width"></el-input>
					  </template>
					</el-table-column>
					<el-table-column :label="i18nt('designer.setting.visibleColumn')" width="70" prop="show">
					  <template slot-scope="scope">
							<el-switch v-model="scope.row.show"></el-switch>
					  </template>
					</el-table-column>
					<el-table-column :label="i18nt('designer.setting.sortableColumn')" width="70" prop="sortable">
					  <template slot-scope="scope">
							<el-switch v-model="scope.row.sortable"></el-switch>
					  </template>
					</el-table-column>
					<el-table-column :label="i18nt('designer.setting.fixedColumn')" width="70" prop="fixed">
					  <template slot-scope="scope">
							<el-switch v-model="scope.row.fixed"></el-switch>
					  </template>
					</el-table-column>
					<el-table-column :label="i18nt('designer.setting.alignTypeOfColumn')" width="100" prop="align">
					  <template slot-scope="scope">
							<el-select v-model="scope.row.align">
							    <el-option v-for="item in alignOptions" :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
					  </template>
					</el-table-column>
					<!-- <el-table-column label="字段类型" width="100">
					  <template slot-scope="scope">
							<el-select v-model="scope.row.fieldType" placeholder="请选择">
							    <el-option v-for="item in fieldTypeOptions" :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
					  </template>
					</el-table-column> -->
					<el-table-column :label="i18nt('designer.setting.formatOfColumn')" width="200" prop="formatS">
					  <template slot-scope="scope">
							<el-select v-model="scope.row.formatS" clearable>
								<el-option-group
										v-for="group in op"
										:key="group.label"
										:label="group.label">
										<el-option
										v-for="item in group.options"
										:key="item.value"
										:label="item.label"
										:value="item.value">
										</el-option>
								</el-option-group>
							</el-select>
						</template>
					</el-table-column>
			    <el-table-column :label="i18nt('designer.setting.actionColumn')" width="100" fixed="right" align="center">
			      <template slot-scope="scope">
							<el-button :title="i18nt('designer.setting.addTableColumn')" size="mini" type="" circle
										@click="addCol" icon="el-icon-plus"></el-button>
			        <el-button :title="i18nt('designer.setting.deleteTableColumn')" size="mini" type="" circle
								@click="handleDelete(scope.$index, scope.row)" icon="el-icon-minus"></el-button>
			      </template>
			    </el-table-column>
			  </el-table>
				<div slot="footer" class="dialog-footer">
					<el-button size="large" type="primary" @click="colSubmit">{{i18nt('designer.hint.confirm')}}</el-button>
				  <el-button size="large" @click="dialogVisible = false">{{i18nt('designer.hint.cancel')}}</el-button>
				</div>
		</el-dialog>
  </div>


</template>

<script>
  import i18n from "@/utils/i18n"
  import Draggable from 'vuedraggable'
  import {deepClone} from "@/utils/util"
	import Sortable from "sortablejs"
	import CodeEditor from '@/components/code-editor/index'
  export default {
    name: "data-table-customClass-editor",
    componentName: 'PropertyEditor',
    mixins: [i18n],
    components: {
      Draggable,
			CodeEditor,
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
				dialogVisible: false,
				dataDialogVisible: false,
        cssClassList: [],
				tableDataOptions:[],
				widgetSizes: [
				  {label: 'default', value: ''},
				  {label: 'large', value: 'large'},
				  {label: 'medium', value: 'medium'},
				  {label: 'small', value: 'small'},
				  {label: 'mini', value: 'mini'},
				],
				alignOptions: [
					{
						value: 'left',
						label: 'left'
					}, {
						value: 'center',
						label: 'center'
					}, {
						value: 'right',
						label: 'right'
					},
				],
				fieldTypeOptions:[
					{
						value: 'text',
						label: 'Text'
					}, {
						value: 'number',
						label: 'Number'
					}, {
						value: 'date',
						label: 'Date'
					},
				],
				op:[{
						label: 'Date Format',
						options: [
							{value:'d1',label:"yyyy-MM-dd"},
							{value:'d2',label:"yyyy/MM/dd"},
							{value:'d3',label:"yyyy年MM月dd日"},
							{value:'d4',label:"yyyy-MM-dd HH:mm:ss"},
							{value:'d5',label:"yyyy-MM-dd hh:mm:ss"},
						]
					}, {
          label: 'Number Format',
          options: [
						{value:'n1',label:"###,###,###,##0.######"},
						{value:'n2',label:"###,###,###,##0.00####"},
						{value:'n3',label:"###,###,###,##0.000000"},
						{value:'n4',label:"###,###,###,##0.000"},
						{value:'n5',label:"###,###,###,##0.00"},
						{value:'n6',label:"###,###,###,##0"},
						{value:'n7',label:"###,##0.00##%"},

					]
        }],
      }
    },
		mounted(){
			// this.dragSort()
		},
    created() {
      this.cssClassList = deepClone(this.designer.getCssClassList())
      //监听表单css代码改动事件并重新加载！
      this.designer.handleEvent('form-css-updated', (cssClassList) => {
        this.cssClassList = cssClassList
      })
    },
    methods: {
			//表格拖动排序
			dragSort() {
				const el = this.$refs.singleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
				let tableData = this.optionModel.tableColumns;
				this.sortable = Sortable.create(el, {
					ghostClass: 'sortable-ghost',
					setData: function (dataTransfer) {
						dataTransfer.setData('Text', '')
					},
					onEnd: e => {
					  //e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
						const targetRow = tableData.splice(e.oldIndex, 1)[0];
						tableData.splice(e.newIndex, 0, targetRow);
						let dragId = tableData[e.newIndex].id;//拖动行的id
						let oneId,twoId
						//拖动行的前一行
						if( tableData[e.newIndex-1]){
						 oneId = tableData[e.newIndex-1].id;}
						else {
						 oneId = ""
						}
						//拖动行的后一行
						if( tableData[e.newIndex+1]){
						 twoId = tableData[e.newIndex+1].id;}
						else {
						 twoId = ""
						}
					}
				})

			},

			openTableDataEdit(){
				this.dataDialogVisible=true;
				this.tableDataOptions = JSON.stringify(this.optionModel.tableData, null, '  ')
			},

			saveTableData(){
				try {
					  this.optionModel.tableData = JSON.parse(this.tableDataOptions)
					  this.dataDialogVisible = false
					} catch (ex) {
					  this.$message.error(this.i18nt('designer.hint.invalidOptionsData') + ex.message)
					}
			},

			openSetting(){
				this.dialogVisible = true;
				this.$nextTick(()=>{
					this.dragSort()
				})
			},

			// 确认表格列更改
			colSubmit(){
				this.dialogVisible = false;
			},

			addCol(){
				let newRow = {columnId: new Date().getTime()};
				this.optionModel.tableColumns.push(newRow);
				this.designer.emitHistoryChange()
			},

			handleDelete(index,row){
				if(this.optionModel.tableColumns.length === 1){
					this.$message.warning(this.i18nt('designer.setting.OnlyOneColumnCannotBeDeleted'))
					 return false;
				}
				this.optionModel.tableColumns.splice(index,1)
			},

    }
  }
</script>

<style lang="scss" scoped>
  li.col-item {
    list-style: none;

    span.col-span-title {
      display: inline-block;
      font-size: 13px;
      width: 120px;
    }

    .col-delete-button {
      margin-left: 6px;
    }
  }

  .panes-setting {
    ul {
      padding-inline-start: 0;
      padding-left: 0; /* 重置IE11默认样式 */
      margin: 0;
    }

    .drag-option {
      cursor: move;
    }

    li.ghost {
      background: #fff;
      border: 2px dotted $--color-primary;
    }
  }

	.small-padding-dialog {
	  ::v-deep .el-dialog__body {
	    padding: 6px 15px 12px 15px;
	  }
	}

</style>
