<template>
  <view class="container">
    <image :src="icon.defaultBg" class="img" />
    <view>暂无数据</view>
  </view>
</template>

<script>
import wepy from '@wepy/core';

wepy.component({
  data: {
    icon: {
      defaultBg: 'https://xlr.img.vbabc.com/system/cdn/default_bg.png',
    },
  },
});
</script>

<style lang="scss">
.container {
  box-sizing: border-box;
  // width: 100vw;
  padding: 180rpx 0;

  text-align: center;

  color: #666;
}
.img {
  width: 374rpx;
  height: 374rpx;
}

</style>
