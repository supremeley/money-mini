
<template>
  <view class="wrap">
    <view class="header">联系信息</view>
    <textarea
      v-model="content"
      placeholderClass="placeholder"
      placeholder="请输入联系内容"
      class="text"
    ></textarea>
    <button class="btn" @click="smubit">提交联系记录</button>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';

wepy.page({
  data: {
    id: null,
    name: null,
    content: '',
  },
  methods: {
    async smubit() {
      const params = {
        auditionId: this.id,
        content: this.content,
        contractName: this.name,
      };

      const { data } = await api.SET_AUDITIONLOG(params);

      if (data.code === 200) {
        this.toast(data.msg, 'success', 2000, () =>
          setTimeout(() => this.goBack(), 2000)
        );
      } else {
        this.toast(data.msg, 'fail');
      }
    },
  },
  onLoad(opt) {
    this.id = opt.id;
    this.name = decodeURI(opt.name);
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.wrap {
  padding: 30rpx;
}
.header {
  font-size: 34rpx;
  font-weight: 600;

  margin-bottom: 20rpx;
}
.text {
  width: 100%;
  height: 700rpx;
  padding: 30rpx;

  border: 2rpx solid #f4f4f4;
  border-radius: 10rpx;
}
.placeholder {
  font-size: 34rpx;

  color: #ccc;
}
.btn {
  font-size: 36rpx;
  line-height: 90rpx;

  position: fixed;
  bottom: 120rpx;
  left: 50%;

  width: 630rpx;
  height: 90rpx;

  transform: translate(-50%);

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
  navigationBarTitleText: '新增联系记录',
}
</config>
