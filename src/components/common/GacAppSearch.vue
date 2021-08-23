<template>
  <div class="gac-app-search" v-clickoutside="handleClose">
    <el-input
      @focus="handleFocus"
      @input="handleInput"
      @keyup.enter="handleEnter()"
      placeholder="搜索： 应用名称、应用ID"
      size="small"
      suffix-icon="el-icon-search"
      v-model="input"
    ></el-input>

    <transition name="drop-down">
      <div class="gac-app-search__wrap" v-loading="loading" v-show="dropdown">
        <div class="popper__arrow" style="left:205px"></div>
        <div class="tips">显示前10名结果</div>
        <ul class="gac-app-search__wrap-list">
          <empty v-show="list.length == 0" />
          <li :key="`gac-app-search__wrap-list-item-${index}-${item.appId}`" @click="openDetail(item)" v-for="(item,index) in list">
            <el-image :class="{'steam-icon':item.platform == 'stm'}" lazy :src="item.appIcon">
              <template #error>
                <div class="image-error-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </template>
              <template #placeholder>
                <div class="image-error-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </template>
            </el-image>
            <div :class="{'steam':item.platform == 'stm'}">
              <p :title="item.appName" class="app-name wes">{{item.appName}}</p>
              <p :title="item.developer" class="app-developer wes">{{item.developer}}</p>
            </div>
            <img alt class="type-icon" src="https://www.gacgame.com/assets/img/icon/appstore.png" v-if="item.platform == 'ios'" />
            <img alt class="type-icon" src="https://www.gacgame.com/assets/img/icon/googleplay.png" v-if="item.platform == 'google'" />
            <img alt class="type-icon" src="https://www.gacgame.com/assets/img/icon/taptap.png" v-if="item.platform == 'taptap'" />
            <img alt class="type-icon" src="https://www.gacgame.com/assets/img/icon/steam.png" v-if="item.platform == 'stm'" />
          </li>
        </ul>
        <div class="tips more" @click="handleEnter()" v-if="list.length != 0">查看更多</div>
      </div>
    </transition>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  data() {
    return {
      input: '',
      dropdown: false,
      loading: true,

      list: [],
    }
  },
  methods: {
    getData(val) {
      this.loading = true
      this.$api.common
        .getAppRankRecom({
          word: val,
        })
        .then((res) => {
          this.list = res.data.data
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    handleInput: debounce(function (val) {
      if (val != '') {
        this.dropdown = true
        this.getData(val)
      } else {
        this.dropdown = false
      }
    }, 200),
    openDetail(item) {
      if (JSON.stringify(item) != '{}') {
        if (item.platform == 'taptap') {
          this.jumpGacData('taptapdetail', {
            appId: item.appId,
          })
        } else {
          this.jumpGacData('detail', {
            appid: item.appId,
            country: item.cc,
            type: item.platform,
          })
        }
      }
    },
    handleFocus() {
      if (this.input) {
        this.dropdown = true
      }
    },
    handleEnter() {
      this.jumpGacData('asosearch', {
        word: this.input,
        type: 'word',
      })
    },
    handleClose() {
      this.dropdown = false
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep(.el-image) {
  width: auto !important;
  margin-right: 10px;
  &.steam-icon {
    img {
      border-radius: 0 !important;
    }
  }
  img {
    width: auto;
  }
  .image-error-slot {
    width: 32px;
    height: 32px;
  }
}
</style>