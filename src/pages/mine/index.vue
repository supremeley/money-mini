<template>
  <view>
    <view class="header">
      <!-- {{memberInfo.headUrl}} -->
      <image
        :src="memberInfo.headimg || icon.avatar"
        mode="aspectFill"
        class="header-avatar"
        @click="openImage"
      />
      <image :src="icon.mineBg" mode="aspectFill" class="bg" />
      <view class="header-content">
        <view class="header-info">{{ memberInfo.name || '未登录' }}</view>
        <!-- <view class="header-btn" @click="linkStudent">学员管理</view> -->
      </view>
    </view>
    <!-- <view class="option-list">
      <view class="option-list-item" @click="openPopup">
        <image :src="icon.date" class="option-list-item__icon" />
        <view class="option-list-item__title">{{
          birthday || '请输入出生日期'
        }}</view>
        <view class="option-list-item__text">出生日期</view>
      </view>
      <view class="option-list-item">
        <image :src="icon.info" class="option-list-item__icon" />
        <view class="option-list-item__title">{{
          memberInfo.age ? memberInfo.age + '岁' : ''
        }}</view>
        <view class="option-list-item__text">我的年龄</view>
      </view>
      <view class="option-list-item">
        <image :src="icon.area" class="option-list-item__icon" />
        <view class="option-list-item__title">{{
          memberInfo.recentActive
        }}</view>
        <view class="option-list-item__text">最近上课</view>
      </view>
    </view> -->
    <view class="more-list">
      <view
        v-for="item in menu"
        :key="item.title"
        class="more-list-item"
        @click="link(item.url)"
      >
        <image :src="item.icon" class="more-list-item__icon" />
        <view class="more-list-item__text">{{ item.title }}</view>
      </view>
    </view>
    <view v-if="coach" class="teacher-list">
      <view
        v-for="item in teacherMenu"
        :key="item.title"
        class="teacher-list-item"
        @click="linkPage(item.url)"
      >
        <image :src="item.icon" class="teacher-list-item__icon" />
        <view class="teacher-list-item__info">
          <text class="teacher-list-item__info-text">{{ item.title }}</text>
          <van-icon name="arrow" class="arrow" />
        </view>
      </view>
    </view>
    <van-popup :show="show" position="bottom" @close="closePopup">
      <van-datetime-picker
        type="date"
        :value="current"
        :min-date="30"
        @confirm="confirm"
        @cancel="closePopup"
      >
      </van-datetime-picker>
    </van-popup>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import { mapState, mapMutations } from '@wepy/x';
import store from '@/store';

wepy.page({
  store,
  data: {
    coach: '',
    current: new Date().getTime(),
    show: false,
    isReg: false,
    memberInfo: {},
    birthday: '',
    icon: {
      mineBg: '/static/images/mine_bg.png',
      avatar: '/static/images/avatar.png',
      date: '/static/images/date.png',
      info: '/static/images/info.png',
      area: '/static/images/area.png',
    },
    menu: [
      {
        icon: '/static/images/mine_study.png',
        title: '我的预约',
        url: '/pages/record/course/index',
      },
      {
        icon: '/static/images/mine_vacation.png',
        title: '我的教练',
        url: '/pages/teacher/index',
      },
      {
        icon: '/static/images/mine_record.png',
        title: '我的记录',
        url: '/pages/record/index/index',
      },
      // {
      //   icon: '/static/images/mine_class.png',
      //   title: '我的调课',
      //   url: '/pages/record/adjust/index',
      // },
    ],
    teacherMenu: [
      {
        icon: '/static/images/mine_course.png',
        title: '约课管理',
        url: '/pages/manager/course/index',
      },
      {
        icon: '/static/images/mine_vacations.png',
        title: '请假和调课管理',
        url: '/pages/manager/vacation/index',
      },
      {
        icon: '/static/images/mine_classes.png',
        title: '班级管理',
        url: '/pages/manager/class/index',
      },
      // {
      //   icon: '/static/images/mine_system.png',
      //   title: '学员管理',
      //   url: '/pages/manager/student/index',
      // },
    ],
  },
  computed: {
    ...mapState(['activeId', 'students']),
  },
  methods: {
    ...mapMutations(['saveStudents', 'setActiveId']),
    link(url) {
      // if (!this.students.length && url == '/pages/record/course/index') {
      //   this.toast('需要先报名课程', 'none', 2000, () =>
      //     setTimeout(() => this.linkPage(url), 2000)
      //   );
      // } else {
      this.linkPage(url);
      // }
    },
    linkStudent() {
      if (!this.students.length) {
        this.toast('需要先报名课程');
        return;
      }
      this.linkPage('/pages/student/index');
    },
    openPopup(index) {
      if (!this.students.length) {
        this.toast('需要先报名课程');
        return;
      }
      this.show = true;
    },
    closePopup() {
      this.show = false;
    },
    async confirm(e) {
      let d = this.formatTimer(e.$wx.detail);
      const params = { birthday: d };

      const {
        data: { data, code },
      } = await api.UPLOAD_BIRTHDAY(params);

      if (code === 200) {
        this.toast('更新生日成功');
        this.getUserInfoByMine();
        this.show = false;
      } else {
        this.toast(msg);
      }
    },
    openImage() {
      if (!this.students.length) {
        this.toast('需要先报名课程');
        return;
      }
      wx.chooseImage({
        count: 1,
        success: (e) => {
          const { tempFilePaths } = e;
          this.uploadImg(tempFilePaths[0]);
          this.$set(this.memberInfo, 'headimg', tempFilePaths[0]);
          wx.setStorageSync('memberInfo', this.memberInfo);
        },
      });
    },
    async uploadImg(url) {
      const params = {
        studentId: this.activeId,
      };

      const {
        data: { data, code, msg },
      } = await api.UPLOAD_IMG(url, params);

      if (code === 200) {
        this.toast('上传头像成功');
      } else {
        this.toast(msg);
      }
    },
    fetchInfo() {
      this.getUserInfoByMine();
    },
    async getUserInfoByMine() {
      const { data } = await api.GET_USERINFO_BY_MINE();

      const { activeId, students } = data.data;

      this.setActiveId(activeId);

      this.saveStudents(students);

      const memberInfo = students.find((item) => item.id == activeId);

      if (!memberInfo) {
        this.memberInfo = {};
        return;
      }

      this.memberInfo = memberInfo;
      this.birthday = this.formatTimer(
        this.memberInfo.birthday.replace(/-/g, '/'),
        'y-m-d'
      );

      wx.setStorageSync('memberInfo', memberInfo);
    },
  },
  onShow() {
    // this.isReg = wx.getStorageSync('isReg');
    // this.coach = wx.getStorageSync('coach');
    // if (!this.isReg) {
    //   this.linkPage('/pages/login/index');
    // } else {
    //   this.fetchInfo();
    // }
  },
});
</script>

<style lang="scss" scoped>
.header {
  position: relative;

  display: flex;
  align-items: center;

  box-sizing: border-box;
  width: 100%;
  height: 300rpx;
  padding: 0 40rpx;
  &-avatar {
    width: 150rpx;
    height: 150rpx;
    margin-right: 45rpx;

    border-radius: 50%;
  }
  &-content {
    color: #fff;
  }
  &-info {
    font-size: 40rpx;

    margin-bottom: 28rpx;
  }
  &-btn {
    font-size: 24rpx;
    line-height: 50rpx;

    width: 150rpx;
    height: 50rpx;

    text-align: center;

    color: #fe7115;
    border-radius: 25rpx;
    background: #fff;
  }
  .bg {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }
}
.option-list {
  display: flex;
  align-items: center;
  justify-content: space-around;

  height: 270rpx;
  margin-top: 20rpx;

  background: #fff;
  &-item {
    // flex-basis: 33%;
    flex: 1 0;

    text-align: center;
    &__icon {
      width: 50rpx;
      height: 50rpx;
      margin-bottom: 32rpx;
    }
    &__title {
      font-size: 28rpx;

      margin-bottom: 24rpx;
    }
    &__text {
      font-size: 24rpx;
    }
  }
}
.more-list {
  // display: flex;
  // align-items: center;
  // justify-content: space-evenly;
  // height: 200rpx;
  margin-top: 20rpx;
  padding: 20rpx 40rpx;

  background: #fff;
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 100rpx;
    margin-bottom: 20rpx;

    &__icon {
      width: 80rpx;
      height: 80rpx;
      margin-right: 40rpx;
    }
    &__text {
      font-size: 28rpx;

      flex: 1;
    }
  }
}
.teacher-list {
  margin: 20rpx 0;

  background: #fff;
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 100rpx;

    &__icon {
      width: 36rpx;
      height: 36rpx;
      margin: 0 24rpx;
    }
    &__info {
      font-size: 30rpx;

      display: flex;
      align-items: center;
      flex: 1;
      justify-content: space-between;

      box-sizing: border-box;
      height: 100rpx;
      padding-right: 24rpx;

      border-bottom: 2rpx solid #efefef;
      .arrow {
        color: #efefef;
      }
    }
  }
}

</style>

<config>
{
  navigationBarTitleText: '我的',
  "usingComponents": {
    "van-icon": "module:@vant/weapp/dist/icon/index",
    "van-popup": "module:@vant/weapp/dist/popup/index",
    "van-datetime-picker": "module:@vant/weapp/dist/datetime-picker/index"
  }
}
</config>
