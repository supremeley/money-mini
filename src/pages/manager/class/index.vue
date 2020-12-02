
<template>
  <view>
    <view class="list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="list-item"
        @click="linkList(item.classId)"
      >
        <view class="list-item__top">
          <image :src="item.headimg || icon.avatar" mode="aspectFill" class="list-item__top-avatar" />
          <view class="list-item__top-info">
            <view class="list-item__top-info-name">{{item.name}}</view>
            <view class="list-item__top-info-desc">开班时间：{{item.orderTime}}</view>
          </view>
        </view>
        <view class="list-item__bottom">
          <text>班级人数:{{item.totalCount || 0}}</text>
          <!-- <text>调课人数:{{item.classNum || 0}}</text> -->
          <text>请假人数:{{item.leaveCount || 0}}</text>
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

wepy.page({
  mixins: [scroll],
  data: {
    isLoading: true,
    list: [],
    icon: {
      avatar: '/static/images/avatar.png',
    },
  },
  methods: {
    linkList(id) {
      this.linkPage('/pages/manager/student/index', { id });
    },
    fetchInfo() {
      this.fetchList();
    },
    async fetchList() {
      this.isLoading = true;

      const params = {
        current: this.current,
        size: this.size,
      };

      const {
        data: { total, msg, data: list },
      } = await api.GET_CLASS_MANAGER_LIST(params);

      if (list) {
        this.list = this.list.concat(list);

        if (total <= this.current * this.size) {
          this.canScroll = false;
        }
      } else {
        this.toast(msg);
      }

      this.isLoading = false;
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
.list {
  padding: 10rpx 30rpx;
  &-item {
    margin-bottom: 20rpx;
    padding: 0 30rpx;

    border-radius: 10rpx;
    background: #fff;
    &__top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 180rpx;
      &-avatar {
        flex-shrink: 0;

        width: 116rpx;
        height: 116rpx;
        margin-right: 25rpx;

        border-radius: 50%;
      }
      &-info {
        flex: 1;
        &-name {
          font-size: 34rpx;
          font-weight: 600;

          margin-bottom: 30rpx;
        }
        &-desc {
          font-size: 30rpx;

          color: #9a9a9a;
        }
      }
    }
    &__bottom {
      font-size: 26rpx;

      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 90rpx;

      color: #9a9a9a;
      border-top: 2rpx solid #f4f4f4;
    }
  }
}

</style>

<config>
{
  navigationBarTitleText: '班级管理',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
