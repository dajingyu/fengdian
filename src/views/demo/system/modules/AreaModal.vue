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
        :labelCol="
          labelCol"
        :wrapperCol="wrapperCol"
        label="上级"
      >
        <a-tree-select
          v-decorator="['parentId', {initialValue:'0',rules: [{ required: true, message: '请选择上级' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="areas"
          placeholder="上级"
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="区域名称"
      >
        <a-input
          v-decorator="['name',{rules: [{ required: true, message: '请输入名称' }]}]"
          placeholder="区域名称"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="区域编码"
      >
      <a-input
          v-decorator="['code',{rules: [{ required: true, message: '请输入城市编码' }]}]"
          placeholder="区域编码"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="类型"
      >
      <a-select v-decorator="['type', {rules: [{ required: true, message: '请选择状态' }]}]" placeholder="选择区域类型">
          <a-select-option :value="'0'">洲</a-select-option>
          <a-select-option :value="'1'">国家</a-select-option>
          <a-select-option :value="'2'">区域</a-select-option>
          <a-select-option :value="'3'">省</a-select-option>
          <a-select-option :value="'4'">市</a-select-option>
          <a-select-option :value="'5'">区县</a-select-option>
      </a-select>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="本级顺序"
      >
      <a-input
          v-decorator="['sort',{rules: [{ required: false, message: '请输入显示顺序' }]}]"
          placeholder="本级顺序"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="全部顺序"
      >
      <a-input
          v-decorator="['sorts',{rules: [{ required: false, message: '请输入显示顺序' }]}]"
          placeholder="全部顺序"/>
      </a-form-item>
      <!-- <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
      >
      <a-select v-decorator="['status', {rules: [{ required: true, message: '请选择状态' }]}]">
          <a-select-option :value="'0'">正常</a-select-option>
          <a-select-option :value="'1'">停用</a-select-option>
        </a-select>
      </a-form-item> -->

    </a-form>
  </a-modal>
</template>
<script>
import { getAreaList, saveArea } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'AreaModal',
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
      areas: [{ key: '0', value: '0', title: '无' }],
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    getAreaList().then(res => {
      this.buildtree(res.data, this.areas, '0')
    })
  },
  methods: {
    add (parentId) {
      this.form.resetFields()
      this.edit({ parentId: parentId || '0' })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.mdl.parentId += ''
        this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'parentId', 'sort', 'sorts', 'type', 'code'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    tree () {
      return this.areas
    },
    buildtree (list, arr, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.id,
            value: item.id + '',
            title: item.name,
            children: []
          }
          this.buildtree(list, child.children, item.id)
          arr.push(child)
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.$emit('ok')
          this.visible = false
          this.confirmLoading = true
          saveArea(values).then(res => {
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
