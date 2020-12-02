import Vuex from '@wepy/x'

export default new Vuex.Store({
  state: {
    students: [],
    activeId: null,
    courseDetail: {},
    location: { distancelat: 31.23, distancelong: 121.47 },
    area: { name: '上海' },
    calendar: []
  },
  mutations: {
    saveStudents(state, students) {
      state.students = students
    },
    setActiveId(state, id) {
      state.activeId = id
    },
    saveLocation(state, location) {
      state.location = location
    },
    setCourse(state, courseDetail) {
      state.courseDetail = courseDetail
    },
    setArea(state, area) {
      state.area = area
    },
    setCalendar(state, calendar) {
      state.calendar = calendar
    }
  },
  actions: {}
})
