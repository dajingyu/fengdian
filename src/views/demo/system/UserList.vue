<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="4">
        <a-input style="width:85%;margin-bottom:8px" placeholder="搜索组织名称" v-model="searchValue" @change="handleChange" ref="searchInput" >
          <a-icon slot="prefix" type="search" />
          <a-icon v-if="searchValue" slot="suffix" type="close-circle" @click="emitEmpty" />
        </a-input>
        <a-tree
          v-if="deptTree.length>0"
          :treeData="deptTree"
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          @select="handleSelect">
          <template slot="title" slot-scope="{title}">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: red">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </a-col>
      <a-col :span="20">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="30">
              <a-col :md="5" d:sm="15">
                <a-form-item label="账号">
                  <a-input placeholder="请输入" v-model="queryParam.loginName"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" d:sm="15">
                <a-form-item label="姓名">
                  <a-input placeholder="请输入" v-model="queryParam.userName"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" d:sm="15">
                <a-form-item label="性别">
                  <a-select placeholder="请选择" v-model="queryParam.sex">
                    <a-select-option :value="'0'">男</a-select-option>
                    <a-select-option :value="'1'">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="5" d:sm="15">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => handleReset()">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table-operator">
          <!-- <a-button type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0"> -->
          <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
          <a-dropdown v-if="removeEnable&& selectedRowKeys.length > 0">
            <!-- <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2"><a-icon type="lock" />禁用</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button> -->
            <a-popconfirm v-if="removeEnable" title="是否删除选中用户？" @confirm="delByIds(selectedRowKeys)">
              <a-button type="danger" icon="delete">删除</a-button>
            </a-popconfirm>

          </a-dropdown>
        </div>
        <s-table
          size="default"
          ref="table"
          rowKey="id"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :columns="columns"
          :data="loadData"
        >

        <span slot="sex" slot-scope="text">
          {{ text | sexFilter }}
        </span>

        <span slot="roles" slot-scope="text">
          {{ text | rolesFilter }}
        </span>
          <span slot="status" slot-scope="text,record">
            <a-switch :checked="record.status=='0'" @change="onChangeStatus(record)"/>
          </span>
          <span slot="action" slot-scope="text, record">
            <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm v-if="removeEnable" title="是否要删除此行？" @confirm="delByIds([record.id])">
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />

            <a-popconfirm v-if="resetPwdEnabel" title="是否要重置密码？" @confirm="resetPwdSubmit(record)">
              <a>重置密码</a>
            </a-popconfirm>

          </span>
        </s-table>
      </a-col>
    </a-row>
    <user-modal ref="modal" @ok="handleOk" :deptTree="deptTree"/>
    <user-pwd-modal ref="pwdmodal"/>
  </a-card>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { STable, STree } from '@/components'
import { getUserList, getDeptListEnable, delUser, changUserStatus, resetPwd } from '@/api/system'
import UserModal from './modules/UserModal'
import UserPwdModal from './modules/UserPwdModal'
import pick from 'lodash.pick'
import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    Tree,
    STree,
    STable,
    UserModal,
    UserPwdModal
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
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName'
        },
        {
          title: '账号',
          dataIndex: 'loginName'
        },
        {
          title: '角色',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' }
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '手机',
          dataIndex: 'mobile'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        // {
        //   title: '状态',
        //   dataIndex: 'status',
        //   scopedSlots: { customRender: 'status' }
        // },
        // {
        //   title: '创建时间',
        //   dataIndex: 'createTime',
        //   sorter: true
        // },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log('getUserList', res)
            return res
          })
      },
      searchValue: '',
      deptTree: [],
      expandedKeys: [],
      dataList: [],
      autoExpandParent: true,
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('system:user:add'),
      editEnabel: checkPermission('system:user:edit'),
      resetPwdEnabel: checkPermission('system:user:resetPwd'),
      removeEnable: checkPermission('system:user:remove')
    }
  },
  filters: {
    sexFilter (sex) {
      const sexMap = {
        '0': '男',
        '1': '女'
      }
      return sexMap[sex]
    },
    rolesFilter (roles) {
      var roleNameList = []
      roles.forEach(item => {
        roleNameList.push(item.name)
      })
      return roleNameList.join(' , ')
    }
  },
  created () {
    getDeptListEnable().then(res => {
      const data = res.data
      this.buildtree(data, this.deptTree, '0')
      this.expandedKeys = data.map(m => m.parentId)
      this.dataList = data.map(m => {
        return { key: m.id, title: m.name }
      })
    })
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    resetPwdSubmit (record) {
      resetPwd({ id: record.id }).then(res => {
        if (res.code === 0) {
          this.$message.success(`${record.loginName}` + '重置密码成功')
          // this.$emit('ok')
          this.visible = false
        } else {
          this.$message.success(res.msg)
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    delByIds (ids) {
      delUser({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        // const difference = new Set(this.selectedRowKeys.filter(x => !new Set(ids).has(x)))
        // this.selectedRowKeys = Array.from(difference)
        this.selectedRowKeys = []
      })
    },
    onChangeStatus (record) {
      record.status = record.status === '0' ? '1' : '0'
      changUserStatus(pick(record, 'userId', 'status')).then(res => {
        if (res.code === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
      // 发送状态到服务器
    },
    buildtree (list, arr, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.id,
            value: item.id, // value是给modal的select用的，2者属性不一样
            title: item.name,
            scopedSlots: { title: 'title' },
            children: []
          }
          this.buildtree(list, child.children, item.id)
          if (child.children.length === 0) { delete child.children }
          arr.push(child)
        }
      })
    },
    // 下面是树相关方法
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    emitEmpty () {
      this.$refs.searchInput.focus()
      this.searchValue = ''
      this.searchDept()
    },
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    handleChange (e) {
      this.searchDept()
    },
    searchDept () {
      const value = this.searchValue
      const expandedKeys = this.dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          const parentKey = this.getParentKey(item.key, this.deptTree)
          return parentKey
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        autoExpandParent: true
      })
    },
    handleReset(){
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleSelect (selectedKeys, info) {
      this.queryParam = {
        'companyId': selectedKeys[0]
      }
      this.$refs.table.refresh(true)
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
