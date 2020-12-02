<template>
  <view>
    <view class="title">
      <view class="title-item">
        <view class="title-item__circle cancel"></view>
        <text class="title-item__text">已消:</text>
        <text class="title-item__num">{{ completeNum }}</text>
      </view>
      <view class="title-item">
        <view class="title-item__circle"></view>
        <text class="title-item__text">请假:</text>
        <text class="title-item__num">{{ jiaNum }}</text>
      </view>
      <view class="title-item">
        <view class="title-item__circle jinxing"></view>
        <text class="title-item__text">剩余:</text>
        <text class="title-item__num">{{ canNum }}</text>
      </view>
    </view>
    <calendar type="show" :info="list"></calendar>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import store from '@/store';
import { mapState } from '@wepy/x';

wepy.page({
  store,
  data: {
    canNum: 0,
    jiaNum: 0,
    completeNum: 0,
    list: [],
  },
  // computed: {
  //   ...mapState(['calendar']),
  // },
  watch: {},
  methods: {
    typeHandle(type) {
      switch (type) {
        case '20': // 完成   // 80 其他
          return 'complete';
        case '31': // 请假
        case '32': // 调课
          return 'qingjia';
        case '00': // 进行中
          return 'jinxing';
        default:
          return 'qingjiaupdate';
      }
    },
    fetchData() {
      this.getScheduleList();
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

      this.list = all.map((item) => {
        return {
          ...item,
          type: this.typeHandle(item.status),
          startTime: this.formatTimer(item.startTime.replace(/-/g, '/')),
        };
      });

      let canNum = 0,
        jiaNum = 0,
        completeNum = 0;

      this.list.forEach((item) => {
        switch (item.type) {
          case 'complete':
            completeNum++;
            break;
          case 'qingjia':
            jiaNum++;
            break;
          case 'jinxing':
            canNum++;
            break;
        }
      });

      this.canNum = canNum;
      this.jiaNum = jiaNum;
      this.completeNum = completeNum;

      //   this.list = this.list.map((item) => {
      //   return {
      //     ...item,
      //     startTime: item.recordTime,
      //   };
      // });
    },
  },
  onLoad(opt) {
    this.id = opt.id;
    this.cid = opt.cid;
    this.sid = opt.sid;
  },
  onShow() {
    this.fetchData();
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-around;

  height: 140rpx;
  &-item {
    font-size: 26rpx;

    display: flex;
    align-items: center;

    color: #666;
    &__circle {
      width: 24rpx;
      height: 24rpx;
      margin-right: 10rpx;

      border-radius: 50%;
      background: #fe7115;
    }
    &__num {
      margin-left: 10rpx;

      color: #fe7115;
    }
  }
}
// .date {
//   text-align: center;
//   &-header {
//     font-size: 32rpx;
//     font-weight: 600;
//     line-height: 64rpx;
//   }
//   &-content {
//     font-size: 26rpx;

//     color: #666;
//     &__title {
//       display: flex;
//       align-items: center;
//       justify-content: space-evenly;

//       &-item {
//         line-height: 60rpx;

//         flex-basis: calc(100% / 7);
//       }
//     }
//     &__body {
//       display: flex;
//       align-items: center;
//       flex-wrap: wrap;
//       justify-content: space-evenly;

//       color: #9a9a9a;

//       &-item {
//         line-height: 60rpx;

//         display: flex;
//         flex-basis: calc(100% / 7);
//         justify-content: center;

//         text-align: center;
//         &__text {
//           width: 60rpx;

//           border-radius: 50%;
//         }
//       }
//     }
//   }
// }
.cancel {
  color: #fff;
  background: #aaa;
}
.jinxing {
  color: #fff;
  background: #1ad1a0;
}
.qingjia {
  color: #fff;
  background: #ff6c17;
}

</style>

<config>
{
  navigationBarTitleText: '课程日历',
  usingComponents: {
    calendar: '~@/components/calendar',
  }
}
</config>
