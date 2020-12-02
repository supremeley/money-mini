<template>
  <view>
    <view class="date">
      <view class="date-header">
        <van-icon name="arrow-left" @click="previous" />
        <div class="date-header-info">{{ year }}-{{ month + 1 }}</div>
        <van-icon name="arrow" class="arrow" @click="next" />
      </view>
      <view class="date-content">
        <view class="date-content__title">
          <view
            v-for="(item, index) in title"
            :key="index"
            class="date-content__title-item"
            >{{ item }}</view
          >
        </view>
        <view class="date-content__body">
          <view
            v-for="(item, index) in date"
            :key="index"
            class="date-content__body-item"
          >
            <view
              :class="{
                qingjia: item.type == 'qingjia',
                complete: item.type == 'complete',
                jinxing: item.type == 'jinxing',
                selected: item.selected,
                cont: !item.canSelect,
              }"
              class="date-content__body-item__text"
              @click="select(index, item)"
              >{{ item.day }}</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import wepy from '@wepy/core';

wepy.component({
  props: {
    info: [],
    type: 'show',
  },
  data: {
    title: ['一', '二', '三', '四', '五', '六', '日'],
    date: [],
    month: 0,
    year: 0,
  },
  watch: {
    info() {
      // console.log(this.info);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      this.month = month;
      this.year = year;
      this.date = [];
      this.init(this.year, this.month, day);
    },
  },
  methods: {
    typeHandle(type) {
      switch (type) {
        case '20': // 完成   // 80 其他
          return { canSelect: false, type: 'complete' };
        case '31': // 请假
        case '32': // 调课
          return { canSelect: false, type: 'qingjia' };
        case '00': // 进行中
          return {
            canSelect: true,
            type: 'jinxing',
          };
        default:
          return { canSelect: false, type: 'qingjia' };
      }
    },
    init(year, month, day) {
      const date = new Date();

      date.setFullYear(year);
      date.setMonth(month + 1);
      date.setDate(0);

      const mounthLength = date.getDate();

      date.setMonth(month);
      date.setDate(1);
      const week = date.getDay();

      let list = [];

      if (this.info && this.info.length) {
        list = this.info.map((item, index) => {
          return { ...item, ...this.dayHandle(item.startTime) };
        });
      }
      // console.log(list);
      for (let i = 0; i < 42; i++) {
        if (i < week - 1) {
          this.date.push({});
        }

        if (i >= week && i < mounthLength + week) {
          const current = i - week + 1;

          if (this.type == 'operate') {
            const item = list.find(
              (item) => item.day == current && item.month == month
            );
            // console.log(item)
            // list.forEach((item) => {
            // console.log(item.day == current && item.month == month)
            if (item) {
              // console.log(item)
              const desc = this.formatTimer(
                item.startTime ? item.startTime.replace(/-/g, '/') : new Date(),
                'y-m-d h-m'
              );
              this.date.push({
                item,
                desc,
                day: current,
                selected: false,
                // canSelect: true,
                ...this.typeHandle(item.status),
              });
            } else {
              this.date.push({
                day: current,
                canSelect: false,
              });
            }
            // });
            // console.log(days);
            // const days = list.map((item) => {
            //   return { day: item.day, month: item.month };
            // });
            // if (days.includes(current)) {
            //   const item = list.find(
            //     (item) => item.day == current && item.month == month
            //   );
            //   // console.log(item);
            //   this.date.push({
            //     item,
            //     day: current,
            //     desc: this.formatTimer(item.startTime),
            //     canSelect: true,
            //     selected: false,
            //   });
            // } else {
            //   this.date.push({
            //     day: current,
            //     canSelect: false,
            //   });
            // }
          }

          if (this.type == 'show') {
            const detail = list.find(
              (item) => item.day === current && item.month === month
            );
            // console.log(detail.type);
            if (detail) {
              switch (detail.type) {
                case 'qingjia':
                  this.date.push({ day: current, type: 'qingjia' });
                  break;
                case 'jinxing':
                  this.date.push({ day: current, type: 'jinxing' });
                  break;
                case 'complete':
                  this.date.push({ day: current, type: 'complete' });
                  break;
                default:
                  this.date.push({ day: current });
                  break;
              }
            } else {
              this.date.push({ day: current });
            }
          }
        }

        if (i >= mounthLength + week - 1) {
          this.date.push({
            //  day: i - mounthLength - week + 2
          });
        }
      }
      console.log(this.date);
    },
    previous() {
      if (this.month == 0) {
        this.month = 11;
        this.year--;
      } else {
        this.month--;
      }
      this.date = [];
      this.init(this.year, this.month);
    },
    next() {
      if (this.month == 11) {
        this.month = 0;
        this.year++;
      } else {
        this.month++;
      }
      this.date = [];
      this.init(this.year, this.month);
    },
    select(index, item) {
      if (item.canSelect) {
        const selected = !item.selected;
        // this.$set(this.date[index], 'selected', selected);
        this.date = this.date.map((info, i) => {
          if (index == i) {
            return { ...info, selected };
          }
          return { ...info, selected: false };
        });
        this.$emit('select', item);
      }
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
  ready() {
    // console.log(this.type);
    this.date = [];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    this.month = month;
    this.year = year;
    this.init(this.year, this.month, day);
  },
});
</script>

<style lang="scss" scoped>
.date {
  text-align: center;
  &-header {
    font-size: 32rpx;
    font-weight: 600;
    line-height: 64rpx;

    display: flex;
    align-items: center;
    justify-content: center;
    &-info {
      margin: 0 20rpx;
    }
  }
  &-content {
    font-size: 26rpx;

    color: #666;
    &__title {
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      &-item {
        line-height: 60rpx;

        flex-basis: calc(100% / 7);
      }
    }
    &__body {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-evenly;

      color: #9a9a9a;

      &-item {
        line-height: 50rpx;

        display: flex;
        align-items: center;
        flex-basis: calc(100% / 7);
        justify-content: center;

        height: 60rpx;

        text-align: center;
        &__text {
          width: 50rpx;

          border-radius: 50%;
        }
      }
    }
  }
}
.complete {
  color: #fff;
  background: #aaa;
}
.jinxing {
  color: #fff;
  background: #1ad1a0;
}
.selected {
  color: #fff;
  background: rgb(0, 217, 255);
}
.qingjia {
  color: #fff;
  background: #ff6c17;
}
.cont {
  color: rgb(235, 235, 235);
}
</style>

<config>
{
  "usingComponents": {
    "van-icon": "module:@vant/weapp/dist/icon/index"
  }
}
</config>
