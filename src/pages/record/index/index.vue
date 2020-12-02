<template>
  <view class="container">
    <view class="record-list">
      <view v-for="item in list" :key="item.id" class="record-list-item">
        <view class="record-list-item__circle"></view>
        <view class="record-list-item__info">
          <view class="record-list-item__info-left">
            <view class="record-list-item__info-left-title">{{
              item.statusText
            }}</view>
            <view class="record-list-item__info-left-desc">{{
              item.showTime
            }}</view>
          </view>
          <view class="record-list-item__info-right">
            <view class="record-list-item__info-right-title">{{
              item.name
            }}</view>
            <view class="record-list-item__info-right-desc">{{
              item.location
            }}</view>
          </view>
        </view>
        <view class="record-list-item__desc">{{ item.classScheduleName }}</view>
      </view>
    </view>
    <!-- <van-tabs color="#FE7115" animated sticky @change="change">
      <van-tab v-for="item in titleOption" :key="item.name" :title="item.name">
        
      </van-tab>
    </van-tabs> -->
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
    type: 'course',
    titleOption: [
      {
        name: `课程`,
        type: 'course',
      },
      {
        name: '活动',
        type: 'activity',
      },
    ],
  },
  methods: {
    change(e) {
      if (e.$wx.detail.title == '课程') {
        this.type = 'course';
      } else {
        this.type = 'activity';
      }

      this.canScroll = true;
      this.list = [];
      this.reset();
      this.fetchInfo();
    },
    fetchInfo() {
      this.fetchList();
    },
    async fetchList() {
      this.isLoading = true;

      const params = {
        current: this.current,
        size: this.size,
        type: this.type,
      };

      let {
        data: { total, data: list },
      } = await api.GET_RECORD_LIST(params);

      list = list.map((item) => {
        return {
          ...item,
          showTime: this.formatTimer(
            item.recordTime
              ? item.recordTime.replace(/-/g, '/')
              : new Date().getTime(),
            'y-m-d'
          ),
          recordTime: this.formatTimer(
            item.recordTime
              ? item.recordTime.replace(/-/g, '/')
              : new Date().getTime()
          ),
        };
      });

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (total <= this.current * this.size) {
        this.canScroll = false;
      }
    },
  },
  onShow() {
    this.type = 'course';
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
.record-list {
  padding: 0 30rpx;

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    // height: 136rpx;
    padding: 20rpx 24rpx;

    border-radius: 10rpx;
    box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
    &:not(:last-child) {
      margin-bottom: 10rpx;
    }
    &__circle {
      flex-shrink: 0;

      width: 14rpx;
      height: 14rpx;
      margin-right: 20rpx;

      border-radius: 50%;
      background: #fe7115;
    }
    &__desc {
      flex-shrink: 0;
      font-size: 24rpx;

      // color: #9a9a9a;
    }
    &__info {
      display: flex;
      align-items: center;
      flex: 1;

      &-left {
        position: relative;

        padding-right: 20rpx;

        text-align: right;
        &-title {
          font-size: 28rpx;

          margin-bottom: 20rpx;
        }
        &-desc {
          font-size: 24rpx;

          white-space: nowrap;

          color: #9a9a9a;
        }
        &::before {
          position: absolute;
          top: 50%;
          right: 0;

          width: 2rpx;
          height: 50rpx;

          content: '';
          transform: translate(-50%, -50%);

          background: #f4f4f4;
        }
      }
      &-right {
        padding-left: 20rpx;

        text-align: left;
        &-title {
          font-size: 26rpx;
          font-weight: 600;

          margin-bottom: 20rpx;
        }
        &-desc {
          font-size: 24rpx;

          color: #9a9a9a;
        }
      }
    }
  }
}
</style>

<config>
{
  navigationBarTitleText: '上课记录',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
    "van-tab": "module:@vant/weapp/dist/tab/index",
    "van-tabs": "module:@vant/weapp/dist/tabs/index",
  }
}
</config>
