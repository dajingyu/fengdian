<template>
  <a-modal
    title="操作"
    style="top:20px"
    :width="1000"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form
      :form="form"
      class="form-row-owner"
    >
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="登录账号"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['loginName', {rules: [{ required: true, message: '请输入登录账号' }]}]" placeholder="登录账号"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户姓名"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['userName',{rules: [{ required: true, message: '请输入用户姓名' }]}]" placeholder="请输入用户姓名"/>
      </a-form-item>
<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        label="登录密码"-->
<!--        v-if="['id'] == null"-->
<!--        style="float:left;width:45%"-->
<!--      >-->
<!--        <a-input-->
<!--          type="password"-->
<!--          v-decorator="[-->
<!--            'password',-->
<!--            {-->
<!--              rules: [{ required: true,min:6,max:16,message: '请输入6到16位登录密码' }]-->
<!--            }-->
<!--          ]"-->
<!--          placeholder="请输入登录密码"/>-->
<!--      </a-form-item>-->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="电子邮箱"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['email',{rules: [{type: 'email', message: '请输入正确的邮箱地址' }], validateTrigger: ['change', 'blur']}]" placeholder="请输入电子邮箱"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="手机号码"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['mobile',{rules: [{pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]" placeholder="请输入手机号码"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="办公电话"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['phone',{rules: [{pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message: '请输入正确的办公电话' }], validateTrigger: 'change'}]" placeholder="请输入办公电话"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户性别"
        style="float:left;width:45%"
      >
        <a-select v-decorator="['sex', {initialValue:0,rules: [{ required: true, message: '请选择性别' }]}]">
          <a-select-option :value="0">男</a-select-option>
          <a-select-option :value="1">女</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="头像路径"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['avatar',{rules: [{message: '请输入头像路径' }]}]" placeholder="请输入头像路径"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="个性签名"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['sign',{rules: [{message: '请输入个性签名' }]}]" placeholder="请输入个性签名"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户类型"
        style="float:left;width:45%"
      >
        <a-select v-decorator="['userType', {initialValue:0,rules: [{ required: true, message: '请选择用户类型' }]}]">
          <a-select-option :value="0">用户类型111</a-select-option>
          <a-select-option :value="1">用户类型222</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="管理员类型"
        style="float:left;width:45%"
      >
        <a-select v-decorator="['mgrType', {initialValue:'0',rules: [{ required: true, message: '请选择管理员类型' }]}]">
          <a-select-option :value="0">非管理员</a-select-option>
          <a-select-option :value="1">系统管理员</a-select-option>
          <a-select-option :value="2">二级管理员</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="员工英文名"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['nameEn',{rules: [{ message: '请输入员工英文名' }]}]" placeholder="请输入员工英文名"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="员工工号"
        style="float:left;width:45%"
      >
        <a-input v-decorator="['jobNo',{rules: [{ message: '请输入员工工号' }]}]" placeholder="请输入员工工号"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="组织名称"
        style="float:left;width:45%"
      >
        <a-tree-select
          v-decorator="['companyId', {rules: [{  required: true, message: '请选择组织名称' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="deptTree"
          @change="onChange"
          placeholder="组织名称"
          treeDefaultExpandAll>
        </a-tree-select>
      </a-form-item>

<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        label="描述"-->
<!--      >-->
<!--        <a-textarea :rows="5" placeholder="..." v-decorator="['remark', {rules: [{ required: true, message: '请输入描述' }]}]"/>-->
<!--      </a-form-item>-->

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="拥有角色"
        style="float:left;width:45%"
        hasFeedback
      >
        <a-select
          style="width: 100%"
          mode="multiple"
          v-decorator="['roleIds', {rules: [{ required: true, message: '请选择角色' }]}]"
          :allowClear="true"
        >
          <a-select-option v-for="(action) in checkedKeys" :key="action.id" >{{ action.name }}</a-select-option>
        </a-select>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { saveUser, getRoleList } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'UserModal',
  props: {
    deptTree: {
      type: Array,
      required: true
    }
  },
  components: {
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      roleAll: [],
      mdl: {},
      deptCheck: true,
      checkedKeys: [],
      roleIds: [],
      sex: '',
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
      this.edit({ id: '' })
    },
    edit (record) {
      getRoleList().then(res => { this.checkedKeys = res.data || [] })
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.mdl.companyId = record.companyId

      //循环出对象数组中角色id组成数组
      var roles = record.roles
      var roleIdList = []
      roles && roles.forEach(item => {
        roleIdList.push(item.id)
      })
      this.mdl.roleIds = roleIdList

      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'loginName', 'userName', 'email', 'mobile', 'phone', 'sex', 'avatar', 'sign', 'userType', 'mgrType', 'nameEn', 'jobNo', 'companyId', 'roleIds'))
      })
    },
    onChange (value, label, extra) {
      // if (extra.triggerNode.$children.length > 0) {
      //   this.$message.error('不能选择父节点' + `${label}`)
      //   this.deptCheck = false
      // } else {
        this.deptCheck = true
      // }
    },
    handleSubmit (e) {
      e.preventDefault()
      if (!this.deptCheck) {
        this.$message.error('不能选择父节点')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveUser(values).then(res => {
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
<style lang="less">
  .form-row-owner {
    zoom: 1;
    &::before,
    &::after {
      content: ' ';
      display: table;
    }
    &::after {
      clear: both;
      height: 0;
      font-size: 0;
      visibility: hidden;
    }
  }
</style>
