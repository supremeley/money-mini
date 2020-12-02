// import qs from 'qs'
import lu from '@/common/utils'

class Fetch {
  constructor() {
    // this.baseUrl = 'https://xlrapi.vbabc.com/api/'
    this.baseUrl = 'https://wc.vbabc.com/api/'
    // this.baseUrl = 'https://api.lusaiyun.com/api/'
    this.header = {
      'Content-Type': 'multipart/form-data'
    }
  }

  main(url, method, data, header = {}) {
    // eslint-disable-next-line promise/param-names
    return new Promise((res, rej) => {
      wx.request({
        url: this.baseUrl + url,
        timeout: 10000,
        data,
        method,
        header: {
          ...header,
          Authorization: lu.getToken(() => this.main(url, method, data))
        },
        success: (d) => {
          if (d.statusCode !== 200) {
            rej(d)
            lu.toast(d.data.error)
          } else {
            res(d)
          }
        },
        fail: (e) => {
          rej(e)
          lu.toast(e.errMsg)
        }
      })
    })
  }

  upload(url, filePath, formData, name = 'file', header = this.header) {
    // eslint-disable-next-line promise/param-names
    return new Promise((res, rej) => {
      wx.uploadFile({
        url: this.baseUrl + url,
        filePath,
        name,
        header: {
          ...header,
          Authorization: lu.getToken()
        },
        formData,
        success: (d) => {
          if (d.statusCode !== 200) {
            lu.toast(d.data.error)
          } else {
            res(d)
          }
        },
        fail: (e) => {
          lu.toast(e.errMsg)
        }
      })
    })
  }

  async get(url, data) {
    return await this.main(url, 'GET', data)
  }

  async post(url, data) {
    return await this.main(url, 'POST', data)
  }
}

export default new Fetch()
