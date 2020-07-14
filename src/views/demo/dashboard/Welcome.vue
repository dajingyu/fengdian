<template>
  <a-card :bordered="false">
  </a-card>
</template>

<script>
  import { mapState } from 'vuex'
  import { getRoleList } from '@/api/manage'
  // const DataSet = require('@antv/data-set')

  export default {
    name: 'FrequencyParam',
    components: {

    },
    data () {
      return {
        user: {},
        loading: true,
      }
    },
    computed: {
      ...mapState({
        nickname: (state) => state.user.nickname,
        welcome: (state) => state.user.welcome
      }),
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    created () {
      this.user = this.userInfo
      this.avatar = this.userInfo.avatar

      // getRoleList().then(res => {
    //   // console.log('workplace -> call getRoleList()', res)
    // })
    },
    mounted () {
      // this.getTeams()
    },
    methods: {
      // getTeams () {
      //   this.$http.get('/workplace/teams')
      //     .then(res => {
      //       this.teams = res.result
      //       this.loading = false
      //     })
      // }
    }
  }
</script>

<style lang="less" scoped>
</style>
