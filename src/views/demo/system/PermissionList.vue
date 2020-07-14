<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="5" d:sm="15">
            <a-form-item label="模块名">
              <a-tree-select
                v-decorator="['moduleId']"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="moduleLists"
                placeholder="请选择"
                v-model="queryParam.moduleId"
                treeDefaultExpandAll
              >
              </a-tree-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" d:sm="15">
            <a-form-item label="菜单名称">
              <a-input placeholder="请输入" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <!--          <a-col :md="4" :sm="15">-->
          <!--            <a-form-item label="状态">-->
          <!--              <a-select placeholder="请选择" v-model="queryParam.isShow">-->
          <!--                <a-select-option value="">全部</a-select-option>-->
          <!--                <a-select-option value="1">显示</a-select-option>-->
          <!--                <a-select-option value="0">隐藏</a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :md="4" d:sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="this.fetch">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => handleReset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="handleAdd('')">新建</a-button>
    </div>
    <a-table
      ref="table"
      rowKey="id"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="data">

      <span slot="type" slot-scope="text">
        {{ text | menuTypeFilter }}
      </span>

      <!--      <span slot="isShow" slot-scope="text">-->
      <!--        {{ text | statusFilter }}-->
      <!--      </span>-->

      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="addEnable" @click="handleAdd(record.id+'')">新增</a>
        <a-divider type="vertical" />
        <a-popconfirm v-if="removeEnable" title="是否要删除此行？" @confirm="delById([record.id])">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <permission-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
  import { Tree, Table as T } from 'ant-design-vue'
  import { STable, STree } from '@/components'
  import { getPermissions, delPerm, getModuleLists } from '@/api/system'
  import PermissionModal from './modules/PermissionModal.vue'
  import { treeData } from '@/utils/treeutil'
  import { checkPermission } from '@/utils/permissions'
  import pick from 'lodash.pick'
  export default {
    name: 'TableList',
    components: {
      T,
      PermissionModal
    },
    data () {
      return {
        description: '菜单管理，只有menuKey(唯一)不为空才生效',
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        moduleLists: [],  //{ key: 0, value: '0', title: '无' }
        form: this.$form.createForm(this),
        mdl: {},
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},

        // 表头
        columns: [
          {
            title: '菜单名称',
            dataIndex: 'name'
          },
          {
            title: '排序',
            dataIndex: 'sort'
          },
          {
            title: '类型',
            dataIndex: 'type',
            scopedSlots: { customRender: 'type' }
          },
          {
            title: '模块名',
            dataIndex: 'moduleName'
          },
          {
            title: '链接',
            dataIndex: 'href'
          },
          {
            title: '权限标识',
            dataIndex: 'permission'
          },
          // {
          //   title: '状态',
          //   dataIndex: 'isShow',
          //   scopedSlots: { customRender: 'isShow' }
          // },
          {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        data: [],
        dataList: [],
        pagination: false,
        loading: false,
        addEnable: checkPermission('system:menu:add'),
        editEnabel: checkPermission('system:menu:edit'),
        removeEnable: checkPermission('system:menu:remove')
      }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          '0': '隐藏',
          '1': '显示'
        }
        return statusMap[status]
      },
      menuTypeFilter (type) {
        const menuMap = {
          'M': '目录',
          'F': '按钮',
          'C': '菜单'
        }
        return menuMap[type]
      }
    },
    created () {
      this.fetch()
      this.loadModuleLists()
    },
    methods: {
      handleAdd (parentId) {
        this.$refs.modal.add(parentId, this.moduleLists)
      },
      handleEdit(record) {
        this.$refs.modal.edit(record, this.moduleLists)
      },
      handleOk () {
        this.fetch()
      },
      handleReset(){
        this.queryParam = {}
        this.fetch()
      },
      loadModuleLists () {
        getModuleLists().then(res => {
          this.buildtree(res.data, this.moduleLists, '0')
        })
      },
      buildtree (list, arr, moduleId) {
        list.forEach(item => {
          // if (item.id === moduleId) {
          var child = {
            key: item.id,
            value: item.id + '',
            title: item.name,
            children: []
          }
          // this.buildtree(list, child.children, item.id)
          if (child.children.length === 0) { delete child.children }
          arr.push(child)
          // }
        })
      },
      delById (id) {
        delPerm({ id: id.join(',') }).then(res => {
          if (res.code === 0) {
            this.$message.success(`删除成功`)
            this.handleOk()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      fetch () {
        this.loading = true
        getPermissions(Object.assign(this.queryParam)).then(res => {
          this.data = treeData(res.data, 'id')
          this.loading = false
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
