<template>
  <view class="wrap">
    <!-- <image :src="icon.registerBg" class="bg" /> -->
    <view class="content">
      <view class="content-header">{{ courseDetail.name }}</view>
      <view class="content-form">
        <view class="content-form-item">
          <view class="content-form-item__title">姓名</view>
          <view class="content-form-item__content">
            <input
              v-model="form.customerName"
              type="text"
              placeholder="请输入姓名"
              placeholderClass="placeholder"
              class="content-form-item__content-inp"
            />
          </view>
        </view>
        <!-- <view class="content-form-item">
          <view class="content-form-item__title">年龄</view>
          <view class="content-form-item__content">
            <input
              v-model="form.customerAge"
              type="number"
              placeholder="请输入年龄"
              placeholderClass="placeholder"
              class="content-form-item__content-inp"
            />
          </view>
        </view> -->
        <view class="content-form-item">
          <view class="content-form-item__title">预约日期</view>
          <view
            class="content-form-item__content"
            @click="openDatePopup('date')"
          >
            <view v-if="selDate" class="content-form-item__content-inp">
              {{ selDate }}
            </view>
            <view v-else class="placeholder"> 请选择日期 </view>
          </view>
        </view>
        <view class="content-form-item">
          <view class="content-form-item__title">预约时间</view>
          <view
            class="content-form-item__content"
            @click="openDatePopup('time')"
          >
            <view v-if="selTime" class="content-form-item__content-inp">
              {{ selTime }}
            </view>
            <view v-else class="placeholder"> 请选择时间 </view>
          </view>
        </view>
      </view>
      <button class="btn" @click="submit">提交</button>
    </view>
    <van-popup position="bottom" :show="showDatePopup" @close="closeDatePopup">
      <view class="picker-title">
        <text class="picker-title__item" @click="closeDatePopup">取消</text>
        <text class="picker-title__item" @click="confirmDate">完成</text>
      </view>
      <picker-view
        v-if="popupType == 'date'"
        indicator-class="picker-label"
        class="picker-content"
        :value="[currentDIS]"
        @change="selectTime"
      >
        <picker-view-column>
          <view
            v-for="item in dateList"
            :key="item.dateStr"
            class="picker-item"
          >
            {{ item.desc }}({{ item.title }})
          </view>
        </picker-view-column>
      </picker-view>
      <picker-view
        v-if="popupType == 'time'"
        indicator-class="picker-label"
        class="picker-content"
        :value="[currentIS, currentIE]"
        @change="selectTime"
      >
        <picker-view-column>
          <view v-for="item in sTimeList" :key="item" class="picker-item">
            {{ item }}
          </view>
        </picker-view-column>
        <picker-view-column :disabled="currentIS">
          <view v-for="item in eTimeList" :key="item" class="picker-item">
            {{ item }}
          </view>
        </picker-view-column>
      </picker-view>
    </van-popup>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import { mapState } from '@wepy/x';
import store from '@/store';

wepy.page({
  store,
  data: {
    id: null,
    // name: null,
    type: null,
    showTimer: false,
    timer: null,
    timeNum: 60,
    form: {
      basis: '无基础',
      customerName: '',
      customerAge: '',
      phone: '',
      physique: '良好',
      spreadCode: '',
      smsCode: '',
    },
    showDatePopup: false,
    popupType: 'date',
    dateList: [],
    selDate: '',
    currentDateStr: '',
    currentTimeStartStr: '',
    currentTimeEndStr: '',
    currentDIS: 0,
    currentIS: 0,
    currentIE: 0,
    selDate: '',
    selTime: '',
    sTimeList: [
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
    ],
    eTimeList: [
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
    ],
    icon: {
      registerBg: 'https://xlr.img.vbabc.com/system/cdn/register_bg.png',
    },
    selectOption: [
      {
        name: '无基础',
        type: 'n',
      },
      {
        name: '有基础',
        type: 'y',
      },
    ],
    baiseOption: [
      {
        name: '良好',
        type: 'a',
      },
      {
        name: '一般',
        type: 'b',
      },
      {
        name: '较差',
        type: 'c',
      },
    ],
  },
  computed: {
    // ...mapState(['courseDetail']),
  },
  methods: {
    addZero(num) {
      if (num < 10) return `0${num}`;
      return num;
    },
    titleHandle(d) {
      let con = d;
      if (d > 7) con = d - 7;

      switch (con) {
        case 1:
          return '周一';
        case 2:
          return '周二';
        case 3:
          return '周三';
        case 4:
          return '周四';
        case 5:
          return '周五';
        case 6:
          return '周六';
        case 7:
          return '周日';
        default:
          return '';
      }
    },
    descHandle(year, month, day) {
      const d = new Date();

      d.setMonth(month);
      d.setDate(0);

      const lastDays = d.getDate();
      // console.log(year, month, day, lastDays);
      if (lastDays < day) {
        if (month == 12) {
          return {
            dateStr: `${year + 1}${this.addZero(1)}${this.addZero(
              day - lastDays
            )}`,
            desc: `${this.addZero(1)}月${this.addZero(day - lastDays)}日`,
          };
        }

        return {
          dateStr: `${year}${this.addZero(month + 1)}${this.addZero(
            day - lastDays
          )}`,
          desc: `${this.addZero(month + 1)}月${this.addZero(day - lastDays)}日`,
        };
      }

      return {
        dateStr: `${year}${this.addZero(month)}${this.addZero(day)}`,
        desc: `${this.addZero(month)}月${this.addZero(day)}日`,
      };
    },
    dateHandle() {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dd = d.getDay();

      const dateStr = `${year}${this.addZero(month)}${this.addZero(day)}`;
      const date = `${year}-${this.addZero(month)}-${this.addZero(day)}`;

      this.dateList.push({
        title: '今日',
        desc: `${this.addZero(month)}月${this.addZero(day)}日`,
        dateStr,
        date,
      });

      for (let i = 0; i < 6; i++) {
        this.dateList.push({
          title: this.titleHandle(dd + i + 1),
          ...this.descHandle(year, month, day + i + 1),
        });
      }

      this.confirmDate();

      // console.log(this.dateList);
    },
    confirmDate() {
      if (this.popupType === 'date') {
        const { desc, title, dateStr } = this.dateList[this.currentDIS];

        this.selDate = `${desc}(${title})`;

        this.currentDateStr = dateStr;
      }

      if (this.popupType === 'time') {
        if (this.currentIS > this.currentIE) {
          this.toast('结束时间必须大于开始时间');
          return;
        }

        const selSTime = this.sTimeList[this.currentIS];
        const selETime = this.eTimeList[this.currentIE];
        this.currentTimeStartStr = selSTime.split(':')[0];
        this.currentTimeEndStr = selETime.split(':')[0];

        if (selETime) {
          this.selTime = `${selSTime}-${selETime}`;
        } else {
          this.selTime = `${selSTime}`;
        }
      }

      if (this.showDatePopup) this.closeDatePopup();
    },

    closeDatePopup() {
      this.showDatePopup = false;
    },
    openDatePopup(type) {
      this.showDatePopup = true;
      this.popupType = type;
    },
    selectTime(e) {
      if (this.popupType === 'date') {
        this.currentDIS = e.$wx.detail.value[0];
      }

      if (this.popupType === 'time') {
        this.currentIS = e.$wx.detail.value[0];

        this.currentIE = e.$wx.detail.value[1];

        if (this.currentIE < this.currentIS) this.currentIE = this.currentIS;
      }
    },
    countDown() {
      this.showTimer = true;

      this.timer = setInterval(() => {
        if (this.timeNum == 0) {
          clearInterval(this.timer);
          this.showTimer = false;
          this.timeNum = 60;
        }
        this.timeNum--;
      }, 1000);
    },
    select(type, status) {
      if (type == 'select') {
        this.form.basis = status;
      }

      if (type == 'baise') {
        this.form.physique = status;
      }
    },
    verify() {
      let msg;
      if (!this.form.smsCode) msg = '请填写验证码';
      if (!this.form.phone) msg = '请填写手机号';
      if (!this.form.customerAge) msg = '请填写年龄';
      if (!this.form.customerName) msg = '请填写姓名';

      if (msg) {
        this.toast(msg);
      } else {
        return true;
      }
    },
    async getSms() {
      let msg;
      if (!this.form.phone) msg = '请填写手机号';

      if (msg) {
        this.toast(msg);
        return true;
      }

      const data = {
        mobile: this.form.phone,
      };

      const res = await api.GET_SMS(data);

      if (res.data.code === 200) {
        this.countDown();
        // this.toast(res.data.msg, 'success', 5000);
        this.toast(res.data.msg, 'none', 5000);
      } else {
        this.toast(res.data.msg, 'fail');
      }
    },
    async submit() {
      if (!this.verify()) return;

      const params = {
        ...this.form,
        courseId: this.id,
        type: this.type,
      };

      const res = await api.BOOK_COURSES(params);

      if (res.data.code === 200) {
        this.toast(res.data.msg, 'success', 2000, () =>
          setTimeout(() => wx.switchTab({ url: '/pages/mine/index' }), 2000)
        );
      } else {
        this.toast(res.data.msg, 'fail');
      }
    },
  },
  onLoad(opt) {
    this.id = opt.id;
    this.type = opt.type;
    // this.name = decodeURI(opt.name);
  },
  onShow() {
    this.dateHandle();
    console.log(this.dateList);
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.wrap {
  padding-bottom: 36rpx;
}
.bg {
  width: 100%;
  height: 520rpx;
}
.content {
  margin: 0 30rpx;
  padding: 55rpx 30rpx;

  transform: translate(0, -30rpx);

  border-radius: 10rpx;
  background: #fff;
  box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, .1);
  &-header {
    font-size: 36rpx;
    font-weight: 600;

    margin-bottom: 20rpx;
  }
}
.content-form {
  margin-bottom: 50rpx;
  &-item {
    border-bottom: 2rpx solid #ededed;
    &__title {
      font-size: 34rpx;
      line-height: 86rpx;
    }
    &__content {
      display: flex;
      align-items: center;

      height: 86rpx;
      &-inp {
        flex: 1;
      }
      &-code {
        font-size: 30rpx;

        flex-basis: 200rpx;

        text-align: center;

        color: #fe7115;
        border-left: 2rpx solid #ededed;
      }
      &-radio {
        display: flex;
        align-items: center;
        flex: 1;
        &-circle {
          box-sizing: border-box;
          width: 32rpx;
          height: 32rpx;
          margin-right: 12rpx;

          border: 2rpx solid #bebebf;
          border-radius: 50%;
        }
        &-text {
          font-size: 30rpx;

          color: #666;
        }
      }
    }
  }
}
.in-circle {
  position: relative;

  border: 2rpx solid #fe7115;
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 12rpx;
    height: 12rpx;

    content: "";
    transform: translate(-50%, -50%);

    border-radius: 50%;
    background: #fe7115;
  }
}
.btn {
  font-size: 36rpx;
  line-height: 90rpx;

  width: 630rpx;
  height: 90rpx;

  color: #fff;
  border-radius: 45rpx;
  background: #fe7115;

  &::after {
    border: none;
  }
}
.placeholder {
  font-size: 30rpx;

  color: #ccc;
}
.picker-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 80rpx;
  &__item {
    font-size: 32rpx;

    flex-basis: 120rpx;

    text-align: center;
  }
}
.picker-content {
  width: 100%;
  height: 600rpx;
}
.picker-label {
  height: 120rpx;
}
.picker-item {
  line-height: 120rpx;

  text-align: center;
}

</style>

<config>
{
  navigationBarTitleText: '预约课程',
  usingComponents: {
    "van-popup": "module:@vant/weapp/dist/popup/index",
    "van-datetime-picker": "module:@vant/weapp/dist/datetime-picker/index"
  }
}
</config>
