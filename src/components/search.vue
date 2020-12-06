<template>
  <view class="header">
    <!-- <view class="location-container" @click="showPopup">
      <image :src="icon.location" class="location-icon" />
      <text>{{ area.name }}</text>
    </view> -->
    <view class="search-container" @click="handleClick">
      <image :src="icon.search" class="search-icon" />
      <view v-if="!isSearch" class="search-place">请输入关键字</view>
      <input
        v-else
        v-model="searchStr"
        type="text"
        placeholder="请输入手机号查找"
        confirm-type="search"
        class="search-inp"
        @confirm.stop="search"
      />
    </view>
    <van-popup :show="show" position="top" @close="cancel">
      <!-- <van-picker
        :columns="columns"
        :loading="loading"
        value-key="name"
        show-toolbar
        @confirm="confirm"
        @cancel="cancel"
      /> -->
      <view class="picker">
        <view
          v-for="item in columns"
          :key="item.name"
          class="picker-item"
          @click.stop="confirm(item)"
        >
          {{ item.name }}
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import wepy from '@wepy/core';
import { mapState, mapMutations } from '@wepy/x';
import store from '@/store';
import api from '@/api/index';

wepy.component({
  store,
  props: {
    isSearch: Boolean,
  },
  data: {
    loading: true,
    show: false,
    searchStr: '',
    columns: [
      // {
      //   values: [],
      // },
      // {
      //   values: [],
      // },
      // {
      //   values: [],
      // },
    ],
    icon: {
      search: '/static/images/search.png',
      location: '/static/images/location.png',
    },
  },
  computed: {
    ...mapState(['area']),
  },
  events: {
    // 'index-broadcast': (...args) => {
    //   let $event = args[args.length - 1]
    //   console.log(`${this.$name} receive ${$event.name} from ${$event.source.name}`)
    // }
  },
  methods: {
    ...mapMutations(['setArea']),
    // onChange(e) {
    //   const {
    //     index,
    //     value: [arr1, arr2],
    //   } = e.$wx.detail;

    //   if (index == 0) {
    //     const { code, name } = arr1;
    //     this.setLocation(1, code, true);
    //   }

    //   if (index == 1) {
    //     const { code, name } = arr2;
    //     this.setLocation(2, code, true);
    //   }
    // },
    confirm(e) {
      this.show = false;
      this.setArea(e);
    },
    cancel() {
      this.show = false;
    },
    handleClick() {
      this.$emit('link');
    },
    search() {
      this.$emit('search', this.searchStr);
    },
    async showPopup() {
      this.show = !this.show;
      if (this.show) this.getLocation();
    },
    async getLocation() {
      // const data = {
      //   code,
      // };

      const {
        data: { data: list },
      } = await api.GET_LOCATION();

      // const values = list;

      // if (values.length) {
      //   this.$set(this.columns, i, { values });
      //   if (next && i != 2) {
      //     this.setLocation(i + 1, values[0].code);
      //   }
      // }

      this.columns = list;

      this.loading = false;
    },
  },
});
</script>

<style lang="scss">
.header {
  position: sticky;
  z-index: 1;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 60rpx;
  padding: 20rpx 30rpx;

  background: #fff;
}
.picker {
  font-size: 32rpx;

  min-height: 400rpx;
  padding: 0 60rpx;

  color: #020202;
  &-item {
    display: flex;
    align-items: center;

    height: 100rpx;
    &:not(:last-child) {
      border: 2rpx solid #909090;
    }
  }
}
.location {
  &-container {
    font-size: 28rpx;

    display: flex;
    align-items: center;
    flex-shrink: 0;

    margin-right: 30rpx;
  }
  &-icon {
    width: 24rpx;
    height: 24rpx;
    margin-right: 10rpx;
  }
}
.search-place {
  line-height: 60rpx;

  color: #909090;
}
.search {
  &-container {
    font-size: 28rpx;

    display: flex;
    align-items: center;
    flex: 1;

    box-sizing: border-box;
    width: 560rpx;
    height: 60rpx;
    padding: 0 30rpx;

    border-radius: 30rpx;
    background: #eee;
  }
  &-icon {
    width: 28rpx;
    height: 28rpx;
    margin-right: 20rpx;
  }
  &-inp {
    flex: 1;
  }
}
// .area {
//   position: absolute;
//   z-index: 1;
//   top: 100%;
//   left: 0;

//   width: 100%;
// }

</style>

<config>
{
  usingComponents: {
    "van-popup": "module:@vant/weapp/dist/popup/index",
  }
}
</config>
