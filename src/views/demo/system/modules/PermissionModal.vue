<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="600"
    v-model="visible"
    @ok="handleSubmit"
  >

    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="上级菜单"
      >
        <a-tree-select
          v-decorator="['parentId', {rules: [{ required: true, message: '请选择上级菜单' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="permissions"
          placeholder="上级菜单"
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="类型"
      >
        <a-select v-decorator="['type', {initialValue:'M',rules: [{ required: true, message: '请选择类型' }]}]" @select="menuTypeChange">
          <a-select-option :value="'M'">目录</a-select-option>
          <a-select-option :value="'C'">菜单</a-select-option>
          <a-select-option :value="'F'">按钮</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="type=='M'"
        label="模块名"
      >
        <a-tree-select
          v-decorator="['moduleId', {rules: [{ required: true, message: '请选择' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="moduleLists"
          placeholder="请选择"
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="菜单名称"
      >
        <a-input
          v-decorator="['name',{rules: [{ required: true, message: '请输入菜单名称' }]}]"
          placeholder="起一个名字"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
      >
        <a-input
          v-decorator="['title',{rules: [{ message: '请输入描述' }]}]"
          placeholder="描述"/>
      </a-form-item>

<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        label="路由唯一键"-->
<!--      >-->
<!--        <a-input-->
<!--          v-decorator="['menuKey',{initialValue:'',rules: [{ required: true, message: '请输入动态菜单唯一键' }]}]"-->
<!--          placeholder="路由唯一键：如'user'"/>-->
<!--      </a-form-item>-->

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="type=='F'"
        label="权限标识"
      >
        <a-input
          v-decorator="['permission',{rules: [{ required: false, message: '请输入权限标识' }]}]"
          placeholder="权限标识"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="type!=='F'"
        label="图标"
      >
        <a-input v-decorator="['icon',{rules: [{ required: false, message: '请选择图标' }]}]" ref="iconInput" @click="iconselect()" enterButton="选择图标" placeholder="选择图标">
          <a-icon slot="prefix" :type="icon" />
          <a-icon slot="suffix" type="close-circle" @click="emitEmpty"/>
        </a-input>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="type==='C'"
        label="打开方式"
      >
        <a-select v-decorator="['target', {initialValue:'',rules: [{ required: false, message: '请选择打开方式' },{validator: validatePathTarget}]}]">
          <a-select-option :value="''">当前窗口</a-select-option>
          <a-select-option :value="'_blank'">新窗口</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="type==='C'"
      >
        <span slot="label">链接地址
          <a-tooltip title="链接地址为外链时，打开方式必须为新窗口（antd限制）">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          v-decorator="['href',{
            rules: [
              { required: false,type:'string', message: '请输入正确的路径' }
            ]
          }]"
          placeholder="路径"
        />
      </a-form-item>

<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        v-if="type!=='F'"-->
<!--        label="重定向地址"-->
<!--      >-->
<!--        <a-input-->
<!--          v-decorator="['redirect',{rules: [{ required: false, message: '请输入重定向地址' }]}]"-->
<!--          placeholder="重定向地址"/>-->
<!--      </a-form-item>-->

<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        v-if="type!=='F'"-->
<!--        label="隐藏子菜单"-->
<!--      >-->
<!--        <a-switch v-decorator="['hiddenChildren',{initialValue:false}]" />-->
<!--      </a-form-item>-->

<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        v-if="type!=='F'"-->
<!--      >-->
<!--        <span slot="label">隐藏头部信息-->
<!--          <a-tooltip title="隐藏 PageHeader 组件中的页面带的 面包屑和页面标题栏">-->
<!--            <a-icon type="question-circle-o" />-->
<!--          </a-tooltip>-->
<!--        </span>-->
<!--        <a-switch v-decorator="['hiddenHeader',{initialValue:false}]" />-->
<!--      </a-form-item>-->

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序"
      >
        <a-input-number
          v-decorator="['sort',{initialValue:'1',rules: [{ required: true, message: '请输入排序数字' }]}]"
          placeholder="排序"/>
      </a-form-item>

<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        label="状态"-->
<!--      >-->
<!--        <a-select v-decorator="['isShow', {initialValue:'1',rules: [{ required: true, message: '请选择状态' }]}]">-->
<!--          <a-select-option :value="'1'">显示</a-select-option>-->
<!--          <a-select-option :value="'0'">隐藏</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->

    </a-form>
    <iconSelector-modal ref="modal" @ok="setIcon" :icon="icon"/>
  </a-modal>
</template>
<script>
import { getPermissions, savePerm } from '@/api/system'
import pick from 'lodash.pick'
import IconSelectorModal from './IconSelectorModal.vue'
export default {
  name: 'UserModal',
  components: {
    IconSelectorModal
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
      permissions: [{ key: 0, value: '0', title: '无' }],
      moduleLists: [],
      mdl: {},
      icon: 'smile',
      type: '',
      moduleId: '',
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    this.loadPermissions()
  },
  methods: {
    menuTypeChange (type) {
      this.type = type
    },
    // moduleIdChange (moduleId) {
    //   this.moduleId = moduleId
    // },
    emitEmpty () {
      this.$refs.iconInput.focus()
      this.form.setFieldsValue({ 'icon': '' })
    },
    iconselect () {
      this.$refs.modal.show()
    },
    setIcon (icon) {
      this.icon = icon
      this.form.setFieldsValue({ 'icon': icon })
    },
    add (parentId, moduleLists) {
      this.moduleLists = moduleLists
      this.form.resetFields()
      this.edit({parentId: parentId || '0'}, moduleLists )
    },
    edit (record, moduleLists) {
      this.moduleLists = []
      moduleLists && moduleLists.forEach(item => {
        var child = {
          key: item.key,
          value: item.value,
          title: item.title,
          children: []
        }
        // this.buildtree(list, child.children, item.id)
        this.moduleLists.push(child)
      })
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.type = this.mdl.type || 'M'
      this.$nextTick(() => {
        this.mdl.icon ? this.icon = this.mdl.icon : this.icon = 'smile'
        this.mdl.parentId += ''
        this.form.setFieldsValue(pick(this.mdl, 'icon', 'id', 'parentId', 'moduleId', 'type', 'permission', 'target', 'name', 'title', 'href', 'sort'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    validatePathTarget (rule, value, callback) {
      const path = this.form.getFieldValue('path')
      if (path && path.startsWith('http') && value !== '_blank') {
        callback(new Error('链接地址为外链时，打开方式必须为新窗口（antd限制）'))
      } else {
        callback()
      }
    },
    loadPermissions () {
      getPermissions().then(res => {
        this.buildtree(res.data, this.permissions, '0')
      })
    },
    buildtree (list, arr, parentId) {
      list && list.forEach(item => {
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
          this.confirmLoading = true
          savePerm(values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$emit('ok')
              this.visible = false
              this.loadPermissions()
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
