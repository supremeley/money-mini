<template>
  <view class="wrap">
    <image :src="fetchData.headimg" mode="aspectFit" class="bg" />
    <view class="content">
      <view class="content-header">{{ fetchData.name }}</view>
      <view class="content-desc">{{ fetchData.intro }}</view>
    </view>
    <view v-if="courseList.length" class="content">
      <!-- <view class="content-header">教练排课</view>
      <course-list
        v-for="item in courseList"
        :key="item.id"
        :item="item"
        @link="linkDetail"
      ></course-list> -->

      <!-- <view
        v-for="item in courseList"
        :key="item.id"
        class="list-item"
        @click="link('course', item.id)"
      >
        <image :src="item.headImg" mode="aspectFill" class="list-item__img" />
        <view class="list-item__info">
          <view class="list-item__title">{{ item.name }}</view>
          <view class="list-item__desc">{{ item.intro }}</view>
          <view class="list-item__num">{{ item.count }}人预约</view>
        </view>
      </view>-->
    </view>
    <!-- <view class="btn-container">
      <button open-type="share" class="btn">分享给朋友</button>
    </view> -->
    <button class="btn" @click="linkTeacher">预约</button>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';

wepy.page({
  data: {
    courseList: [],
    fetchData: {
      name: '',
      label: '',
      headimg: '',
      intro: '',
    },
  },
  methods: {
    linkDetail(id) {
      this.linkPage(`/pages/course/detail`, { id });
    },
    linkTeacher(id) {
      this.linkPage(`/pages/teacher/book`, { id });
    },
    fetchInfo() {
      this.getTeacherDetail();
      this.getCourseList();
    },
    async getTeacherDetail() {
      const {
        data: { data: fetchData },
      } = await api.GET_TEACHER_DETAIL(this.id);

      this.fetchData = fetchData;
    },
    async getCourseList() {
      const params = {
        type: 'hot',
        coachId: this.id,
      };

      const {
        data: { data: courseList },
      } = await api.GET_RECOMMEND_BY_TEACHER(params);

      this.courseList = courseList;
    },
  },
  onLoad(opt) {
    this.id = opt.id;
  },
  onShow() {
    this.fetchInfo();
  },
  onShareAppMessage(e) {
    return {
      title: this.fetchData.name,
    };
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.wrap {
  padding-bottom: 200rpx;
}
.bg {
  width: 100%;
  height: 410rpx;

  vertical-align: top;
}
.content {
  padding: 30rpx;
  &-header {
    font-size: 36rpx;
    font-weight: 600;

    margin: 10rpx 0;
  }
  &-desc {
    font-size: 24rpx;
    line-height: 34rpx;

    color: #9a9a9a;
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

// .list-item {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;

//   margin-bottom: 30rpx;
//   &__img {
//     flex-shrink: 0;

//     width: 270rpx;
//     height: 190rpx;
//     margin: 0;
//     margin-right: 36rpx;

//     border-radius: 10rpx;
//   }
//   &__info {
//     display: flex;
//     overflow: hidden;
//     flex: 1;
//     flex-direction: column;
//     justify-content: space-between;

//     height: 164rpx;
//   }
//   &__title {
//     font-size: 30rpx;
//     font-weight: 600;

//     overflow: hidden;

//     white-space: nowrap;
//     text-overflow: ellipsis;
//   }
//   &__desc {
//     font-size: 26rpx;

//     display: -webkit-box;
//     overflow: hidden;

// /* autoprefixer: ignore next */
//     -webkit-box-orient: vertical;

//     text-overflow: ellipsis;

//     color: #9a9a9a;

//     -webkit-line-clamp: 2;
//   }
//   &__num {
//     font-size: 24rpx;

//     color: #9a9a9a;
//   }
// }

</style>

<config>
{
  navigationBarTitleText: '学员主页',
  usingComponents: {
    "course-list": '~@/components/course-list',
  }
}
</config>
