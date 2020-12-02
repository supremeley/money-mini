<template>
  <view class="wrap">
    <search @search="search" is-search></search>
    <view class="section">
      <view
        v-for="item in list"
        :key="item.id"
        class="list-item"
        @click="linkDetail(item.id)"
      >
        <image
          :src="item.headimg"
          mode="aspectFill"
          class="list-item__avatar"
        />
        <view class="list-item__content">
          <view class="list-item__title">{{ item.name }}</view>
          <view class="list-item__desc">{{ item.label }}</view>
        </view>
        <van-icon name="plus" class="plus" @click.stop="add" />
      </view>
    </view>
    <loading v-if="isLoading"></loading>
    <default v-if="!isLoading && !list.length"></default>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import scroll from '@/mixins/scroll';
// import Dialog from '@vant/weapp/dist/dialog/dialog.js';

wepy.page({
  mixins: [scroll],
  data: {
    isLoading: false,
    list: [],
  },
  methods: {
    linkDetail(id) {
      this.linkPage(`/pages/teacher/detail`, { id });
    },
    search(str) {
      this.fetchList();
    },
    add() {
      // Dialog.confirm({
      //   message: '是否确认添加xxx教练',
      //   theme: 'round-button',
      // })
      //   .then(() => {
      //     // on close
      //   })
      //   .catch(() => {
      //     // on cancel
      //   });
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
        data: { count, data: list },
      } = await api.GET_TEACHER_LIST(params);

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (count <= this.current * this.size) {
        this.canScroll = false;
      }
    },
  },
  onShow() {
    this.list = [];
    this.reset();
    this.isLoading = false;
    // this.fetchInfo();
  },
});
</script>

<style lang="scss" scoped>
.wrap {
  padding-bottom: 80rpx;
}
.section {
  padding: 30rpx;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: 180rpx;
  height: 180rpx;
  padding: 0 30rpx;

  border-radius: 10rpx;
  background: #fff;
  &:not(:last-child) {
    margin-bottom: 20rpx;
  }
  &__avatar {
    flex-shrink: 0;

    width: 130rpx;
    height: 130rpx;
    margin-right: 40rpx;

    border-radius: 50%;
  }
  &__content {
    overflow: hidden;
    flex: 1;
  }
  &__title {
    font-size: 34rpx;
    font-weight: 600;

    margin-bottom: 30rpx;
  }
  &__desc {
    font-size: 30rpx;

    overflow: hidden;

    white-space: nowrap;
    text-overflow: ellipsis;

    color: #9a9a9a;
  }
  .plus {
    flex-shrink: 0;

    color: rgb(0, 217, 255);
  }
}
.btn {
  line-height: 80rpx;

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 80rpx;

  color: #fff;
  border-radius: 0;
  background: rgb(0, 217, 255);
  &::after {
    border: none;
  }
}

</style>

<config>
{
  navigationBarTitleText: '添加教练',
  usingComponents: {
    search: '~@/components/search',
    loading: '~@/components/loading',
    default: '~@/components/default',
    "van-icon": "module:@vant/weapp/dist/icon/index",
    "van-dialog": "module:@vant/weapp/dist/dialog/index"
  }
}
</config>

