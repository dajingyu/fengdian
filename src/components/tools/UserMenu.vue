<template>
  <div class="user-wrapper">
    <div class="content-box">
      <screen-full></screen-full>
<!--      <router-link :to="{name:'404'}">-->
<!--        <span class="action">-->
<!--          <a-icon type="question-circle-o"></a-icon>-->
<!--        </span>-->
<!--      </router-link>-->
      <notice-icon class="action"/>
      <lang-select />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar"/>
          <span>{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>{{ $t('perCenter') }}</span>
            </router-link>
          </a-menu-item>
<!--          <a-menu-item key="1">-->
<!--            <router-link :to="{ name: 'settings' }">-->
<!--              <a-icon type="setting"/>-->
<!--              <span>账户设置</span>-->
<!--            </router-link>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="2" disabled>-->
<!--            <a-icon type="setting"/>-->
<!--            <span>测试</span>-->
<!--          </a-menu-item>-->
<!--          <a-menu-divider/>-->
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>{{ $t('logout') }}</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import LangSelect from '@/components/tools/LangSelect'
import { mapActions, mapGetters } from 'vuex'
import ScreenFull from '@/components/ScreenFull/ScreenFull'
export default {
  name: 'UserMenu',
  components: {
    LangSelect,
    NoticeIcon,
    ScreenFull
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: this.$t('tips'),
        content: this.$t('confirmLogout'),
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          }).catch(err => {
            this.$message.error({
              title: this.$t('error'),
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
