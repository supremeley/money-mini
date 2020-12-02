
<template>
  <view>
    <view class="list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="list-item"
        @click="linkDetail(item.id,item.classId,item.studentId)"
      >
        <image :src="item.headimg || icon.avatar" mode="aspectFill" class="list-item__avatar" />
        <view class="list-item__info">
          <view class="list-item__info-name">{{item.studentName}}</view>
          <view class="list-item__info-desc">家长：{{item.parentName}}</view>
          <view class="list-item__info-desc">联系电话：{{item.telephone}}</view>
        </view>
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
    list: [],
    icon: {
      avatar: '/static/images/avatar.png',
    },
  },
  methods: {
    linkDetail(id, cid, sid) {
      this.linkPage('/pages/manager/student/detail', { id, cid, sid });
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
      } = await api.GET_STUDENT_MANAGER_LIST_BY_CLASS(this.id, params);

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (count <= this.current * this.size) {
        this.canScroll = false;
      }
    },
  },
  onLoad(opt) {
    this.id = opt.id;
  },

  onShow() {
    this.list = [];
    this.isLoading = true;
    this.reset();
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

    height: 220rpx;
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

        margin-bottom: 10rpx;

        color: #9a9a9a;
      }
      &-class {
        font-size: 30rpx;

        color: #fe7115;
      }
    }
  }
}

</style>

<config>
{
  navigationBarTitleText: '学员管理',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
