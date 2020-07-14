<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="12">
            <a-form-item :label="$t('turbineName')">
              <a-select v-decorator="['turbineCode']" :placeholder="$t('pleaseSelect')" v-model="queryParam.code">
                <a-select-option v-for="item in turbineCodeSelectOption" :key="item.code" :value="item.code">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="19" :sm="15">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">{{$t('search')}}</a-button>
              <a-button style="margin-left: 8px" @click="() => handleReset()">{{$t('reset')}}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">{{$t('add')}}</a-button>
      <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
        <a-popconfirm :title="$t('deleteSelectedData')" @confirm="delByIds(selectedRowKeys)" :ok-text="$t('ok')" :cancel-text="$t('cancel')">
          <a-button type="danger" icon="delete">{{$t('delete')}}</a-button>
        </a-popconfirm>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
    >
      <span slot="isPriorityUp" slot-scope="text">
        {{ text | isPriorityUpFilter }}
      </span>
      <span slot="isPriorityDown" slot-scope="text">
        {{ text | isPriorityDownFilter }}
      </span>
      <span slot="isProto" slot-scope="text">
        {{ text | isProtoFilter }}
      </span>
      <span slot="isTest" slot-scope="text">
        {{ text | isTestFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a-popconfirm v-if="removeEnable" :title="$t('deleteSelectedData')" @confirm="delByIds([record.id])" :ok-text="$t('ok')" :cancel-text="$t('cancel')">
          <a>{{$t('delete')}}</a>
        </a-popconfirm>
      </span>
    </s-table>
    <fan-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { getTurbineList } from '@/api/index'
  import { checkPermission } from '@/utils/permissions'
  import FanModal from './modules/FanModal'
  const isOrNoMap = {
      0: '否',
      1: '是'
  }
  export default {
    name: 'TableList',
    components: {
      STable,
      Ellipsis,
      FanModal
    },
    data () {
      return {
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        form: this.$form.createForm(this),
        mdl: {},
        permissions: [],
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: this.$t('turbineCode'),
            dataIndex: 'code'
          },
          {
            title: this.$t('turbineName'),
            dataIndex: 'alisasName' || 'name'
          },
          {
            title: this.$t('minPower'),
            dataIndex: 'minPower'
          },
          {
            title: this.$t('capacity'),
            dataIndex: 'capacity'
          },
          {
            title: this.$t('isPriorityUp'),
            dataIndex: 'isPriorityUp',
            scopedSlots: { customRender: 'isPriorityUp' }
          },
          {
            title: this.$t('isPriorityDown'),
            dataIndex: 'isPriorityDown',
            scopedSlots: { customRender: 'isPriorityDown' }
          },
          {
            title: this.$t('isProto'),
            dataIndex: 'isProto',
            scopedSlots: { customRender: 'isProto' }
          },
          {
            title: this.$t('isTest'),
            dataIndex: 'isTest',
            scopedSlots: { customRender: 'isTest' }
          },
          {
            title: this.$t('relativeX'),
            dataIndex: 'relativeX'
          },
          {
            title: this.$t('relativeY'),
            dataIndex: 'relativeY'
          },
          {
            title: this.$t('projectionX'),
            dataIndex: 'projectionX'
          },
          {
            title: this.$t('projectionY'),
            dataIndex: 'projectionY'
          },
          {
            title: this.$t('longitude'),
            dataIndex: 'longitude'
          },
          {
            title: this.$t('dimension'),
            dataIndex: 'dimension'
          },
          {
            title: this.$t('action'),
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        range: null,
        confirmLoading: false,
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return getTurbineList(Object.assign(parameter, this.queryParam))
        },
        turbineCodeSelectOption: [],  //存放风机编号下拉选项
        selectedRowKeys: [],
        selectedRows: [],
        addEnable: true,  // checkPermission('system:config:add'),
        editEnabel: true,  // checkPermission('system:config:edit'),
        removeEnable: true  // checkPermission('system:config:remove')
      }
    },
    filters: {
      isPriorityUpFilter (isPriorityUp) {
        return isOrNoMap[isPriorityUp]
      },
      isPriorityDownFilter (isPriorityDown) {
        return isOrNoMap[isPriorityDown]
      },
      isProtoFilter (isProto) {
        return isOrNoMap[isProto]
      },
      isTestFilter (isTest) {
        return isOrNoMap[isTest]
      },
    },
    beforeCreate () {
    },
    created () {
    },
    methods: {
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        console.log(this.selectedRowKeys)
        console.log(this.selectedRows)
      },
      handleOk () {
        this.$refs.table.refresh(true)
      },
      handleEdit (record) {
        this.$refs.modal.edit(record)
      },
      handleReset(){
        this.queryParam = {}
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
<style lang='less'>
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding-left: 3px;
    padding-right: 3px;
    text-align:center
  }
  form .ant-select {
    min-width: 130px
  }
</style>