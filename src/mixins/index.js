export default {
  methods: {
    linkPage(url, opt) {
      this.$navigate(url, opt)
    },
    goBack() {
      this.$back(-1)
    },
    toast(title, icon = 'none', duration = 2000, success) {
      wx.showToast({
        title,
        icon,
        duration,
        success: () => success && success()
      })
    },
    formatTimer(time, fommat) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      switch (fommat) {
        case 'y-m-d h-m-s':
          return `${year}-${this.addZero(month)}-${this.addZero(
            day
          )} ${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(
            second
          )}`
        case 'y-m-d':
          return `${year}-${this.addZero(month)}-${this.addZero(day)}`
        case 'y-m-d h-m':
          return `${year}-${this.addZero(month)}-${this.addZero(
            day
          )} ${this.addZero(hour)}:${this.addZero(minute)}`
        default:
          return `${year}-${this.addZero(month)}-${this.addZero(
            day
          )} ${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(
            second
          )}`
      }
    },
    addZero(num) {
      if (num < 10) return `0${num}`
      return num
    }
  }
}
