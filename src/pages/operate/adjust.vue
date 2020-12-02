<template>
  <view class="wrap">
    <!-- <view class="header">每个课程产品最多请假5次</view> -->
    <view class="content">
      <view class="section">
        <view class="section-header">学员姓名</view>
        <view class="section-option">
          <view class="section-option-item">
            <!-- <view class="section-option-item__circle"></view> -->
            <text class="section-option-item__text">{{ memberInfo.name }}</text>
          </view>
        </view>
        <!-- <view class="section-header">请假事由</view>
        <view class="section-inp">
          <input type="textarea" placeholder="请输入请假事由" />
        </view>-->
      </view>
      <view class="section">
        <view>
          <view class="section-header">选择课时</view>
          <view class="section-option">
            <view
              v-for="(item, index) in list"
              :key="item.name"
              class="section-option-item"
              @click="changeCurrent(index, item)"
            >
              <view
                :class="{ 'in-circle': index === current }"
                class="section-option-item__circle"
              ></view>
              <text class="section-option-item__text">{{ item.name }}</text>
              <text class="section-option-item__date">{{
                item.startTime
              }}</text>
            </view>
          </view>
          <view v-if="!list.length" class="section-desc">暂无可选课时</view>
        </view>
        <!-- <view>
          <view class="section-header">选择课时</view>
          <view class="section-option">
            <view
              v-for="item in list[current].classSchedules"
              :key="item.name"
              class="section-option-item"
              @click="changeCurrentSchedules(item)"
            >
              <view
                :class="{'in-circle': item.id === changeData.id}"
                class="section-option-item__circle"
              ></view>
              <text class="section-option-item__text">{{item.name}}</text>
            </view>
          </view>
        </view>
        <view class="section-header">原课时段</view>
        <view class="section-desc">2016-6-6</view>
        </view>-->
      </view>
      <view class="section" @click="showPopup">
        <view class="section-header">调课时段</view>
        <view class="section-desc">{{ currentSchedules || '请选择' }}</view>
        <!-- <view class="section-option">
          <view
            v-for="item  in newList"
            :key="item.name"
            class="section-option-item"
            @click="selectCourse(item.id)"
          >
            <view
              :class="{'in-circle': item.id === newscheduleId}"
              class="section-option-item__circle"
            ></view>
            <text class="section-option-item__text">{{item.name}}</text>
          </view>
        </view>-->
        <!-- <view class="section-desc">2016-6-6</view> -->
      </view>
    </view>
    <button class="btn" @click="submit">提交</button>
    <van-popup :show="show" position="bottom" closeable @close="close">
      <div class="popup-container">
        <calendar
          :info="newList"
          type="operate"
          @select="selectCourse"
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
      type: 2,
    },
    current: 0,
    currentSchedules: null,
    sourceScheduleId: null,
    newscheduleId: null,
    memberInfo: {},
    list: [],
    newList: [],
    changeData: {},
    classId: null,
  },
  methods: {
    close() {
      this.show = false;
    },
    showPopup() {
      this.show = !this.show;
      if (!this.list.length) this.toast('暂无可操作的调课课时');
    },
    changeCurrent(index, item) {
      this.current = index;
      this.changeData = item;
      this.sourceScheduleId = item.id;
      this.getNewScheduleByClass(item.id);
    },
    // changeCurrentSchedules(item) {
    //   this.changeData = item;
    //   this.sourceScheduleId = item.id;
    //   this.getNewScheduleByClass(item.id);
    // },
    selectCourse(info) {
      this.newscheduleId = info.item.id;
      this.currentSchedules = `${info.item.name} ${info.desc}`;
      this.classId = info.item.classId;
    },
    verify() {
      let msg;

      if (!this.newscheduleId) msg = '请选择调课时段';

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
        sourceScheduleId: this.sourceScheduleId,
        newscheduleId: this.newscheduleId,
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
      };

      const {
        data: { data: list },
      } = await api.GET_OLD_SCHEDULE_BY_CLASS(params);

      this.list = list.map((item) => {
        return {
          ...item,
          startTime: this.formatTimer(
            item.startTime.replace(/-/g, '/'),
            'y-m-d h-m'
          ),
        };
      });

      if (this.list.length) {
        this.changeCurrent(0, this.list[0]);
      }
    },
    async getNewScheduleByClass(id) {
      const {
        data: { data: list },
      } = await api.GET_NEW_SCHEDULE_BY_CLASS(id);

      this.newList = list.filter((item) => item.id != id && item.startTime);
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

    margin-bottom: 30rpx;
  }
  &-option {
    margin-bottom: 10rpx;
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 70rpx;
      &__circle {
        flex-shrink: 0;

        box-sizing: border-box;
        width: 32rpx;
        height: 32rpx;
        margin-right: 30rpx;

        border: 2rpx solid #bebebf;
        border-radius: 50%;
      }
      &__text {
        font-size: 30rpx;

        flex: 1;

        color: #666;
      }
      &__date {
        font-size: 30rpx;

        flex-shrink: 0;

        white-space: nowrap;

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
  navigationBarTitleText: '调课详情',
  usingComponents: {
    calendar: '~@/components/calendar',
    "van-popup": "module:@vant/weapp/dist/popup/index",
  }
}
</config>
