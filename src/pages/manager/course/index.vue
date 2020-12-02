
<template>
  <view>
    <!-- <van-tabs color="#FE7115" animated> -->
    <!-- <van-tab v-for="item in option" :key="item.name" :title="item.name"> -->
    <view class="list">
      <view v-for="(item, index) in list" :key="index" class="list-item">
        <view class="list-item__name">{{item.customer_name}}</view>
        <view class="list-item__desc">{{item.customer_age}}岁</view>
        <view class="list-item__date">{{item.course_intro}}</view>
        <view class="list-item__bottom">
          <view class="list-item__bottom-mobile">
            <image :src="icon.phone" class="list-item__bottom-mobile__icon" />
            <text class="list-item__bottom-mobile__text">{{item.phone}}</text>
          </view>
          <text class="list-item__bottom-record" @click="linkList(item.id,item.customer_name)">联系记录</text>
        </view>
      </view>
    </view>
    <loading v-if="isLoading"></loading>
    <default v-if="!isLoading && !list.length"></default>
    <!-- </van-tab> -->
    <!-- </van-tabs> -->
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
    // option: [
    //   {
    //     name: '课程',
    //     type: 'study',
    //   },
    //   {
    //     name: '活动',
    //     type: 'action',
    //   },
    // ],
    icon: {
      phone: '/static/images/phone.png',
    },
  },
  methods: {
    linkList(id, name) {
      this.linkPage('/pages/manager/contact/record', { id, name });
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
        data: { msg, data: list },
      } = await api.GET_COURSE_MANAGER_LIST(params);

      if (list) {
        this.list = this.list.concat(list);
      } else {
        this.toast(msg);
      }

      this.isLoading = false;

      // if (total <= this.current * this.size) {
      //   this.canScroll = false;
      // }
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
  padding: 30rpx;
  &-item {
    margin-bottom: 20rpx;
    padding: 30rpx 30rpx 0;

    border-radius: 10rpx;
    background: #fff;
    &__name {
      font-size: 30rpx;
      font-weight: 600;

      margin-bottom: 24rpx;
    }
    &__desc {
      font-size: 26rpx;
      line-height: 32rpx;

      color: #9a9a9a;
    }
    &__date {
      font-size: 26rpx;
      line-height: 32rpx;

      margin-bottom: 24rpx;

      color: #9a9a9a;
    }
    &__bottom {
      font-size: 28rpx;

      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 90rpx;

      border-top: 2rpx solid #f4f4f4;
      &-mobile {
        display: flex;
        align-items: center;

        color: #9a9a9a;
        &__icon {
          width: 28rpx;
          height: 28rpx;
          margin-right: 12rpx;
        }
      }
      &-record {
        color: #fe7115;
      }
    }
  }
}

</style>

<config>
{
  navigationBarTitleText: '约课管理',
  usingComponents: {
    "van-tab": "module:@vant/weapp/dist/tab/index",
    "van-tabs": "module:@vant/weapp/dist/tabs/index",
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
