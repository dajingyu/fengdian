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
      <a-form-item style="display:none">
        <a-input v-decorator="['dictType.id']"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="标签"
      >
        <a-input placeholder="标签" v-decorator="['label', {rules: [{ required: true, message: '请输入字典标签' }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="键值"
      >
        <a-input v-decorator="['value',{rules: [{ required: true, message: '请输入键值' }]}]" placeholder="字典键值"/>
      </a-form-item>
       <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
      >
        <a-input v-decorator="['description',{rules: [{ required: false, message: '请输入排序,不填写自动递增' }]}]" placeholder="字典排序"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序"
      >
        <a-input v-decorator="['sort',{rules: [{ required: false, message: '请输入排序,不填写自动递增' }]}]" placeholder="字典排序"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { saveDictData } from '@/api/system'
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
    add (dictTypeId) {
      debugger
      this.form.resetFields()
      this.edit({ 'dictType.id': dictTypeId })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      debugger
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'dictType.id', 'label', 'value', 'sort', 'description'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          debugger
          this.confirmLoading = true
          saveDictData(values).then(res => {
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
