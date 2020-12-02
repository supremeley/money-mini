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
    <div v-if="!detail.length" class="default">无预约</div>
    <!-- <button class="btn" @click="linkTeacher">预约</button> -->

    <van-popup
      position="bottom"
      :overlay="false"
      :show="showPopup"
      @close="closePopup"
    >
      <view class="popup">
        <view v-for="item in detail" :key="item.startTime" class="popup-item">
          <view class="popup-item__opt">
            <view class="popup-item__opt-title">预约教练:</view>
            <view class="popup-item__opt-desc">{{ item.teacher }}</view>
          </view>
          <view class="popup-item__opt">
            <view class="popup-item__opt-title">预约地点:</view>
            <view class="popup-item__opt-desc">{{ item.desc }}</view>
          </view>
          <view class="popup-item__opt">
            <view class="popup-item__opt-title">开始时间:</view>
            <view class="popup-item__opt-desc">{{ item.startTime }}</view>
          </view>
          <view class="popup-item__opt">
            <view class="popup-item__opt-title">结束时间:</view>
            <view class="popup-item__opt-desc">{{ item.endTime }}</view>
          </view>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import { mapState, mapMutations } from '@wepy/x';
import store from '@/store';
import api from '@/api/index';
import scroll from '@/mixins/scroll';

wepy.page({
  store,
  mixins: [scroll],
  data: {
    showPopup: false,
    title: ['一', '二', '三', '四', '五', '六', '日'],
    date: [],
    month: 0,
    year: 0,
    current: {},
    detail: [],
    fetchList: [
      {
        day: '2020-11-17',
        status: '01',
        info: [
          {
            startTime: '10:00',
            endTime: '11:00',
            teacher: 'a老师',
            address: 'xx路xx号',
            desc: 'xx体育馆',
          },
          {
            startTime: '11:00',
            endTime: '20:00',
            teacher: 'a老师',
            address: 'xx路xx号',
            desc: 'xx体育馆',
          },
        ],
      },
      {
        day: '2020-11-19',
        status: '01',
        info: [
          {
            startTime: '10:00',
            endTime: '20:00',
            teacher: 'a老师',
            address: 'xx路xx号',
            desc: 'xx体育馆',
          },
        ],
      },
    ],
  },
  computed: {
    // ...mapState(['location', 'area']),
  },
  watch: {},
  methods: {
    // ...mapMutations(['saveLocation']),
    linkTeacher(id) {
      this.linkPage(`/pages/book/index`);
    },
    closePopup() {
      this.showPopup = false;
    },
    linkDetail(type, id) {
      let url = `/pages/${type}/detail`;
      this.linkPage(url, { id });
    },
    linkSearch() {
      this.linkPage(`/pages/search/index`);
    },
    switchTab(url) {
      wx.switchTab({ url: `/pages/${url}/index` });
    },
    fetchInfo() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      this.month = month;
      this.year = year;
      this.date = [];
      this.current = this.dayHandle();
      this.init(this.year, this.month, day);
    },
    typeHandle(type) {
      switch (type) {
        case '20': // 完成   // 80 其他
          return { type: 'complete' };
        case '31': // 请假
        case '32': // 调课
          return { type: 'qingjia' };
        case '01': // 进行中
          return {
            // canSelect: true,
            type: 'jinxing',
          };
        default:
          return { type: 'qingjia' };
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

      if (this.fetchList && this.fetchList.length) {
        list = this.fetchList.map((item, index) => {
          return { ...item, ...this.dayHandle(item.day) };
        });
      }
      // console.log(list);
      for (let i = 0; i < 42; i++) {
        if (i < week - 1) {
          this.date.push({});
        }

        if (i >= week && i < mounthLength + week) {
          const current = i - week + 1;

          const item = list.find(
            (item) => item.day == current && item.month == month
          );

          let selected = false;
          if (this.current.day == current && this.current.month == month) {
            selected = true;

            if (item) {
              this.detail = item.info || {};
            }
          }

          if (item) {
            this.date.push({
              item,
              // desc,
              day: current,
              selected,
              canSelect: true,
              info: item.info,
              ...this.typeHandle(item.status),
            });
          } else {
            this.date.push({
              day: current,
              selected,
              canSelect: true,
            });
          }
          // }
        }

        if (i >= mounthLength + week - 1) {
          this.date.push({});
        }
      }
      // console.log(this.date);
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
      if (item.canSelect && !item.selected) {
        const selected = !item.selected;
        // this.$set(this.date[index], 'selected', selected);
        this.date = this.date.map((info, i) => {
          if (index == i) {
            return { ...info, selected };
          }
          return { ...info, selected: false };
        });
        console.log(item);
        // if (selected) {
        if (item.info) {
          this.detail = item.info;
          if (!this.showPopup) this.showPopup = true;
        } else {
          this.showPopup = false;
          this.detail = [];
        }
        // }
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
    // async setLocation() {
    //   const params = {
    //     ...this.loc,
    //     code: 'GEOCODE',
    //     prantId: 0,
    //   };

    //   const {
    //     data: {},
    //   } = await api.SET_LOCATION(params);
    // },
    getLocation() {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          const distancelat = res.latitude;
          const distancelong = res.longitude;
          // this.loc = ;
          this.saveLocation({ distancelat, distancelong });
          // wx.setStorageSync('location', this.loc);
        },
      });
    },
  },
  created() {
    // this.getLocation();
    this.fetchInfo();
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
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
.default {
  text-align: center;

  color: #9a9a9a;
}
.popup {
  padding: 30rpx;
  &-item {
    margin-bottom: 20rpx;
    padding: 20rpx;

    border-radius: 10rpx;
    box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, .3);

    &__opt {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 60rpx;
      &-title {
        font-size: 30rpx;
      }
      &-desc {
        font-size: 24rpx;

        color: #9a9a9a;
      }
    }
  }
}
.btn {
  font-size: 28rpx;
  line-height: 90rpx;

  position: fixed;
  right: 60rpx;
  bottom: 90rpx;

// display: flex;
  // align-items: center;
  // justify-content: center;

  width: 90rpx;
  height: 90rpx;
  padding: 0;

  color: #fff;
  border-radius: 45rpx;
  background: rgb(0, 217, 255);

  &::after {
    border: none;
  }
}

</style>

<config>
{
  usingComponents: {
    loading: '~@/components/loading',
    "van-icon": "module:@vant/weapp/dist/icon/index",
    "van-popup": "module:@vant/weapp/dist/popup/index",
  }
}
</config>
