<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">

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
              v-model="queryParam.id"
            >
            </a-tree-select>
          </a-form-item>

            <!-- <a-form-item label="区域名称" >
              <a-input placeholder="请输入区域名称" v-model="queryParam.name"/>
            </a-form-item> -->
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="this.fetch">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
    </div>
    <a-table
      ref="table"
      rowKey="id"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="data">

      <span slot="menuType" slot-scope="text">
        {{ text | menuTypeFilter }}
      </span>

      <span slot="type" slot-scope="text">
        {{ text | typeFilter }}
      </span>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="addEnable" @click="handleAdd(record.id+'')">新增</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delById(record.id)">删除</a>
      </span>
    </a-table>

    <area-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { Table as T } from 'ant-design-vue'
import { getAreaList, delArea } from '@/api/system'
import AreaModal from './modules/AreaModal.vue'
import { treeData } from '@/utils/treeutil'
// import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    T,
    AreaModal
  },
  data () {
    return {
      description: '',

      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},
      areas: [{ key: '0', value: '0', title: '无' }],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '区域名',
          dataIndex: 'name'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '本级顺序',
          dataIndex: 'sorts'
        },
        {
          title: '全部顺序',
          dataIndex: 'sorts'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      pagination: false,
      loading: false,
      addEnable: true,
      editEnabel: true,
      removeEnable: true
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        '1': '停用',
        '0': '正常'
      }
      return statusMap[status]
    },
    typeFilter (type) {
      const typeMap = {
        '0': '洲',
        '1': '国家',
        '2': '区域',
        '3': '省',
        '4': '市',
        '5': '区县'
      }
      return typeMap[type]
    },
    menuTypeFilter (type) {
      const menuMap = {
        'M': '模块',
        'F': '按钮',
        'C': '菜单'
      }
      return menuMap[type]
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.fetch()
    },
    delById (id) {
      delArea(id).then(res => {
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
      getAreaList(Object.assign(this.queryParam)).then(res => {
        console.log(res.data)
        this.data = treeData(res.data, 'id', 'parentId', 'children', this.queryParam.id === undefined ? '0' : this.queryParam.id)
        this.loading = false
        this.buildtree(res.data, this.areas, '0')
        console.log(this.data)
      })
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
