<template>
  <view>
    <view class="header">
      <search @search="search" is-search></search>
    </view>
    <view class="plate">
      <view
        v-for="item in list"
        :key="item.id"
        class="list-item"
        @click="linkDetail(item.id)"
      >
        <image :src="item.url" mode="aspectFill" class="list-item__img" />
        <view class="list-item__title">{{ item.name }}</view>
        <view class="list-item__bottom">
          <view class="list-item__loc">
            <image :src="icon.locationGray" class="list-item__loc-icon" />
            <text>{{ item.count }}人预约</text>
          </view>
        </view>
      </view>
    </view>
    <loading v-if="isLoading"></loading>
    <default v-if="!isLoading && !list.length"></default>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import scroll from '@/mixins/scroll';
import { mapState } from '@wepy/x';
import store from '@/store';

wepy.page({
  store,
  mixins: [scroll],
  data: {
    isLoading: true,
    searchStr: '',
    list: [],
    icon: {
      locationGray: '/static/images/location_gray.png',
    },
  },
  computed: {
    ...mapState(['location', 'area']),
  },
  methods: {
    linkDetail(id) {
      this.linkPage(`/pages/action/detail`, { id });
    },
    search(searchStr) {
      this.searchStr = searchStr;
      this.list = [];
      this.reset();
      this.fetchInfo();
    },
    fetchInfo() {
      this.fetchList();
    },
    async fetchList() {
      this.isLoading = true;

      let params = {
        current: this.current,
        size: this.size,
        searchStr: this.searchStr,
      };

      if (Object.keys(this.area).length > 1) {
        params = {
          province: this.area.code,
        };
      }

      const {
        data: { total, data: list },
      } = await api.GET_ACTION_LIST(params);

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (total <= this.current * this.size) {
        this.canScroll = false;
      }
    },
  },
  onShow() {
    this.list = [];
    this.reset();
    this.fetchInfo();
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.header {
  position: sticky;
  z-index: 1;
  top: 0;
}
.plate {
  margin: 20rpx 0;
  padding: 0 30rpx;
  .list-item {
    margin-bottom: 50rpx;
    &__img {
      width: 690rpx;
      height: 340rpx;
      margin-bottom: 36rpx;

      border-radius: 10rpx;
    }
    &__title {
      font-size: 34rpx;
      font-weight: 600;

      margin-bottom: 24rpx;
    }
    &__bottom {
      font-size: 24rpx;

      display: flex;
      align-items: center;
      justify-content: space-between;

      color: #9a9a9a;
    }
    &__loc {
      font-size: 24rpx;

      display: flex;
      align-items: center;

      color: #9a9a9a;
      &-icon {
        width: 22rpx;
        height: 22rpx;
        margin-right: 10rpx;
      }
    }
  }
}

</style>

<config>
{
  usingComponents: {
    search: '~@/components/search',
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
