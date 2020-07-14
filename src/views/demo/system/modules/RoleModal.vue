<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item style="display:none">
            <a-input v-decorator="['id']"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="角色名称"

          >
            <a-input
              v-decorator="['name',{rules: [{ required: true, message: '请输入角色名称' }]}]"
              placeholder="起一个名字"/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="排序"
          >
            <a-input-number
              v-decorator="['roleSort',{initialValue:'1',rules: [{ required: true, message: '请输入排序数字' }]}]"
              placeholder="排序"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="系统内置"
          >
            <a-select v-decorator="['isSys', {initialValue:'0',rules: [{ message: '请选择系统内置' }]}]">
              <a-select-option :value="'0'">否</a-select-option>
              <a-select-option :value="'1'">是</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态"
          >
            <a-select v-decorator="['status', {initialValue:'0',rules: [{ message: '请选择状态' }]}]">
              <a-select-option :value="'0'">正常</a-select-option>
              <a-select-option :value="'1'">禁用</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-divider/>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="拥有权限"
      >

        <!-- v-decorator="['parentId',{initialValue:'0'}]" -->
        <!-- <a-tree
          checkable
          autoExpandParent
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          v-model="checkedKeys"
          @select="onSelect"
          @check="onCheck"
          :selectedKeys="selectedKeys"
          :checkedKeys="checkedKeys"
          :treeData="permissions"
        > -->
        <a-tree
          checkable
          v-model="checkedKeys"
          @check="onCheck"
          :treeData="permissions"
        >
        </a-tree>
      </a-form-item>
    </a-form>

  </a-modal>
</template>

<script>
  import { getPermissions, getRolePermIds } from '@/api/system'
  import pick from 'lodash.pick'

  export default {
    name: 'RoleModal',
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        visible: false,
        confirmLoading: false,
        mdl: {},

        form: this.$form.createForm(this),
        permissions: [],
        treeCheck: false,
        pidSet: [],
        checkedKeys: [],
        halfCheckedKeys: []
      }
    },
    created() {
      this.loadPermissions()
    },
    methods: {
      add() {
        this.form.resetFields()
        this.checkedKeys = []
        this.pidSet = []
        this.edit({})
      },
      edit(record) {
        if (record.id) {
          getRolePermIds(record.id).then(res => {
             console.info(res)
            const pidSet = new Set(res.data.map(m => m.parentId).filter(id => id>'0'))
             this.pidSet = pidSet
            // 因为antd 树插件勾选父节点会导致所有子节点选中,所以过滤所有父节点
            this.checkedKeys = res.data.map(m => m.id).filter(id => !pidSet.has(id))
            console.info( this.checkedKeys)
          })
        }
        this.mdl = Object.assign({}, record)
        // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
        this.treeCheck = false
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'roleSort', 'isSys', 'status'))
          this.form.setFieldsValue(...record)
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys)
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onCheck(checkedKeys, info) {
        if (!this.treeCheck) this.treeCheck = true
        console.log('onCheck', info)
        this.checkedKeys = checkedKeys
        this.halfCheckedKeys = info.halfCheckedKeys
      },
      onSelect(selectedKeys, info) {
        console.log('onSelect', info)
        this.selectedKeys = selectedKeys
      },
      loadPermissions() {
        getPermissions().then(res => {
          this.buildtree(res.data, this.permissions, '0')
        })
      },
      buildtree(list, permissions, parentId) {
        list.forEach(item => {
          if (item.parentId === parentId) {
            var child = {
              key: item.id,
              title: item.name,
              children: []
            }
            this.buildtree(list, child.children, item.id)
            permissions.push(child)
          }
        })
      },
      handleOk(e) {
        const _this = this
        // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
        const checkedAll = this.treeCheck ? _this.checkedKeys.concat(_this.halfCheckedKeys) : _this.checkedKeys.concat(Array.from(_this.pidSet))
        if (!checkedAll.length > 0) {
          _this.$message.warning('请至少选择一个权限')
          return
        }
        // 触发表单验证
        this.form.validateFields((err, values) => {
          // 验证表单没错误
          if (!err) {
            values.menuIds = checkedAll
            _this.confirmLoading = true
            // saveRole(Object.assign(values)).then(res => {
            //   if (res.code === 0) {
            //     _this.$message.success('保存成功')
            //     _this.$emit('ok')
            //     _this.visible = false
            //   } else {
            //     _this.$message.success(res.msg)
            //   }
            // }).catch(() => {
            //   _this.$message.error('系统错误，请稍后再试')
            // }).finally(() => {
            //   _this.confirmLoading = false
            // })
          }
        })
      },
      handleCancel() {
        this.visible = false
      }

    }
  }
</script>

<style scoped>

</style>
