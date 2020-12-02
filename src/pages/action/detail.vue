
<template>
  <view class="container">
    <view class="container__title">{{ fetchData.name }}</view>
    <loading v-if="isLoading"></loading>
    <default v-if="!isLoading && !fetchData.attachs.length"></default>
    <image
      v-for="item in fetchData.attachs"
      :key="item.id"
      :src="item.url"
      mode="widthFix"
      class="container__img"
    />
    <button class="btn" @click="linkBook">立即报名</button>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';

wepy.page({
  data: {
    id: null,
    isLoading: true,
    fetchData: {},
  },
  methods: {
    linkBook() {
      this.linkPage(`/pages/book/index`, {
        id: this.id,
        name: this.fetchData.name,
        type: 'activity',
      });
    },
    fetchInfo() {
      this.getActionDetail();
    },
    async getActionDetail() {
      this.isLoading = true;

      const {
        data: { data: fetchData },
      } = await api.GET_ACTION_DETAIL(this.id);

      this.fetchData = fetchData;

      this.isLoading = false;
    },
  },
  onLoad(opt) {
    this.id = opt.id;
  },
  onShow() {
    this.fetchInfo();
  },
  onShareAppMessage(e) {
    return {
      title: this.fetchData.name,
    };
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.container {
  &__title {
    font-size: 32rpx;
    font-weight: 600;
    line-height: 90rpx;

    text-align: center;
  }
  &__img {
    width: 100%;
  }
}
.btn {
  font-size: 36rpx;
  line-height: 90rpx;

  position: fixed;
  bottom: 60rpx;
  left: 50%;

  width: 630rpx;
  height: 90rpx;

  transform: translate(-50%, 0);

  color: #fff;
  border-radius: 45rpx;
  background: #fe7115;
  &::after {
    border: none;
  }
}

</style>

<config>
{
  navigationBarTitleText: '活动详情',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
