
<template>
  <view>
    <van-tabs color="#FE7115" animated sticky @change="change">
      <van-tab v-for="item in option" :key="item.name" :title="item.name">
        <view v-if="item.type == 'vacation'" class="list">
          <view v-for="(item, index) in vacationList" :key="index" class="list-item">
            <image
              :src="item.stuHeadimg || icon.avatar"
              mode="aspectFill"
              class="list-item__avatar"
            />
            <view class="list-item__info">
              <view class="list-item__info-name">{{item.stuName}}</view>
              <view class="list-item__info-desc">请假课时：{{item.sourceScheduleName}}</view>
            </view>
          </view>
          <default v-if="!isLoading && !vacationList.length"></default>
        </view>
        <view v-if="item.type == 'adjust'" class="list">
          <view v-for="(item, index) in adjustList" :key="index" class="list-item">
            <image :src="item.stuHeadimg || icon.avatar" class="list-item__avatar" />
            <view class="list-item__info">
              <view class="list-item__info-name">{{item.stuName}}</view>
              <view class="list-item__info-desc">原本课时：{{item.sourceScheduleName}}</view>
              <view class="list-item__info-desc">调课课时：{{item.newScheduleName}}</view>
            </view>
          </view>
          <default v-if="!isLoading && !adjustList.length"></default>
        </view>
        <loading v-if="isLoading"></loading>
      </van-tab>
    </van-tabs>
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
    type: 'vacation',
    vacationList: [],
    adjustList: [],
    option: [
      {
        name: '请假',
        type: 'vacation',
      },
      {
        name: '调课',
        type: 'adjust',
      },
    ],
    icon: {
      avatar: '/static/images/avatar.png',
    },
  },
  methods: {
    change(e) {
      if (e.$wx.detail.title == '请假') {
        this.type = 'vacation';
      } else {
        this.type = 'adjust';
      }

      this.canScroll = true;
      this.list = [];
      this.isLoading = true;
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
        type: this.type == 'vacation' ? 1 : 2,
      };

      const {
        data: { total, msg, data: list },
      } = await api.GET_ADJUST_MANAGER_LIST(params);

      if (list) {
        if (this.type == 'vacation') {
          this.vacationList = this.list.concat(list);
        } else {
          this.adjustList = this.list.concat(list);
        }

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
    this.isLoading = true;
    this.reset();
    // this.isLoading = false;
    this.fetchInfo();
  },
});
</script>

<style lang="scss" scoped>
.list {
  padding: 10rpx 30rpx;
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 180rpx;
    margin-bottom: 20rpx;
    padding: 0 30rpx;

    border-radius: 10rpx;
    background: #fff;
    &__avatar {
      flex-shrink: 0;

      width: 116rpx;
      height: 116rpx;
      margin-right: 25rpx;

      border-radius: 50%;
    }
    &__info {
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
}
</style>

<config>
{
  navigationBarTitleText: '请假/调课管理',
  usingComponents: {
    "van-tab": "module:@vant/weapp/dist/tab/index",
    "van-tabs": "module:@vant/weapp/dist/tabs/index",
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
