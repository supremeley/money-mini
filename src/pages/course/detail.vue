<template>
  <view class="container">
    <swiper
      :interval="3000"
      autoplay
      circular
      indicator-dots
      indicator-color="rgba(255,255,255,.3)"
      indicator-active-color="#fff"
      class="swiper"
    >
      <swiper-item
        v-for="item in fetchData.attachs"
        :key="item.id"
        class="swiper-item"
      >
        <image :src="item.url" mode="aspectFit" class="swiper-item__img" />
      </swiper-item>
    </swiper>
    <!-- <image :src="fetchData.headImg" mode="aspectFit" class="swiper-item__img" /> -->
    <van-tabs color="#FE7115" animated>
      <van-tab v-for="item in titleOption" :key="item.name" :title="item.name">
        <view v-if="item.type == 'detail'">
          <view class="section">
            <view class="section-header">
              <view class="section-header__title">
                <view v-if="fetchData.labels" class="section-header__title-tag">
                  {{ fetchData.labels }}
                </view>
                <view class="section-header__title-text">
                  {{ fetchData.name }}
                </view>
              </view>
            </view>
            <view class="section-content">{{ fetchData.intro }}</view>
            <view class="location">
              <view class="location-content">
                <view class="location-content__title">
                  {{ fetchData.campus }}
                </view>
                <view class="location-content__text">
                  <view v-if="fetchData.stDistance">
                    距离我{{ fetchData.stDistance }},
                  </view>
                  <view>{{ fetchData.address }}</view>
                </view>
              </view>
              <view
                class="location-btn"
                @click="linkMap(fetchData.latitude, fetchData.longitude)"
              >
                导航
              </view>
            </view>
          </view>
          <view class="content">
            <view class="content-info">
              <view class="content-info__title">所属校区</view>
              <view class="content-info__text">{{ fetchData.campus }}</view>
            </view>
            <view class="content-info">
              <view class="content-info__title">教学周期</view>
              <view class="content-info__text">
                {{ fetchData.teachingCycle }}
              </view>
            </view>
            <view class="content-info">
              <view class="content-info__title">上课时间</view>
              <view class="content-info__text">{{ fetchData.classTime }}</view>
            </view>
            <view class="content-info">
              <view class="content-info__title">教学课时</view>
              <view class="content-info__text">{{ fetchData.periods }}</view>
            </view>
          </view>
          <view class="plate">
            <view class="plate-header">
              <text class="plate-header__title">教练信息</text>
            </view>
            <view class="teacher" @click="link('teacher', teacherData.id)">
              <image
                :src="teacherData.headimg || icon.avatar"
                mode="aspectFill"
                class="teacher-img"
              />
              <view class="teacher-content">
                <view class="teacher-content__title">
                  {{ teacherData.name }}
                </view>
                <!-- <view class="teacher-content__desc">{{teacherData.manTime}}人预约</view> -->
                <view class="teacher-content__desc">
                  {{ teacherData.intro }}
                </view>
                <image
                  :src="icon.arrowCircle"
                  class="teacher-content__detail"
                />
              </view>
            </view>
          </view>
          <view v-if="recordList.length" class="plate end">
            <view class="plate-header">
              <text class="plate-header__title">往届精彩教学</text>
            </view>
            <scroll-view scroll-x class="scroll-container">
              <view
                v-for="item in recordList"
                :key="item.id"
                class="scroll-item"
                @click="link('course', item.id)"
              >
                <image
                  :src="item.headImg"
                  mode="aspectFill"
                  class="scroll-item__img"
                />
                <view class="scroll-item__text">{{ item.name }}</view>
              </view>
            </scroll-view>
          </view>
        </view>
        <view v-if="item.type == 'schedule'">
          <view v-for="item in schedule" :key="item.stage" class="schedule">
            <view class="schedule-title">{{ item.stage }}</view>
            <view class="schedule-detail">
              <view
                v-for="info in item.schedule"
                :key="info.name"
                class="schedule-detail-item"
              >
                {{ info.name }}
              </view>
            </view>
          </view>
          <default v-if="!schedule.length"></default>
        </view>
      </van-tab>
    </van-tabs>
    <view class="btn-container">
      <button class="btn" @click="linkBook">立即约课</button>
    </view>
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
    loc: {},
    type: 'detail',
    id: null,
    // source: 'list',
    fetchData: {
      address: '沪南路2418号2楼2001室（东郊百联旁二楼）',
      attachs: [],
      campus: '川沙校区',
      classTime: '9-11',
      coachId: 10,
      createTime: '2020-12-10 11:09:03',
      creator: 1,
      delFlag: '0',
      headImg: '',
      id: 69,
      intro: '',
      labels: '旗舰',
      latitude: '31.153678696876',
      longitude: '121.56386864087',
      manTime: 0,
      name: '御桥校区周六早上9-11点',
      nmDistance: '',
      operator: 1,
      periods: '40',
      remark: '',
      stDistance: '35 km',
      status: '00',
      teachingCycle: '40',
      timeRange: '',
      type: '',
      updateTime: '2020-12-10 11:21:29',
      venue: '小鹿人篮球学院（御桥校区）',
      venueId: '9',
    },
    schedule: [],
    teacherData: {
      createTime: '2020-09-21 12:01:52',
      creator: 1,
      delFlag: '0',
      headimg:
        'http://xlr.img.vbabc.com/redis/20201208/3eaab3519e824a2fa088653aa041a1da.jpg',
      id: 10,
      intro:
        '朱峰，小鹿人篮球学院院长，毕业于南京体育学院，国家篮球二级运动员，国家二级篮球裁判，五年青少年篮球培训经验，执教经验丰富，对待学员认真负责，教学专业严谨。',
      label: '专业，负责，耐心，经验丰富',
      manTime: 0,
      memberId: '1039',
      name: '朱教练',
      operator: 1,
      sort: 3,
      updateTime: '2020-12-08 15:37:50',
      weight: '',
    },
    recordList: [],
    titleOption: [
      {
        name: `课程详情`,
        type: 'detail',
      },
      {
        name: '课程目录',
        type: 'schedule',
      },
    ],
    icon: {
      arrowCircle: '/static/images/arrow_circle.png',
      avatar: '/static/images/avatar.png',
      default: '/static/images/default.png',
    },
  },
  computed: {
    ...mapState(['location']),
  },
  methods: {
    ...mapMutations(['setCourse']),
    link(type, id) {
      const url = `/pages/${type}/detail`;
      this.linkPage(url, { id });
    },
    linkMap() {
      const { latitude, longitude, address } = this.fetchData;
      if (latitude && longitude) {
        wx.openLocation({
          type: 'gcj02',
          latitude: Number(latitude) || 31.076106,
          longitude: Number(longitude) || 121.499758,
          name: this.fetchData.address,
        });
      } else {
        this.toast('本场馆地址信息不全');
      }
    },
    linkBook() {
      this.setCourse(this.fetchData);
      this.linkPage(`/pages/book/index`, {
        id: this.id,
        // name: this.fetchData.name,
        type: 'course',
      });
    },
    async fetchInfo() {
      await this.getCoursesDetail();

      this.getCoursesSchedule();

      await this.getTeacherList();

      this.getRecordList();
    },
    async getCoursesDetail() {
      const params = {
        ...this.location,
      };

      const {
        data: { data: fetchData },
      } = await api.GET_COURSES_DETAIL(this.id, params);

      let { attachs } = fetchData;

      if (!attachs.length) {
        attachs = [{ url: this.icon.default }];

        this.fetchData = { ...fetchData, attachs };
      } else {
        this.fetchData = fetchData;
      }
    },
    async getCoursesSchedule() {
      const params = {
        courseId: this.id,
      };

      const {
        data: { data: schedule },
      } = await api.GET_COURSES_SCHEDULE(params);

      let list = schedule.reduce((val, item) => {
        const result = val.find((info) => info.stage === item.stage);

        if (result) {
          result.schedule.push(item);
        } else {
          val.push({
            stage: item.stage,
            schedule: [item],
          });
        }
        return val;
      }, []);

      this.schedule = list;
    },
    async getTeacherList() {
      const {
        data: { data: teacherData },
      } = await api.GET_TEACHER_BY_COURSE(this.fetchData.coachId);

      this.teacherData = teacherData;

      wx.stopPullDownRefresh();
    },
    async getRecordList() {
      const params = {
        type: 'past',
      };

      const {
        data: { data: recordList },
      } = await api.GET_RECOMMEND_BY_COURSE(params);

      this.recordList = recordList;
    },
  },
  onLoad(opt) {
    this.id = opt.id;
    // this.source = opt.source || 'list';
  },
  onShow() {
    // this.fetchInfo();
  },
  onPullDownRefresh() {
    // this.fetchInfo();
  },
  onShareAppMessage(e) {
    return {
      title: this.fetchData.name,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 200rpx;

  background: #fff;
}
.swiper {
  box-sizing: border-box;
  width: 100%;
  height: 400rpx;
  &-item {
    width: 100%;
    height: 400rpx;
    &__img {
      width: 100%;
      height: 100%;
    }
  }
}
.swiper-item__img {
  width: 100%;
  height: 400rpx;
}
.section {
  padding: 0 30rpx;

  background: #fff;
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 100rpx;
    &__title {
      display: flex;
      overflow: hidden;
      align-items: center;
      &-tag {
        font-size: 22rpx;

        width: 60rpx;
        height: 30rpx;
        margin-right: 10rpx;

        text-align: center;

        color: #fff;
        background: #fe7115;
      }
      &-text {
        font-size: 36rpx;
        font-weight: 600;

        overflow: hidden;

        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  &-content {
    font-size: 26rpx;
    line-height: 32rpx;

    padding-bottom: 40rpx;

    color: #9a9a9a;
    border-bottom: 2rpx solid #ededed;
  }
}
.location {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 130rpx;
  &-content {
    &__title {
      font-size: 28rpx;
      font-weight: 600;
    }
    &__text {
      font-size: 24rpx;

      color: #9a9a9a;
    }
  }
  &-btn {
    font-size: 30rpx;
    font-weight: 400;
    line-height: 60rpx;

    flex-shrink: 0;

    width: 120rpx;

    text-align: center;

    color: #fe7115;
    background: #fff1e7;
  }
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  height: 264rpx;
  padding: 0 30rpx;

  border-top: 20rpx solid #ededed;
  background: #fff;
  &-info {
    display: flex;
    align-items: center;
  }
  &-info__title {
    font-size: 26rpx;

    margin-right: 40rpx;

    color: #9a9a9a;
  }
  &-info__text {
    font-size: 26rpx;
  }
}
.plate {
  padding: 40rpx 30rpx;

  border-top: 20rpx solid #ededed;
  background: #fff;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 40rpx;
    &__title {
      font-size: 36rpx;
      font-weight: 600;
      // margin-bottom: 30rpx;
    }
    &__more {
      font-size: 26rpx;

      color: #9a9a9a;
    }
  }
  &-content {
    display: flex;
    justify-content: space-between;
  }
  .list-item {
    width: 330rpx;
    padding: 40rpx 0 30rpx;

    text-align: center;

    border-radius: 10rpx;
    box-shadow: 0 10rpx 10rpx rgba(0, 0, 0, 0.1);
    &__img {
      width: 155rpx;
      height: 155rpx;
      margin-bottom: 36rpx;

      border-radius: 50%;
    }
    &__title {
      font-size: 34rpx;
      font-weight: 600;

      margin-bottom: 24rpx;
    }
    &__desc {
      font-size: 24rpx;
      line-height: 32rpx;

      display: -webkit-box;
      overflow: hidden;

      /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;

      margin-bottom: 24rpx;

      text-overflow: ellipsis;

      color: #9a9a9a;

      -webkit-line-clamp: 2;
    }
    &__detail {
      width: 56rpx;
      height: 56rpx;
    }
  }
}
.scroll-container {
  white-space: nowrap;
  .scroll-item {
    display: inline-block;

    margin-right: 20rpx;
    &__img {
      width: 270rpx;
      height: 190rpx;

      border-radius: 10rpx;
    }
  }
}
.end {
  padding-right: 0;
}
.schedule {
  padding: 30rpx 50rpx;
  &-title {
    font-size: 34rpx;
    font-weight: 600;
  }
  &-detail-item {
    font-size: 26rpx;
    line-height: 90rpx;

    text-indent: 50rpx;

    color: #666;
    border-bottom: 2rpx solid #ededed;
  }
}
.teacher {
  display: flex;
  align-items: stretch;
  &-img {
    width: 240rpx;
    height: 300rpx;
    margin-right: 30rpx;

    border-radius: 10rpx;
  }
  &-content {
    overflow: hidden;
    flex: 1;
    &__title {
      font-size: 32rpx;
      font-weight: 600;

      margin-bottom: 20rpx;
    }
    &__desc {
      font-size: 24rpx;

      display: -webkit-box;
      overflow: hidden;

      /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;

      min-height: 64rpx;
      margin-bottom: 20rpx;

      text-overflow: ellipsis;

      color: #9a9a9a;

      -webkit-line-clamp: 3;
    }
    &__detail {
      width: 56rpx;
      height: 56rpx;
    }
  }
}
.btn-container {
  position: fixed;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 60rpx 0;

  background: #fff;
}
.btn {
  font-size: 36rpx;
  line-height: 90rpx;

  // left: 50%;

  width: 630rpx;
  height: 90rpx;

  // transform: translate(-50%, 0);

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
  navigationBarTitleText: '课程详情',
  enablePullDownRefresh: true,
  usingComponents: {
    default: '~@/components/default',
    "van-tab": "module:@vant/weapp/dist/tab/index",
    "van-tabs": "module:@vant/weapp/dist/tabs/index",
  }
}
</config>
