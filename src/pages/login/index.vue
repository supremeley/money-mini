<template>
  <view class="wrap">
    <image :src="icon.loginBg" class="bg" />
    <view class="wrap-title">您好，</view>
    <view class="wrap-title">欢迎来到鹿赛云</view>
    <view class="wrap-desc"
      >您暂未授权路塞云小程序获取您的信息，将无法正常使用小程序的功能。如需正常使用，请按次点击如下按钮，打开手机号、头像、昵称等信息的授权。</view
    >
    <view class="wrap-mobile">
      <view>{{ mobile }}</view>
      <button
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        class="wrap-mobile-btn"
      >
        获取手机号
      </button>
    </view>
    <view class="wrap-btns">
      <button
        open-type="getUserInfo"
        @getuserinfo="getuserinfo"
        class="wrap-btns-btn login"
      >
        授权登录
      </button>
      <button class="wrap-btns-btn" @click="goBack">取消登录</button>
    </view>
    <view class="wrap-explain" @click="agree">
      <view
        :class="{ 'in-circle': isAgree }"
        class="wrap-explain-circle"
      ></view>
      <view class="wrap-explain-text"
        >我已认真阅读并接受该隐私声明及用户手册</view
      >
    </view>
    <view class="footer">
      请您仔细阅读并了解我们的
      <text class="orange" @click="linkPrivacy">《隐私声明》</text>和
      <text class="orange" @click="linkAgreement">《用户手册》</text
      >，当您继续使用小程序，代表您同意并接受该说明
    </view>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import lu from '@/common/utils';

wepy.page({
  data: {
    mobile: '',
    isAgree: false,
    icon: {
      loginBg: 'https://xlr.img.vbabc.com/system/cdn/login_bg.png',
    },
  },
  computed: {},
  methods: {
    agree() {
      this.isAgree = !this.isAgree;
    },
    linkAgreement() {
      this.linkPage('/pages/agreement/index');
    },
    linkPrivacy() {
      this.linkPage('/pages/privacy/index');
    },
    async getuserinfo(e) {
      if (!this.isAgree) {
        this.toast('请同意免责说明及用户手册');
        return;
      }

      if (!this.mobile) {
        this.toast('请授权获取手机号');
        return;
      }

      const openid = wx.getStorageSync('openId');

      const params = {
        ...e.$wx.detail,
        openid,
      };

      const res = await api.GET_USERINFO(params);

      if (res.data.code === 200) {
        // const userinfo = res.data.data.info;
        // wx.setStorageSync('userinfo', userinfo);
        // wx.setStorageSync('isReg', res.data.data.reg);
        lu.login(this.goBack());
      } else {
        this.toast(res.data.msg);
      }
    },
    async getPhoneNumber(e) {
      const openid = wx.getStorageSync('openId');

      const params = {
        ...e.$wx.detail,
        openid,
      };

      const res = await api.GET_MOBILE(params);

      if (res.data.code === 200) {
        this.mobile = res.data.data.telephone;
      }
    },
  },
  created() {},
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  padding: 60rpx;
  &-title {
    font-size: 50rpx;
    font-weight: 600;
    line-height: 65rpx;

    margin-bottom: 50rpx;
  }
  &-desc {
    font-size: 24rpx;
    line-height: 30rpx;

    margin-bottom: 60rpx;

    color: #999;
  }
  &-mobile {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 70rpx;

    border-bottom: 2rpx solid #f1f1f1;
    &-btn {
      font-size: 32rpx;
      font-weight: 600;

      margin: 0;
      padding: 0;

      color: #fe7115;
      background: none;
      &::after {
        border: none;
      }
    }
  }
  &-btns {
    &-btn {
      line-height: 90rpx;

      box-sizing: border-box;
      height: 90rpx;
      margin-bottom: 30rpx;

      color: #fe7115;
      border: 2rpx solid #fe7115;
      border-radius: 45rpx;
      background: #fff;
    }
    .login {
      color: #fff;
      background: #fe7115;
    }
  }
  &-explain {
    display: flex;
    align-items: center;
    &-circle {
      box-sizing: border-box;
      width: 32rpx;
      height: 32rpx;
      margin-right: 20rpx;

      border: 2rpx solid #e5e5e5;
      border-radius: 50%;
    }
    &-text {
      font-size: 26rpx;

      color: #333;
    }
  }
}
.footer {
  font-size: 20rpx;

  position: absolute;
  bottom: 65rpx;
  left: 50%;

  width: calc(100% - 120rpx);

  transform: translate(-50%);
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
.orange {
  color: #fe7115;
}
.bg {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;

  width: 750rpx;
  height: 1334rpx;
}

</style>
