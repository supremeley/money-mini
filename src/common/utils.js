import api from '@/api/index'

const getToken = (callback) => {
  try {
    const value = wx.getStorageSync('token')
    if (value) {
      return value
    } else {
      // login(callback)
      return ''
    }
  } catch (e) {
    return ''
  }
}

const login = (callback) => {
  wx.login({
    success: async (res) => {
      const data = { code: res.code }
      const result = await api.WX_LOGIN(data, {})
      if (result.data.code === 200) {
        const openId = result.data.data.openId
        wx.setStorageSync('openId', openId)
        wx.setStorageSync('isReg', result.data.data.reg)
        wx.setStorageSync('coach', result.data.data.coach)
        if (!result.data.data.userInfo) {
          wx.navigateTo({ url: '/pages/login/index' })
        } else {
          const token = result.data.data.token

          wx.setStorageSync('token', token)
        }
      }

      callback && callback()
    },
    fail: (err) => {
      console.log(err)
    }
  })
}

const toast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

export default { getToken, login, toast }
