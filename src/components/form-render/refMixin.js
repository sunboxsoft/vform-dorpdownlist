export default {
  methods: {
    initRefList() {
      if ((this.refList !== null) && !!this.widget.options.name) {
        this.refList[this.widget.options.name] = this
      }
    },

    getWidgetRef(widgetName, showError) {
      let foundRef = this.refList[widgetName]
      if (!foundRef && !!showError) {
        this.$message.error(this.i18nt('render.hint.refNotFound') + widgetName)
      }
      return foundRef
    },

    getFormRef() { /* 获取VFrom引用，必须在VForm组件created之后方可调用 */
      return this.refList['v_form_ref']
    },

  }
}
