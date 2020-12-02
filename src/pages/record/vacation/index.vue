
<template>
  <view>
    <view class="list">
      <view v-for="item in list" :key="item.id" class="list-item">
        <view class="list-item__header">
          <text class="list-item__header-title">{{item.sourceScheduleName}}</text>
          <text class="list-item__header-id">{{item.sourceScheduleTime}}</text>
        </view>
        <view class="list-item__content">请假事由：{{item.content}}</view>
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
        type: 1,
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

      margin-bottom: 30rpx;

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
      font-size: 30rpx;

      color: #9a9a9a;
    }
  }
}

</style>

<config>
{
  navigationBarTitleText: '我的请假',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
