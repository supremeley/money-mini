<template>
  <view class="wrap">
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
      </view>
    </view>
    <loading v-if="isLoading"></loading>
    <default v-if="!isLoading && !list.length"></default>
    <button class="btn" @click="linkAdd">添加教练</button>
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
    list: [
      {
        createTime: '2020-09-23 10:09:50',
        creator: 1,
        delFlag: '0',
        headimg:
          'http://xlr.img.vbabc.com/redis/20201208/ebe6bace06714e179c19f70ef84185d9.jpg',
        id: 11,
        intro:
          '齐志远，毕业于江西师范大学体育教育专业，2017年参加AUBA篮球训练营，2018参加南昌《要疯》赛事，同年参加江西省大学生篮球联赛以及两次参加路人王篮球赛事活动。教学经验：300节以上的u8-u12年龄大课的教学经验，教学过程中主要以鼓励孩子为主，细心且耐心，职业目标：让孩子爱上篮球。',
        label: '大班教学 细心耐心 负责 专业',
        manTime: 0,
        memberId: '',
        name: '齐教练',
        operator: 1,
        sort: 0,
        updateTime: '2020-09-23 11:29:00',
        weight: '',
      },
    ],
  },
  methods: {
    linkDetail(id) {
      this.linkPage(`/pages/teacher/detail`, { id });
    },
    linkAdd(id) {
      this.linkPage(`/pages/teacher/add`);
    },
    fetchInfo() {
      this.fetchList();
    },
    async fetchList() {
      this.isLoading = true;

      let list = [
        {
          address: '浦东新区王桥路299号（烈火篮球公园）',
          area: '310115',
          campus: '6',
          city: '310100',
          createTime: '2020-09-18 16:25:10',
          creator: 1,
          delFlag: '0',
          headimg:
            'http://xlr.img.vbabc.com/redis/20201127/6873ad52af934c48bf5ba89452dae2a5.jpg',
          id: 13,
          intro: 'BasePark倍斯篮球公园',
          locationLat: '31.207839154568',
          locationLng: '121.68736983805',
          name: '小鹿人篮球学院（川沙校区）',
          operator: 0,
          province: '310000',
          remark: '',
          status: '00',
          updateTime: '2020-11-27 14:55:29',
        },
      ];

      this.list = this.list.concat(list);

      this.isLoading = false;

      // const params = {
      //   current: this.current,
      //   size: this.size,
      // };

      // const {
      //   data: { count, data: list },
      // } = await api.GET_TEACHER_LIST(params);

      // this.list = this.list.concat(list);

      // this.isLoading = false;

      // if (count <= this.current * this.size) {
      //   this.canScroll = false;
      // }
    },
  },
  onShow() {
    // this.list = [];
    // this.reset();
    this.fetchInfo();
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
}
.btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  color: #fff;
  background: rgb(0, 217, 255);
  border-radius: 0;
  &::after {
    border: none;
  }
}
</style>

<config>
{
  navigationBarTitleText: '我的教练',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
  }
}
</config>
