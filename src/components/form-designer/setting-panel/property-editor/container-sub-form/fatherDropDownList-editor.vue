<template>
  <el-form-item prop="fatherTable" :label="'OnLine表单'">
    <el-select
      v-model="optionModel.fatherTable"
      @change="selectChanged"
      placeholder="请选择"
      :rules="[{ required: true, message: '请选择表单'}]"
    >
      <el-option
        v-for="(item, index) in optionsFather"
        :key="index"
        :label="item.label"
        :value="item.name"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from "@/utils/i18n";
import axios from "axios";
export default {
  name: "fatherDropDownList-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      optionsFather: [],
    };
  },
  mounted() {
    this.optionsFather=[{id: '1516684801705082881', tableName: 'table1', formDesc: '表1'},
    {id: '1516684801705082882', tableName: 'table2', formDesc: '表2'},
    {id: '1516684801705082883', tableName: 'table3', formDesc: '表3'}].map((item) => {
          return { name: item.tableName, label: item.formDesc };
        });
    // 初始化 保持记忆功能
    this.valueFather = this.selectedWidget.options.name;

    return
    this.$nextTick(() => {
      axios({
        method: "get",
        url: "http://10.2.156.41:8089/design/dict/selectSubForm",
        headers: {
          // 设置请求头
          Authorization:
            "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBRE1JTiIsImNsaWVudElkIjoiMTUxNjcxNzQ1MDYwNzgyMDgwMSIsImV4cCI6MTY1MTA1MzM5NCwiaWF0IjoxNjUwNDQ4NTk0LCJ1c2VybmFtZSI6IkFETUlOIn0.Vz239eGeAbFLDpWPwWwkbR5O_9EnhtiFg8cX7iyj9Yn8QzF4GpHnDvX8Kah6b7jir70DZ3nk4uSeGFirjKqLgg",
        },
      }).then((res) => {
        // 成功后的回调函数
        console.log(res, "%%%%%%%%%%%%%%%%%%%%%%%%");

        for (let i = 0; i < res.data.length; i++) {
          res.data[i] = {
            ...res.data[i],
            ...JSON.parse(res.data[i].fieldLabel),
          };
        }
        // {id: '1516684801705082882', tableName: 'aa', formDesc: 'aa'}
        // let arr = res.data.data;
        // this.optionsFather = arr.map((item) => {
        //   return { name: item.tableName, label: item.formDesc };
        // });
        console.log(res.data.data, "$$$$$$$$$$$$$$$$$$$$$$$$$$");
        let arr = res.data.data;
        this.optionsFather = arr.map((item) => {
          let fieldLabelObj = JSON.parse(item.fieldLabel);
          return {
            name: fieldLabelObj.tableName,
            label: `${fieldLabelObj.formDesc}(${fieldLabelObj.tableName})`,
            fieldName: item.fieldName,
          };
        });
        this.valueFather = this.selectedWidget.options.name;
        console.log(
          this.selectedWidget.options.name,
          this.optionsFather,
          "NNNNNNNNNNNNNNNNNN"
        );
      });
    });
  },
  methods: {
    selectChanged(value) {
      this.selectedWidget.options.name = value;
      // 模拟数据
      this.selectedWidget.subOptionList = [
        { label: "姓名" + value, name: "name" },
        { label: "年龄" + value, name: "age" },
      ];
      console.log(value, this.selectedWidget, "this.selectedWidget");

      return
      // 转换 为子表要根据搜索的id
      let objFind = this.optionsFather.find((item) => item.name == value);
      if (objFind) {
        let form_id = objFind.fieldName;
        console.log(form_id, "^^^^^^^^^^^^^^^");
        axios({
          method: "get",
          url: "http://10.2.156.41:8089/design/dict/selectFieldsByFormIdWith",
          params: { form_id: form_id },
          headers: {
            // 设置请求头
            Authorization:
              "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBRE1JTiIsImNsaWVudElkIjoiMTUxNjcxNzQ1MDYwNzgyMDgwMSIsImV4cCI6MTY1MTA1MzM5NCwiaWF0IjoxNjUwNDQ4NTk0LCJ1c2VybmFtZSI6IkFETUlOIn0.Vz239eGeAbFLDpWPwWwkbR5O_9EnhtiFg8cX7iyj9Yn8QzF4GpHnDvX8Kah6b7jir70DZ3nk4uSeGFirjKqLgg",
          },
        }).then((res) => {
          // 成功后的回调函数
          let arr = res.data.data;
          console.log(arr, "BBBBBBBBBBBBBBBBBBBB");
          // fieldLabel: "描述a"
          // fieldName: "a"
          // id: "1516684802330034178"
          // {fieldName: 'test_test.test', fieldLabel: 'test测试', id: '1517312014792052737'}
          let newArr = arr.map((item) => {
            return {
              name: item.fieldName,
              label: item.fieldLabel,
              id: item.id,
            };
          });
          console.log(newArr);
          this.selectedWidget.subOptionList = newArr;
        });
      }
    },
  },
};
</script>

<style scoped>
</style>
