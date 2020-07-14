<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="1000"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item style="display:none">
            <a-input v-decorator="['id']"/>
          </a-form-item>
          <a-form-item
            :labelCol="
            labelCol"
            :wrapperCol="wrapperCol"
            label="公司代码"
          >
            <a-tree-select
              v-decorator="['parentId', {initialValue:'0',rules: [{ required: true, message: '请选择公司代码' }]}]"
              :dropdownStyle="{ overflow: 'auto' }"
              :treeData="depts"
              placeholder="公司代码"
              treeDefaultExpandAll
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="公司名称"
          >
            <a-input
              v-decorator="['name',{rules: [{ required: true, message: '请输入公司名称' }]}]"
              placeholder="公司名字"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="公司全称"
          >
            <a-input
              v-decorator="['fullName',{rules: [{ required: true, message: '请输入公司全称' }]}]"
              placeholder="公司全称"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="区域编码"
          >
            <a-input
              v-decorator="[]"
              placeholder="区域编码"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="公司logo"
          >
            <a-input
              v-decorator="['logo']"
              placeholder="公司logo"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="公司简介"
          >
            <a-input
              v-decorator="['intro']"
              placeholder="公司简介"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="负责人"
          >
            <a-input
              v-decorator="['leader']"
              placeholder="负责人"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="办公电话"
          >
            <a-input
              v-decorator="[
                'phone',
                {rules: [{pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message: '请输入正确的办公电话' }], validateTrigger: 'change'}
              ]"
              placeholder="办公电话"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="
            labelCol"
            :wrapperCol="wrapperCol"
            label="类型"
          >
            <a-select v-decorator="['type', {rules: [{ required: true, message: '请选择类型' }]}]">
              <a-select-option :value="'1'">公司</a-select-option>
              <a-select-option :value="'2'">部门</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="手机号码"
          >
            <a-input
              v-decorator="[
                'mobile',
                {rules: [{pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}
                ]"
              placeholder="手机号码"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="办公地点"
          >
            <a-input
              v-decorator="['address']"
              placeholder="办公地点"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="邮箱地址"
          >
            <a-input
              v-decorator="[
                'email',
                { rules: [{type: 'email', message: '请输入正确的邮箱地址' }], validateTrigger: ['change', 'blur']
                }
                ]"
              placeholder="邮箱地址"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
  import { getDeptList, saveDept } from '@/api/system'
  import pick from 'lodash.pick'

  export default {
    name: 'DeptModal',
    components: {},
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
        depts: [{ key: '0', value: '0', title: '无' }],
        mdl: {},
        confirmLoading: false,
        form: this.$form.createForm(this)
      }
    },
    beforeCreate () {
    },
    created () {
      getDeptList().then(res => {
        console.info(res)
        this.buildtree(res.data, this.depts, '0' )
      })
    },
    methods: {
      add (parentId) {
        this.form.resetFields()
        this.edit({parentId: parentId || '0'})
      },
      edit(record) {
        this.mdl = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.mdl.parentId += ''
          this.form.setFieldsValue(pick(this.mdl, 'id', 'parentId', 'name', 'fullName', 'area.id', 'logo', 'intro', 'leader', 'phone', 'type', 'mobile', 'address', 'email')) //  编辑内容回写
          // this.form.setFieldsValue({ ...record })
        })
      },
      buildtree(list, arr, parentId) {
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
      handleSubmit(e) {
        // alert(e.preventDefault())
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            this.$emit('ok')
            this.visible = false
            this.confirmLoading = true
            // alert(values)
            saveDept(values).then(res => {
              if (res.code === 0) {
                this.$message.success('保存成功')
                this.$emit('ok')
                this.visible = false
                getDeptList().then(res => {
                  console.info(res)
                  this.depts = []
                  this.buildtree(res.data, this.depts, '0')
                })
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
