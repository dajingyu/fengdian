<template>
  <a-modal
    :title="$t('action')"
    style="top: 20px;"
    :width="650"
    v-model="visible"
    :ok-text="$t('ok')"
    :cancel-text="$t('cancel')"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('turbineCode')"
      >
        <a-input v-decorator="['code']"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('minPower')"
      >
        <a-input :placeholder="$t('minPower')" v-decorator="['minPower', {rules: [{ required: true, message: $t('pleaseEnter') + ' ' + $t('minPower') }]}]" />
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('capacity')"
      >
        <a-input :placeholder="$t('capacity')" v-decorator="['capacity', {rules: [{ required: true, message: $t('pleaseEnter') + ' ' + $t('capacity') }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('relativeX')"
      >
        <a-input :placeholder="$t('relativeX')" v-decorator="['relativeX',{rules: [{ required: true, message:  $t('pleaseEnter') + ' ' + $t('relativeX') }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('relativeY')"
      >
        <a-input :placeholder="$t('relativeY')" v-decorator="['relativeY',{rules: [{ required: true, message:  $t('pleaseEnter') + ' ' + $t('relativeY') }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('projectionX')"
      >
        <a-input :placeholder="$t('projectionX')" v-decorator="['projectionX',{rules: [{ required: true, message:  $t('pleaseEnter') + ' ' + $t('projectionX') }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('projectionY')"
      >
        <a-input :placeholder="$t('projectionY')" v-decorator="['projectionY',{rules: [{ required: true, message:  $t('pleaseEnter') + ' ' + $t('projectionY') }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('longitude')"
      >
        <a-input :placeholder="$t('longitude')" v-decorator="['longitude',{rules: [{ required: true, message:  $t('pleaseEnter') + ' ' + $t('longitude') }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('dimension')"
      >
        <a-input :placeholder="$t('dimension')" v-decorator="['dimension',{rules: [{ required: true, message:  $t('pleaseEnter') + ' ' + $t('dimension') }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('isPriorityUp')"
      >
        <a-select v-decorator="['isPriorityUp', {initialValue:1,rules: [{ required: true }]}]" @select="isPriorityUpChange">
          <a-select-option :value="0">否</a-select-option>
          <a-select-option :value="1">是</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('isPriorityDown')"
      >
        <a-select v-decorator="['isPriorityDown', {initialValue:1,rules: [{ required: true }]}]" @select="isPriorityDownChange">
          <a-select-option :value="0">否</a-select-option>
          <a-select-option :value="1">是</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="$t('isProto')"
      >
        <a-select v-decorator="['isProto', {initialValue:1,rules: [{ required: true }]}]" @select="isProtoChange">
          <a-select-option :value="0">否</a-select-option>
          <a-select-option :value="1">是</a-select-option>
        </a-select>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { saveTurbineParam } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'FanModal',
  components: {
  },
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      confirmLoading: false,
      mdl: {},
      options: [],
      city: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    isPriorityUpChange (isPriorityUp) {
      this.isPriorityUp = isPriorityUp
    },
    isPriorityDownChange (isPriorityDown) {
      this.isPriorityDown = isPriorityDown
    },
    isProtoChange (isProto) {
      this.isProto = isProto
    },
    add () {
      this.form.resetFields()
      this.edit({ id: "" })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'code', 'minPower', 'capacity', 'isPriorityUp', 'isPriorityDown', 'isProto', 'isTest', 'relativeX', 'relativeY', 'projectionX', 'projectionY', 'longitude', 'dimension'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveTurbineParam(values).then(res => {
            if (res.code === 0) {
              this.$message.success(this.$t('saveSuccess'))
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.$message.error(this.$t('systemError'))
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    delByIds (ids) {
      //刪除方法
      // delFan({ ids: ids.join(','), wfCode: process.env.VUE_APP_wfCode }).then(res => {
      //   if (res.code === 0) {
      //     this.$message.success(this.$t('deleteSuccess'))
      //     this.handleOk()
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      //   this.selectedRowKeys = []
      // })
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
