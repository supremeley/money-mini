<style lang="scss">
page {
  background: #ededed;
}
image {
  vertical-align: top;
}

</style>

<script>
import wepy from '@wepy/core';
import vuex from '@wepy/x';
import api from '@/api/index';
import mixins from '@/mixins/index';
import lu from '@/common/utils';

wepy.use(vuex);
wepy.mixin(mixins);

wepy.app({
  onLaunch() {
    this.getVersion();

    // lu. ();
  },
  methods: {
    getVersion() {
      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate);
      });

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
    },
  },
});
</script>

<config>
{
  pages: [
    'pages/home/index',
    'pages/teacher/index',
    'pages/teacher/detail',
    'pages/teacher/add',
    'pages/teacher/book',
    'pages/student/index',
    'pages/student/detail',
    'pages/student/book',
    'pages/student/add',
    'pages/login/index',
    'pages/privacy/index',
    'pages/agreement/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '找找钱',
    navigationBarTextStyle: 'black'
  },
  "tabBar": {
    "color": '#BFC0C4',
    "selectedColor": '#331212',
    "list": [
      {
        "pagePath": "pages/home/index",
        "iconPath": '/static/images/home.png',
        "selectedIconPath": '/static/images/is_home.png',
        "text": "首页"
      },
      {
        "pagePath": "pages/teacher/index",
        "iconPath": '/static/images/study.png',
        "selectedIconPath": '/static/images/is_study.png',
        "text": "教练"
      },
      {
        "pagePath": "pages/student/index",
        "iconPath": '/static/images/activity.png',
        "selectedIconPath": '/static/images/is_activity.png',
        "text": "学员"
      },
    ]
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
}
</config>
