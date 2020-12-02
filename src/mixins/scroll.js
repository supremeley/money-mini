export default {
  data: {
    current: 1,
    size: 10,
    count: 0,
    canScroll: true
  },

  methods: {
    reset() {
      this.current = 1
      this.canScroll = true
    },
    linkPage(url, opt) {
      this.$navigate(url, opt)
    }
  },
  onReachBottom() {
    if (this.canScroll) {
      this.current++
      this.fetchList()
    }
  }
}
