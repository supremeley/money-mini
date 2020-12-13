<template>
  <view>
    <view class="header">
      <search @search="search" is-search></search>
      <!-- <view class="title">
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
      </view> -->
    </view>
    <view class="plate">
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
    isLoading: true,
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
    list: [
      {
        address: '浦东新区王桥路299号（烈火篮球公园）',
        area: '310115',
        campus: '6',
        city: '310100',
        createTime: '2020-09-18 16:25:10',
        creator: 1,
        delFlag: '0',
        headimg:
          'http://xlr.img.vbabc.com/redis/20201127/6873ad52af934c48bf5ba89452dae2a5.jpg',
        id: 13,
        intro: 'BasePark倍斯篮球公园',
        locationLat: '31.207839154568',
        locationLng: '121.68736983805',
        name: '小鹿人篮球学院（川沙校区）',
        operator: 0,
        province: '310000',
        remark: '',
        status: '00',
        updateTime: '2020-11-27 14:55:29',
      },
    ],
    searchStr: '',
  },
  computed: {
    ...mapState(['location', 'area']),
  },
  watch: {
    area() {
      // console.log(1);
      this.list = [];
      this.reset();
      this.fetchInfo();
    },
  },
  methods: {
    search(searchStr) {
      this.searchStr = searchStr || '';
      this.change();
    },
    change() {
      this.reset();
      this.list = [];
      this.fetchList();
    },
    // linkSearch() {
    //   this.linkPage(`/pages/search/index`);
    // },
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

    fetchInfo() {
      this.fetchList();
      // this.getVenueList();
    },
    async fetchList() {
      this.isLoading = true;

      // let params = {
      //   current: this.current,
      //   size: this.size,
      //   searchStr: this.searchStr,
      // };

      // if (this.area.code) {
      //   params.province = this.area.code;
      // } else {
      //   params = {
      //     ...params,
      //     ...this.location,
      //   };
      // }

      // if (this.value1) {
      //   params.range = this.value1;
      // }

      // if (this.value2) {
      //   params.venueId = this.value2;
      // }

      // if (this.value3) {
      //   params.desc = 'id';
      // }

      // const {
      //   data: { data: list, total },
      // } = await api.GET_INDEX_COURSES_LIST(params);

      // // console.log(data);
      let list = [
        {
          address: '浦东新区王桥路299号（烈火篮球公园）',
          area: '310115',
          campus: '6',
          city: '310100',
          createTime: '2020-09-18 16:25:10',
          creator: 1,
          delFlag: '0',
          headimg:
            'http://xlr.img.vbabc.com/redis/20201127/6873ad52af934c48bf5ba89452dae2a5.jpg',
          id: 13,
          intro: 'BasePark倍斯篮球公园',
          locationLat: '31.207839154568',
          locationLng: '121.68736983805',
          name: '小鹿人篮球学院（川沙校区）',
          operator: 0,
          province: '310000',
          remark: '',
          status: '00',
          updateTime: '2020-11-27 14:55:29',
        },
      ];

      this.list = this.list.concat(list);

      this.isLoading = false;

      // if (total <= this.current * this.size) {
      //   this.canScroll = false;
      // }
      // console.log(this.list);
    },
    // async getVenueList() {
    //   let params = {};

    //   if (this.area.code) {
    //     params.province = this.area.code;
    //   } else {
    //     params = {
    //       ...params,
    //       ...this.location,
    //     };
    //   }

    //   const {
    //     data: { total, data: list },
    //   } = await api.GET_VENUE_LIST(params);

    //   if (list.length) {
    //     let opt = list.map((item) => {
    //       return { ...item, text: item.name, value: item.id };
    //     });

    //     this.option2 = [{ text: '不限', value: null }, ...opt];
    //   } else {
    //     this.option2 = [{ text: '附近暂无场馆', disabled: true, value: null }];
    //   }
    // },
  },
  created() {
    // this.list = [];
    // this.reset();
    this.fetchInfo();
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
  z-index: 999;
  top: 0;
}
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
.plate {
  padding: 0 30rpx;
}
</style>

<config>
{
  navigationBarTitleText: '发现',
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
