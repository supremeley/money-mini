<template>
  <view class="list-item" @click="link(item.id)">
    <image :src="item.headImg || icon.default" mode="aspectFill" class="list-item__img" />
    <view class="list-item__info">
      <view class="list-item__title">
        <view v-if="item.labels" class="list-item__title-tag">
          {{ item.labels }}
        </view>
        <text class="list-item__title-text">{{ item.name }}</text>
      </view>
      <view v-if="item.intro" class="list-item__desc">{{ item.intro }}</view>
      <view class="list-item__loc">
        <image :src="icon.locationGray" class="list-item__loc-icon" />
        <text>{{ item.campus }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import wepy from '@wepy/core';

wepy.component({
  props: {
    item: {},
  },
  data: {
    icon: {
      locationGray: '/static/images/location_gray.png',
      default: '/static/images/default.png',
    },
  },
  methods: {
    link(id) {
      this.$emit('link', id);
    },
  },
});
</script>

<style lang="scss">
// @import '@/style/mixins';

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 30rpx 0;

  border-bottom: 2rpx solid #f4f4f4;

  &__img {
    flex-shrink: 0;

    width: 180rpx;
    height: 200rpx;
    margin-right: 36rpx;

    border-radius: 10rpx;
  }
  &__info {
    display: flex;
    overflow: hidden;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    height: 164rpx;
  }
  &__title {
    display: flex;
    overflow: hidden;
    align-items: center;

    &-tag {
      font-size: 22rpx;

      width: 60rpx;
      height: 30rpx;
      margin-right: 10rpx;

      text-align: center;

      color: #fff;
      background: #fe7115;
    }
    &-text {
      font-size: 30rpx;
      font-weight: 600;

      overflow: hidden;

      white-space: nowrap;
      text-overflow: ellipsis;
      // @include text-overflow;
    }
  }
  &__desc {
    font-size: 26rpx;
    line-height: 30rpx;

    display: -webkit-box;
    overflow: hidden;

    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;

    min-height: 60rpx;

    text-overflow: ellipsis;

    color: #9a9a9a;

    -webkit-line-clamp: 2;
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
</style>

<config>
{
  usingComponents: {
    "van-loading": "module:@vant/weapp/dist/loading/index"
  }
}
</config>