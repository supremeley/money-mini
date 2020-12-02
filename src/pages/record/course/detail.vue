
<template>
  <view class="container">
    <view class="header">
      <view class="header-section">
        <image :src="fetchData.headimg || icon.default" mode="aspectFill" class="header-section-img" />
        <view class="header-section-content">
          <view class="header-section-content__title">{{fetchData.name}}</view>
          <view class="header-section-content__desc">{{fetchData.intro}}</view>
          <view class="header-section-content__loc">
            <image :src="icon.location" class="header-section-content__loc-icon" />
            <text>{{fetchData.location}}</text>
          </view>
        </view>
      </view>
      <view class="header-content">
        <view class="header-content-info">
          <text class="header-content-info__title">学员姓名:</text>
          <text class="header-content-info__text">{{fetchData.studentName}}</text>
        </view>
        <view class="header-content-info">
          <text class="header-content-info__title">报名日期:</text>
          <text class="header-content-info__text">{{fetchData.orderTime}}</text>
        </view>
        <view class="header-content-info">
          <text class="header-content-info__title">下单时间:</text>
          <text class="header-content-info__text">{{fetchData.orderTime}}</text>
        </view>
        <view class="header-content-info">
          <text class="header-content-info__title">支付时间:</text>
          <text class="header-content-info__text">{{fetchData.createTime}}</text>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="content-header">
        <text class="content-header__title">课程日历</text>
        <view class="content-header__more" @click="link">
          <text>查看更多</text>
          <van-icon name="arrow" />
        </view>
      </view>
      <div v-if="!steps.length" class="default">暂无未上课程</div>
      <van-steps :steps="steps" :active="active" direction="vertical" active-color="#38f" />
    </view>
    <view class="content">
      <view class="content-header">上课记录</view>
      <view class="record-list">
        <view v-for="item in list" :key="item.id" class="record-list-item">
          <view class="record-list-item__circle"></view>
          <view class="record-list-item__info">
            <view class="record-list-item__info-left">
              <view class="record-list-item__info-left-title">{{item.statusText}}</view>
              <view class="record-list-item__info-left-desc">{{item.showTime}}</view>
            </view>
            <view class="record-list-item__info-right">
              <view class="record-list-item__info-right-title">{{item.name}}</view>
              <view class="record-list-item__info-right-desc">{{item.location}}</view>
            </view>
          </view>
          <view class="record-list-item__desc">{{item.classScheduleName}}</view>
        </view>
      </view>
      <div v-if="!isLoading && !list.length" class="default">暂无上课记录</div>
      <loading v-if="isLoading"></loading>
    </view>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import scroll from '@/mixins/scroll';
import store from '@/store';
import { mapMutations } from '@wepy/x';

wepy.page({
  store,
  mixins: [scroll],
  data: {
    isLoading: true,
    id: null,
    cid: null,
    sid: null,
    fetchData: {},
    schedule: [],
    steps: [],
    list: [],
    record: [],
    icon: {
      location: '/static/images/location.png',
      default: '/static/images/default.png',
    },
  },
  methods: {
    ...mapMutations(['setCalendar']),
    link() {
      this.linkPage('/pages/calendar/index', {
        id: this.id,
        cid: this.cid,
        sid: this.sid,
      });
    },
    fetchInfo() {
      this.getCoursesDetail();
      this.fetchList();
      this.getScheduleList();
    },
    async getCoursesDetail() {
      const {
        data: { data: fetchData },
      } = await api.GET_CLASS_DETAIL_BY_STUDENT(this.id);

      this.fetchData = fetchData;
    },
    async getScheduleList() {
      const params = {
        classId: this.cid,
        studentId: this.sid,
      };

      let {
        data: {
          data: { all, recent },
        },
      } = await api.GET_COURESE_BY_CLASS(params);

      let list = recent.map((item) => {
        return {
          ...item,
          startTime: this.formatTimer(item.startTime.replace(/-/g, '/')),
        };
      });

      this.steps = list.map((item) => {
        return {
          text: `${item.name} ${item.startTime}`,
        };
      });

      this.schedule = list;
      // console.log(this.schedule);
      this.setCalendar(all);
    },
    async fetchList() {
      this.isLoading = true;

      const params = {
        classId: this.cid,
        studentId: this.sid,
        current: this.current,
        size: this.size,
      };

      let {
        data: { total, data: list },
      } = await api.GET_RECORD_BY_CLASS(params);

      list = list.map((item) => {
        return {
          ...item,
          showTime: this.formatTimer(
            item.recordTime.replace(/-/g, '/'),
            'y-m-d'
          ),
          recordTime: this.formatTimer(item.recordTime.replace(/-/g, '/')),
        };
      });

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (total <= this.current * this.size) {
        this.canScroll = false;
      }

      // if (this.current == 1) {
      //   this.steps = list.map((item) => {
      //     return {
      //       text: `上课时间${item.recordTime}`,
      //     };
      //   });
      // }
    },
  },
  onLoad(opt) {
    this.id = opt.id;
    this.cid = opt.cid;
    this.sid = opt.sid;
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
.header {
  padding: 0 30rpx;

  background: #fff;
  &-section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 30rpx 0;

    border-bottom: 2px solid #efefef;
    &-img {
      width: 180rpx;
      height: 200rpx;
      margin-right: 30rpx;

      border-radius: 10rpx;
    }
    &-content {
      flex: 1;

      height: 200rpx;
      &__title {
        font-size: 30rpx;
        font-weight: 600;
      }
      &__desc {
        font-size: 24rpx;
        line-height: 32rpx;

        margin-bottom: 20rpx;

        color: #9a9a9a;
      }
      &__loc {
        font-size: 24rpx;

        display: flex;
        align-items: center;

        color: #9a9a9a;
        &-icon {
          width: 30rpx;
          height: 30rpx;
          margin-right: 10rpx;
        }
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    height: 264rpx;
    padding: 0 30rpx;

    &-info__title {
      font-size: 26rpx;

      margin-right: 40rpx;

      color: #9a9a9a;
    }
    &-info__text {
      font-size: 26rpx;
    }
  }
}

.content {
  margin-top: 20rpx;
  padding: 40rpx 30rpx;

  background: #fff;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 20rpx;
    &__title {
      font-size: 36rpx;
      font-weight: 600;
    }
    &__more {
      font-size: 26rpx;

      display: flex;
      align-items: center;

      color: #9a9a9a;
    }
  }
  // &-title {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   &-item {
  //     font-size: 26rpx;

  //     display: flex;
  //     align-items: center;

  //     color: #666;
  //     &__circle {
  //       width: 24rpx;
  //       height: 24rpx;
  //       margin-right: 10rpx;

  //       border-radius: 50%;
  //       background: #fe7115;
  //     }
  //     &__num {
  //       margin-left: 10rpx;

  //       color: #fe7115;
  //     }
  //   }
  // }
  .list-item {
    width: 330rpx;
    padding: 40rpx 0 30rpx;

    text-align: center;

    border-radius: 10rpx;
    box-shadow: 0 10rpx 10rpx rgba(0, 0, 0, .1);
    &__img {
      width: 155rpx;
      height: 155rpx;
      margin-bottom: 36rpx;

      border-radius: 50%;
    }
    &__title {
      font-size: 34rpx;
      font-weight: 600;
    }
    &__desc {
      font-size: 24rpx;

      margin: 24rpx 0;

      color: #9a9a9a;
    }
    &__detail {
      width: 56rpx;
      height: 56rpx;
    }
  }
}
.date {
  &-header {
    font-size: 32rpx;
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;

    margin: 20rpx 0;
  }
  &-list {
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-around;

      height: 70rpx;
      margin-bottom: 26rpx;

      text-align: center;

      border-radius: 35rpx;
      box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, .1);
      &__title {
        font-size: 26rpx;

        color: #666;
      }
      &__first {
        font-size: 24rpx;
        line-height: 45rpx;

        box-sizing: border-box;
        width: 45rpx;
        height: 45rpx;

        color: #fff;
        border-radius: 50%;
        background: #fe7115;
      }
      &__circle {
        font-size: 24rpx;
        line-height: 41rpx;

        box-sizing: border-box;
        width: 45rpx;
        height: 45rpx;

        color: #d8d8d8;
        border: 2rpx solid #d8d8d8;
        border-radius: 50%;
      }
    }
  }
}
.record-list {
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    // height: 136rpx;
    padding: 20rpx 24rpx;

    border-radius: 10rpx;
    box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
    &:not(:last-child) {
      margin-bottom: 10rpx;
    }
    &__circle {
      flex-shrink: 0;

      width: 14rpx;
      height: 14rpx;
      margin-right: 20rpx;

      border-radius: 50%;
      background: #fe7115;
    }
    &__desc {
      flex-shrink: 0;
      font-size: 24rpx;

      // color: #9a9a9a;
    }
    &__info {
      display: flex;
      align-items: center;
      flex: 1;

      &-left {
        position: relative;

        padding-right: 20rpx;

        text-align: right;
        &-title {
          font-size: 28rpx;

          margin-bottom: 20rpx;
        }
        &-desc {
          font-size: 24rpx;

          white-space: nowrap;

          color: #9a9a9a;
        }
        &::before {
          position: absolute;
          top: 50%;
          right: 0;

          width: 2rpx;
          height: 50rpx;

          content: '';
          transform: translate(-50%, -50%);

          background: #f4f4f4;
        }
      }
      &-right {
        padding-left: 20rpx;

        text-align: left;
        &-title {
          font-size: 26rpx;
          font-weight: 600;

          margin-bottom: 20rpx;
        }
        &-desc {
          font-size: 24rpx;

          color: #9a9a9a;
        }
      }
    }
  }
}
.default {
  font-size: 24rpx;

  color: #9a9a9a;
}

</style>

<config>
{
  navigationBarTitleText: '课程信息',
  "usingComponents": {
    loading: '~@/components/loading',
    default: '~@/components/default',
    "van-icon": "module:@vant/weapp/dist/icon/index",
    "van-steps": "module:@vant/weapp/dist/steps/index"
  }
}
</config>
