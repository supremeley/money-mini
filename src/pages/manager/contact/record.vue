
<template>
  <view>
    <view class="list">
      <view v-for="(item, index) in list" :key="index" class="list-item">
        <view class="list-item__date">
          <view class="list-item__date-month">{{item.month + 1}}.{{item.day}}</view>
          <view class="list-item__date-year">{{item.year}}</view>
        </view>
        <!-- <view class="list-item__info">
          <view></view>
          <view></view>
        </view>-->
        <view class="list-item__content">
          <view class="list-item__content-top">
            <text class="list-item__content-top-name">{{item.contractName}}</text>
            <text class="list-item__content-top-item">{{item.hour}}:{{item.minute}}</text>
          </view>
          <view class="list-item__content-dese">{{item.content}}</view>
        </view>
      </view>
    </view>
    <loading v-if="isLoading"></loading>
    <default v-if="!isLoading && !list.length"></default>
    <button class="btn" @click="link">新增联系记录</button>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import scroll from '@/mixins/scroll';

wepy.page({
  mixins: [scroll],
  data: {
    id: null,
    name: null,
    isLoading: true,
    list: [],
  },
  computed: {},
  methods: {
    link() {
      this.linkPage(`/pages/manager/contact/index`, {
        id: this.id,
        name: this.name,
      });
    },
    fetchInfo() {
      this.fetchList();
    },
    async fetchList() {
      this.isLoading = true;

      const params = {
        auditionId: this.id,
        current: this.current,
        size: this.size,
      };

      let {
        data: { total, data: list },
      } = await api.GET_AUDITIONLOG_LIST(params);

      list = list.map((item) => {
        return {
          ...item,
          ...this.dayHandle(item.createTime),
        };
      });

      this.list = this.list.concat(list);

      if (total <= this.current * this.size) {
        this.canScroll = false;
      }

      this.isLoading = false;
    },
    dayHandle(time) {
      // console.log(time)
      let date;
      if (time) {
        date = new Date(time.replace(/-/g, '/'));
      } else {
        date = new Date();
      }
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      return {
        year,
        month,
        day,
        hour,
        minute,
        second,
      };
    },
  },
  onLoad(opt) {
    this.id = opt.id;
    this.name = decodeURI(opt.name);
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
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    margin-bottom: 40rpx;
    &__date {
      flex-shrink: 0;

      margin-right: 60rpx;
      &-month {
        font-size: 36rpx;
        font-weight: 600;

        margin-bottom: 12rpx;
      }
      &-year {
        font-size: 24rpx;
      }
    }
    &__info {
      flex-basis: 60rpx;
    }
    &__content {
      overflow: hidden;
      flex: 1;

      box-sizing: border-box;
      min-height: 200rpx;
      padding: 24rpx;

      border-radius: 10rpx;
      background: #fff;
      &-top {
        display: flex;
        align-items: center;

        margin-bottom: 12rpx;
        &-name {
          font-size: 36rpx;
          font-weight: 600;

          overflow: hidden;

          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
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
  navigationBarTitleText: '约课联系记录',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
