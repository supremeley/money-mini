<template>
  <view class="container">
    <van-loading vertical>加载中...</van-loading>
  </view>
</template>

<script>
import wepy from '@wepy/core';

wepy.component({
  data: {
  },
});
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<config>
{
  usingComponents: {
    "van-loading": "module:@vant/weapp/dist/loading/index"
  }
}
</config>