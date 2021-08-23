<template>
  <!--  -->
  <div class="gac-layout-header-wrap">
    <div class="gac-layout-header-content">
      <img @click="handleSelect(`${navData.url.PLATFORM_URL}index`)" alt src="https://www.gacgame.com/assets/img/logo/gac_logo-green.png" />

      <el-menu
        active-text-color="--themeColor"
        :default-active="activeIndex"
        @select="handleSelect"
        background-color="#fff"
        mode="horizontal"
        ref="sidemenu"
        text-color="#333"
      >
        <el-menu-item index="null" style="display:none"></el-menu-item>
        <!-- <el-menu-item index="https://www.gacgame.com/index" style="display:none"></el-menu-item> -->

        <span :key="'nav-main-nav-' + item.name + index" v-for="(item,index) in $store.state.common.navData.mainNav">
          <el-menu-item :index="ENV == 'production' ? item.onlineHref : item.offlineHref" v-if="item.list.length == 0">{{item.name}}</el-menu-item>
          <el-submenu :index="'#' + index + item.name" :popper-append-to-body="false" v-if="item.list.length > 0 && mixin_isArray(item.list[0])">
            <template #title>{{item.name}}</template>
            <div class="gac-layout-header-li-wrap">
              <div :key="'nav-main-nav-nav-' + _item.name + _index" class="colu" v-for="(_item,_index) in item.list">
                <el-menu-item
                  :class="{'imgbox':__item.isBanner,'last':__item.isLast}"
                  :index="ENV == 'production' ? __item.onlineHref : __item.offlineHref"
                  :key="'nav-main-nav-nav-nav-' + __item.name + __index"
                  v-for="(__item,__index) in _item"
                >
                  <div v-if="__item.isBanner">
                    <img :src="__item.icon" />
                    <span>{{__item.name}}</span>
                  </div>
                  <div v-else>
                    <i :class="__item.icon"></i>
                    {{__item.name}}
                  </div>
                  <div class="lihr" v-if="__item.isLast"></div>
                </el-menu-item>
              </div>
            </div>
          </el-submenu>

          <el-submenu :index="'#' + index + item.name" v-if="item.list.length > 0 && mixin_isObject(item.list[0])">
            <template #title>{{item.name}}</template>
            <div>
              <el-menu-item
                :index="ENV == 'production' ? _item.onlineHref : _item.offlineHref"
                :key="'nav-main-nav-item' + _item.name + _index"
                class="el-menu-item-right"
                v-for="(_item,_index) in item.list"
              >
                <i :class="_item.icon"></i>
                {{_item.name}}
              </el-menu-item>
            </div>
          </el-submenu>
        </span>

        <!-- USER -->
        <span>
          <el-submenu class="menu-user" index="user">
            <template #title>
              <el-avatar
                :src="$store.state.common.userInfo.avatar"
                fit="cover"
                size="medium"
                style="position:relative;top:-2px;margin-right:10px"
                v-if="$store.state.common.userInfo.avatar"
              ></el-avatar>
              <el-avatar
                :src="
                $store.state.common.userInfo.sex == 1
                  ? 'https://www.gacgame.com/assets/img/base/women_avatar.png'
                  : 'https://www.gacgame.com/assets/img/base/man_avatar.png'
              "
                fit="cover"
                size="medium"
                style="position:relative;top:-2px;margin-right:10px"
                v-else
              ></el-avatar>
              {{ $store.state.common.userInfo.username }}
            </template>
            <div>
              <span :key="'nav-user-nav-item-' + item.name + index" v-for="(item,index) in $store.state.common.navData.userNav">
                <el-menu-item :index="ENV == 'production' ? item.onlineHref : item.offlineHref" class="el-menu-item-right">
                  <i :class="item.icon" v-if="item.icon"></i>
                  {{item.name}}
                </el-menu-item>
                <el-divider style="margin:2px 0" v-if="item.divider" />
              </span>
            </div>
          </el-submenu>
        </span>
        <!-- USER -->
      </el-menu>
      <div class="gac-layout-header-search-wrap">
        <gac-app-search />
      </div>
    </div>
  </div>
</template>
<script>
import GacAppSearch from '@/components/common/GacAppSearch.vue'

export default {
  components: {
    GacAppSearch,
  },
  data() {
    return {
      loading: false,
      activeIndex: 'null',
      navData: {},
      ENV: import.meta.env.MODE,
    }
  },
  mounted() {
    this.activeIndex = window.location.origin + window.location.pathname
  },
  watch: {
    $route(to, from) {
      this.activeIndex = window.location.origin + window.location.pathname
    },
  },
  methods: {
    handleSelect(key, keyPath) {
      let _blank = ['http://admin.gacgame.com/']
      if (key == 'out') {
        this.logout()
      } else if (_blank.indexOf(key) > -1) {
        window.open(key)
      } else {
        window.location.href = key
      }
    },
    searchChange(data) {
      this.$emit('search', 'seachPage', data)
    },
    logout() {
      this.$confirm('确定退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api.user
            .logout(this.isDev() ? 'token=gac_test' : '')
            .then((res) => {
              location.reload()
            })
        })
        .catch(() => {})
    },
    // 权限控制
    purview(url) {
      let purview = {
        // 策划可看
        isDesigner_yes: [],
        // 开发可看
        isDeveloper_yes: ['aso'],
        // 管理员可看
        isAdmin_yes: [],
        // GAC可看
        isGac_yes: [
          'app',
          'stm',
          'test',
          'report',
          'https://www.gacgame.com/gamerecommend',
          'https://www.gacgame.com/taptaprank',
          'https://www.gacgame.com/project/archives',
          'http://admin.gacgame.com/',
        ],
      }

      if (
        purview.isGac_yes.indexOf(url) > -1 &&
        this.$store.state.common.userInfo.permission &&
        this.$store.state.common.userInfo.permission.indexOf('gac') > -1
      ) {
        return true
      } else if (purview.isDeveloper_yes.indexOf(url) > -1) {
        if (
          this.$store.state.common.userInfo.nickname == 'gac_test' ||
          this.$store.state.common.userInfo.nickname == 'wb.sanghangning' ||
          this.$store.state.common.userInfo.nickname == 'hzjinyu' ||
          this.$store.state.common.userInfo.nickname == 'wangdechao'
        ) {
          return true
        }
      }

      return false
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep(.el-menu) {
  .el-popper {
    z-index: -1 !important;
    top: 60px !important;
    left: -1px !important;
  }
}
</style>