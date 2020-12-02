
<template>
  <view>
    <view class="list">
      <view v-for="item in list" :key="item.id" class="list-item">
        <view class="list-item__header">
          <text class="list-item__header-title">{{item.sourceScheduleName}}</text>
          <!-- <text class="list-item__header-id">xly001</text> -->
        </view>
        <view class="list-item__content">
          <view class="list-item__info">
            <text class="list-item__info-title">{{item.sourceScheduleName}}</text>
            <view class="list-item__info-circle"></view>
            <text class="list-item__info-desc">现课时段：{{item.sourceScheduleTime}}</text>
          </view>
          <view class="list-item__info new">
            <text class="list-item__info-title">{{item.newScheduleName}}</text>
            <view class="list-item__info-circle"></view>
            <text class="list-item__info-desc">原课时段：{{item.newScheduleTime}}</text>
          </view>
          <view class="line"></view>
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
    memberInfo: {},
    list: [],
  },
  methods: {
    fetchInfo() {
      this.fetchList();
    },
    async fetchList() {
      this.isLoading = true;

      const params = {
        current: this.current,
        studentId: this.memberInfo.id,
        size: this.size,
        type: 2,
      };

      const {
        data: { count, data: list },
      } = await api.GET_ADJUST_RECORD_LIST(params);

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (count <= this.current * this.size) {
        this.canScroll = false;
      }
    },
  },
  onShow() {
    this.memberInfo = wx.getStorageSync('memberInfo');
    this.list = [];
    this.reset();
    this.fetchInfo();
  },
});
</script>

<style lang="scss" scoped>
.list {
  padding: 30rpx;
  .list-item {
    margin-bottom: 20rpx;
    padding: 30rpx;

    border-radius: 10rpx;
    background: #fff;
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 40rpx;

      &-title {
        font-size: 34rpx;
        font-weight: 600;
      }
      &-id {
        font-size: 26rpx;

        color: #9a9a9a;
      }
    }
    &__content {
      position: relative;
    }
    &__info {
      display: flex;
      align-items: center;

      height: 48rpx;

      color: #666;
      &-title {
        font-size: 30rpx;

        overflow: hidden;
        flex-basis: 140rpx;

        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &-desc {
        font-size: 28rpx;

        white-space: nowrap;
      }
      &-circle {
        position: relative;
        z-index: 1;

        width: 14rpx;
        height: 14rpx;
        margin: 0 20rpx;

        border-radius: 50%;
        background: #ccc;
      }
    }
    .new {
      .list-item__info-circle {
        background: #ff6c17;
      }
    }
    .line {
      position: absolute;
      top: 50%;
      left: 167rpx;

      width: 2rpx;
      height: 50rpx;

      transform: translate(-50%, -50%);

      background: #e5e5e5;
    }
  }
}

</style>

<config>
{
  navigationBarTitleText: '我的调课',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
