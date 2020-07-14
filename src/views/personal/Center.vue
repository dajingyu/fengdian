<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
      <a-card :bordered="false">
        <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="avatar()">
            </div>
            <div class="username">{{ nickname() }}</div>
        </div>
        <div class="account-center-detail">
          <ul>
            <li>
              <p>
                <label>{{ $t('loginName') }}：</label>
                <span>{{ loginName() }}</span>
              </p>
            </li>
            <li>
              <p>
                <label>{{ $t('userName') }}：</label>
                <span>{{ nickname() }}</span>
              </p>
            </li>
            <li>
              <p>
                <label>{{ $t('phone') }}：</label>
                <span>{{ phonenumner() }}</span>
              </p>
            </li>
            <li>
              <p>
                <label>{{ $t('email') }}：</label>
                <span>{{ email() }}</span>
              </p>
            </li>
            <li>
              <p>
                <label>{{ $t('dept') }}：</label>
                <span>{{ deptName() }}</span>
              </p>
            </li>
          </ul>
        </div>
      </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
    }
  },
  created() {
  },
  destroyed: function() {
  },
  methods: {
    ...mapGetters(['deptName', 'phonenumner', 'email', 'loginName', 'nickname', 'avatar'])
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    float: left;
    width: 350px;
    text-align: center;
    margin: 70px 0 24px 200px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    float: left;
    width: 50%;
    margin-top: 30px;
    ul li {
      padding: 0;
      margin: 0;
      list-style: none;
      line-height: 35px;
    }
    label {
      font-weight: 600;
    }
  }
}
</style>
