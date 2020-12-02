<template>
  <view>
    <view class="header">
      <search @search="search" is-search></search>
      <view class="title">
        <van-dropdown-menu active-color="#fe7115" class="title">
          <van-dropdown-item
            :title="text1 || '位置区域'"
            :value="value1"
            :options="option1"
            @change="changeA"
          />
          <van-dropdown-item
            :title="text2 || '教学场馆'"
            :value="value2"
            :options="option2"
            :disabled="!option2.length"
            @change="changeB"
          />
          <van-dropdown-item
            :title="text3 || '时间排序'"
            :value="value3"
            :options="option3"
            @change="changeC"
          />
        </van-dropdown-menu>
      </view>
    </view>
    <view class="section">
      <!-- <scroll-view v-if="list.length" scroll-y class="content"> -->
      <!-- </scroll-view> -->
      <course-list
        v-for="item in list"
        :key="item.id"
        :item="item"
        @link="linkDetail"
      ></course-list>
      <loading v-if="isLoading"></loading>
      <default v-if="!isLoading && !list.length"></default>
    </view>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import api from '@/api/index';
import store from '@/store';
import { mapState } from '@wepy/x';
import scroll from '@/mixins/scroll';

wepy.page({
  store,
  mixins: [scroll],
  data: {
    isLoading: false,
    option1: [
      { text: '附近', value: '1000' },
      { text: '5km', value: '5000' },
      { text: '10km', value: '10000' },
      { text: '30km', value: '30000' },
      { text: '不限', value: null },
    ],
    option2: [],
    // option2: [{ text: '不限', value: null }],
    option3: [
      { text: '正序', value: false },
      { text: '倒序', value: true },
    ],
    text1: '',
    text2: '',
    text3: '',
    value1: null,
    value2: '',
    value3: '',
    list: [],
    searchStr: '',
    icon: {
      location: '/static/images/location.png',
    },
  },
  computed: {
    ...mapState(['location', 'area']),
  },
  watch: {
    area() {
      this.list = [];
      this.reset();
      this.fetchList();
    },
  },
  methods: {
    linkDetail(id) {
      this.linkPage(`/pages/course/detail`, { id });
    },
    changeA(e) {
      this.value1 = e.$wx.detail;
      const re = this.option1.find((item) => item.value == this.value1);
      this.text1 = re.text;
      this.change();
    },
    changeB(e) {
      this.value2 = e.$wx.detail;
      const re = this.option2.find((item) => item.value == this.value2);
      this.text2 = re.text;
      this.change();
    },
    changeC(e) {
      this.value3 = e.$wx.detail;
      const re = this.option3.find((item) => item.value == this.value3);
      this.text3 = re.text;
      this.change();
    },
    change() {
      this.reset();
      this.list = [];
      this.fetchList();
    },
    search(searchStr) {
      this.searchStr = searchStr || '';
      this.change();
    },
    async fetchList() {
      this.isLoading = true;

      let params = {
        searchStr: this.searchStr,
        current: this.current,
        size: this.size,
      };

      if (this.area.code) {
        params.province = this.area.code;
      } else {
        params = {
          ...params,
          ...this.location,
        };
      }

      if (this.value1) {
        params.range = this.value1;
      }

      if (this.value2) {
        params.venueId = this.value2;
      }

      if (this.value3) {
        params.desc = 'id';
      }

      const {
        data: { total, data: list },
      } = await api.GET_INDEX_COURSES_LIST(params);

      this.list = this.list.concat(list);

      this.isLoading = false;

      if (total <= this.current * this.size) {
        this.canScroll = false;
      }
    },

    async getVenueList() {
      let params = {};

      if (this.area.code) {
        params = {
          province: this.area.code,
        };
      } else {
        params = {
          ...params,
          ...this.location,
        };
      }

      const {
        data: { total, data: list },
      } = await api.GET_VENUE_LIST(params);

      if (list.length) {
        let opt = list.map((item) => {
          return { ...item, text: item.name, value: item.id };
        });

        this.option2 = [{ text: '不限', value: null }, ...opt];
      } else {
        this.option2 = [{ text: '附近暂无场馆', disabled: true, value: null }];
      }
    },
  },
  onShow() {
    this.fetchList();
    this.getVenueList();
  },
});
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}
.van-dropdown-menu {
  height: 100% !important;
  // border-bottom: 2rpx solid #ededed;
}
.header {
  position: sticky;
  z-index: 1;
  top: 0;
}
.section {
  // display: flex;
  // margin-top: 2rpx;
  padding: 0 30rpx;
}
// .aside {
//   flex-shrink: 0;

//   width: 180rpx;
//   height: calc(100vh - 102rpx);

//   background: #fff;
// }
// .aside-item {
//   font-weight: 500;
//   line-height: 120rpx;

//   height: 120rpx;

//   text-align: center;

//   &:not(:last-child) {
//     border-bottom: 2rpx solid #efefef;
//   }
// }
.title {
  // position: sticky;
  // z-index: 1;
  // top: 100rpx;

  height: 70rpx;

  border-bottom: 2rpx solid #ededed;
  &-item {
    font-size: 30rpx;

    display: flex;
    align-items: center;
    justify-content: center;
    &__text {
      margin-right: 10rpx;
    }
    &__arrow {
      transform: translate(0, 25%);

      border: 8rpx solid #202020;
      border-color: #202020 transparent transparent transparent;
    }
  }
}
.content {
  // flex: 1;
  box-sizing: border-box;
  height: calc(100vh - 102rpx);
  padding: 0 30rpx;
}
</style>

<config>
{
  usingComponents: {
    search: '~@/components/search',
    loading: '~@/components/loading',
    default: '~@/components/default',
    "course-list": '~@/components/course-list',
    "van-dropdown-menu": "module:@vant/weapp/dist/dropdown-menu/index",
    "van-dropdown-item": "module:@vant/weapp/dist/dropdown-item/index",
  }
}
</config>
