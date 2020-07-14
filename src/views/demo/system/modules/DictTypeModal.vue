<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="字典名称"
      >
        <a-input placeholder="字典名称" v-decorator="['name', {rules: [{ required: true, message: '请输入字典名称' }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="字典类型"
      >
        <a-input v-decorator="['type',{rules: [{ required: true, message: '请输入字典类型' }]}]" placeholder="字典类型"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="是否是系统"
      >
        <a-select v-decorator="['isSys', {initialValue:'0',rules: [{ required: true, message: '请选择是否是系统' }]}]">
          <a-select-option :value="'0'">否</a-select-option>
          <a-select-option :value="'1'">是</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
      >
        <a-textarea :rows="5" placeholder="描述" v-decorator="['remarks']"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { saveDictType } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'DictTypeModal',
  props: {
  },
  components: {
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      roleAll: [],
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit()
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'type', 'remark'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveDictType(values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.success(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
