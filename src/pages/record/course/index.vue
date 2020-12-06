<template>
  <view>
    <!-- <van-tabs color="#FE7115" animated sticky @change="change">
      <van-tab v-for="item in titleOption" :key="item.name" :title="item.name"> -->
    <view class="plate">
      <view
        v-for="item in list"
        :key="item.id"
        class="list-item"
        @click="
          link('record/course/detail', item.id, item.classId, item.studentId)
        "
      >
        <image
          :src="item.headimg || icon.default"
          mode="aspectFill"
          class="list-item__img"
        />
        <view class="list-item__info">
          <view class="list-item__title">{{ item.name }}</view>
          <view>
            <view class="list-item__desc">预约日期: {{ item.orderTime }}</view>
            <view class="list-item__desc">教练姓名: {{ item.teacher }}</view>
          </view>
          <view class="list-item__loc">
            <image :src="icon.locationGray" class="list-item__loc-icon" />
            <text>{{ item.location }}</text>
          </view>
        </view>
        <!-- <view v-if="type == 'course'" class="list-item__opt">
          <view
            class="list-item__opt-btn"
            @click.stop="link('operate/vacation', item.id, item.classId)"
            >请假</view
          >
          <view
            class="list-item__opt-btn"
            @click.stop="link('operate/adjust', item.id, item.classId)"
            >调课</view
          >
        </view> -->
      </view>
    </view>
    <!-- </van-tab>
    </van-tabs> -->
    <loading v-if="isLoading"></loading>
    <default v-if="!isLoading && !list.length"></default>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import scroll from '@/mixins/scroll';

wepy.page({
  mixins: [scroll],
  data: {
    isLoading: false,
    list: [
      {
        classId: 28,
        coachId: 12,
        count: null,
        courseId: 50,
        createTime: '2020-11-24 14:39:01',
        creator: 1,
        delFlag: '0',
        headimg: '',
        id: 234,
        intro: null,
        label: null,
        location: '小鹿人篮球学院（张江校区）',
        name: '9-11小班',
        operator: 1,
        orderTime: '2020-11-03 14:38:51',
        registerTime: null,
        remark: null,
        startTime: '2020-10-17 09:50:00',
        status: '00',
        studentId: 46,
        studentName: '盆友123',
        teacher: '教练123',
        updateTime: '2020-11-24 14:39:10',
        weekDay: '6',
      },
    ],
    type: 'course',
    titleOption: [
      {
        name: `课程`,
        type: 'course',
      },
      {
        name: '活动',
        type: 'activity',
      },
    ],
    icon: {
      locationGray: '/static/images/location_gray.png',
      default: '/static/images/default.png',
    },
  },
  methods: {
    change(e) {
      if (e.$wx.detail.title == '课程') {
        this.type = 'course';
      } else {
        this.type = 'activity';
      }

      this.canScroll = true;
      this.list = [];
      this.reset();
      this.fetchInfo();
    },
    link(type, id, cid, sid) {
      if (this.type == 'course') {
        let url = `/pages/${type}`;
        this.linkPage(url, { id, cid, sid });
      }
    },
    fetchInfo() {
      this.fetchList();
    },
    async fetchList() {
      this.isLoading = true;

      const params = {
        current: this.current,
        size: this.size,
        type: this.type,
      };

      let {
        data: { count, data: list },
      } = await api.GET_CLASS_BY_STUDENT(params);

      list = list.map((item) => {
        return {
          ...item,
          orderTime: item.orderTime ? item.orderTime.split(' ')[0] : null,
        };
      });

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (count <= this.current * this.size) {
        this.canScroll = false;
      }
    },
  },
  onShow() {
    // this.list = [];
    // this.reset();
    // this.fetchInfo();
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.plate {
  padding: 0 30rpx;

  border-top: 2rpx solid #eee;
  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 30rpx 0;

    border-bottom: 2rpx solid #f4f4f4;
    &__img {
      width: 180rpx;
      height: 200rpx;

// margin-right: 36rpx;

      border-radius: 10rpx;
    }
    &__info {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      height: 164rpx;
      margin: 0 20rpx;
    }
    &__title {
      font-size: 26rpx;
      font-weight: 600;
      line-height: 34rpx;

      min-height: 68rpx;
    }
    &__desc {
      font-size: 24rpx;
      line-height: 36rpx;

      color: #9a9a9a;
    }
    &__loc {
      font-size: 24rpx;

      display: flex;
      align-items: center;

      color: #9a9a9a;
      &-icon {
        width: 22rpx;
        height: 22rpx;
        margin-right: 10rpx;
      }
    }
    &__opt {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      height: 200rpx;
      &-btn {
        font-size: 30rpx;
        font-weight: 400;
        line-height: 60rpx;

        width: 120rpx;
        margin: 10rpx 0;

        text-align: center;

        color: #fe7115;
        background: #fff1e7;
      }
    }
  }
}

</style>

<config>
{
  navigationBarTitleText: '我的课程',
  usingComponents: {
    loading: '~@/components/loading',
    default: '~@/components/default',
    "van-tab": "module:@vant/weapp/dist/tab/index",
    "van-tabs": "module:@vant/weapp/dist/tabs/index",
  }
}
</config>
