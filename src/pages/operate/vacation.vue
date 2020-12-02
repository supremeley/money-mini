
<template>
  <view class="wrap">
    <view class="header">每个课程产品最多请假5次</view>
    <view class="content">
      <view class="section">
        <view class="section-header">学员姓名</view>
        <view class="section-option">
          <view class="section-option-item">
            <!-- <view class="section-option-item__circle"></view> -->
            <text class="section-option-item__text">{{ memberInfo.name }}</text>
          </view>
        </view>
        <view class="section-header">请假事由</view>
        <view class="section-inp">
          <input
            v-model="form.content"
            type="textarea"
            placeholder="请输入请假事由"
          />
        </view>
      </view>
      <view class="section">
        <!-- <view>
          <view class="section-header">选择课程</view>
          <view class="section-option">
            <view
              v-for="(item, index) in list"
              :key="item.name"
              class="section-option-item"
              @click="changeCurrent(index, item.id)"
            >
              <view :class="{'in-circle': index === current}" class="section-option-item__circle"></view>
              <text class="section-option-item__text">{{item.name}}</text>
            </view>
          </view>
        </view>-->
        <view @click="showPopup">
          <view class="section-header">选择课时</view>
          <view class="section-desc">{{ currentSchedules || '请选择' }}</view>
        </view>
        <!-- <view class="section-option">
          <view
            v-for="(item, index) in list[current].classSchedules"
            :key="item.name"
            class="section-option-item"
            @click="changeCurrentSchedules(index, item.id)"
          >
            <view
              :class="{'in-circle': index === currentSchedules}"
              class="section-option-item__circle"
            ></view>
            <text class="section-option-item__text">{{item.name}}</text>
          </view>
        </view>-->
      </view>
    </view>
    <button class="btn" @click="submit">提交</button>
    <van-popup :show="show" position="bottom" closeable @close="close">
      <div class="popup-container">
        <calendar
          :info="list"
          type="operate"
          @select="selectSchedules"
        ></calendar>
        <button class="confirm-btn" @click="close">确定</button>
      </div>
    </van-popup>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';

wepy.page({
  data: {
    id: null,
    cid: null,
    show: false,
    form: {
      // id: '',
      content: '',
      type: 1,
    },
    current: 0,
    // currentSchedules: null,
    currentSchedules: null,
    memberInfo: {},
    list: [],
    changeData: {},
    classId: null,
  },
  methods: {
    close() {
      this.show = false;
    },
    showPopup() {
      this.show = !this.show;
      if (!this.list.length) this.toast('暂无可操作的请假课时');
    },
    changeCurrent(index, id) {
      this.current = index;
      // this.$set(this.form, 'id', id);
    },
    selectSchedules(item) {
      // console.log(item);
      this.changeData = item.item;
      // this.currentSchedules = item.desc;
      this.currentSchedules = `${item.item.name} ${item.desc}`;
      this.classId = item.item.classId;
      // console.log(item);
    },
    verify() {
      let msg;

      if (!this.form.content) msg = '请填写请假事由';

      if (!Object.keys(this.changeData).length) msg = '请选择课时';

      if (msg) {
        this.toast(msg);
      } else {
        return true;
      }
    },
    async submit() {
      if (!this.verify()) return;

      const params = {
        ...this.form,
        ...this.changeData,
        studentId: this.memberInfo.id,
        sourceScheduleId: this.changeData.id,
        courseId: this.id,
        classId: this.cid,
      };

      const res = await api.SAVE_APPOINTMENT(params);

      if (res.data.code === 200) {
        this.toast(res.data.msg, 'success', 2000, () =>
          setTimeout(() => this.goBack(), 2000)
        );
      } else {
        this.toast(res.data.msg, 'fail');
      }
    },
    fetchInfo() {
      this.getScheduleByClass();
      this.memberInfo = wx.getStorageSync('memberInfo');
    },
    async getScheduleByClass() {
      const params = {
        classId: this.cid,
        // type: '1'
      };

      const {
        data: { data: list },
      } = await api.GET_OLD_SCHEDULE_BY_CLASS(params);

      this.list = list;
    },
  },
  onLoad(opt) {
    this.id = opt.id;
    this.cid = opt.cid;
  },
  onShow() {
    this.fetchInfo();
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.wrap {
  padding-bottom: 240rpx;
}
.header {
  font-size: 32rpx;
  line-height: 80rpx;

  height: 80rpx;

  text-align: center;

  color: #ed2b3d;
  background: #fde9eb;
}
.content {
  padding: 0 30rpx;
}
.section {
  padding: 30rpx 16rpx;

  border-bottom: 2rpx solid #ededed;
  &-header {
    font-size: 34rpx;
    font-weight: 600;

    margin-bottom: 24rpx;
  }
  &-option {
    margin-bottom: 20rpx;
    &-item {
      display: flex;
      align-items: center;

      height: 70rpx;
      &__circle {
        box-sizing: border-box;
        width: 32rpx;
        height: 32rpx;
        margin-right: 30rpx;

        border: 2rpx solid #bebebf;
        border-radius: 50%;
      }
      &__text {
        font-size: 30rpx;

        color: #666;
      }
    }
  }
  &-desc {
    font-size: 30rpx;
    line-height: 1.5;

    color: #666;
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
.in-circle {
  position: relative;

  border: 2rpx solid #fe7115;
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 12rpx;
    height: 12rpx;

    content: '';
    transform: translate(-50%, -50%);

    border-radius: 50%;
    background: #fe7115;
  }
}
.popup {
  &-container {
    box-sizing: border-box;

    // height: 500rpx;
    padding: 30rpx;

    border-radius: 20rpx 20rpx 0 0;
    background: #fff;
  }
}
.confirm-btn {
  font-size: 36rpx;
  line-height: 90rpx;

  width: 630rpx;
  height: 90rpx;
  margin: 40rpx;

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
  navigationBarTitleText: '请假详情',
  usingComponents: {
    calendar: '~@/components/calendar',
    "van-popup": "module:@vant/weapp/dist/popup/index",
  }
}
</config>
