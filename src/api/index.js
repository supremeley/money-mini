import fetch from './fetch'

// 微信登录
const WX_LOGIN = (date, header) =>
  fetch.main('api_v1/wechat/auth/login', 'POST', date, header)

// 获取用户信息
const GET_USERINFO = (date) => fetch.post('api_v1/wechat/auth/info', date)

// 获取用户手机号
const GET_MOBILE = (date) => fetch.post('api_v1/wechat/auth/phone', date)

// 获取地区列表
const GET_LOCATION = (date) => fetch.get('api_v1/edu/index/regions', date)

// 获取用户手册/声明
const GET_AGREEMENT = (type) =>
  fetch.get(`api_v1/edu/educonfig/detail/${type}`)

// HOME

// 获取首页热门教练等列表
const GET_INDEX_DASH = () => fetch.get('api_v1/edu/index/dash')

// 获取首页课程列表
const GET_INDEX_COURSES_LIST = (date) =>
  fetch.get('api_v1/edu/index/courses', date)

// 获取首页历史活动列表
const GET_INDEX_ACTION_LIST = () => fetch.get('api_v1/edu/hot/history')

// COURSES

// 获取场馆列表
const GET_VENUE_LIST = (date) => fetch.get('api_v1/edu/venue/list', date)

// 获取课程详情
const GET_COURSES_DETAIL = (id, data) =>
  fetch.get(`api_v1/edu/course/info/${id}`, data)

// 获取课程内课表
const GET_COURSES_SCHEDULE = (data) =>
  fetch.get('api_v1/edu/courseschedule/list', data)

// 获取课程推荐列表
const GET_RECOMMEND_BY_COURSE = (data) =>
  fetch.get('api_v1/edu/course/relate', data)

// 获取课程教练
const GET_TEACHER_BY_COURSE = (id) => fetch.get(`api_v1/edu/coach/info/${id}`)

// ACTION

// 获取活动列表
const GET_ACTION_LIST = (data) => fetch.get('api_v1/edu/hot/list', data)

// 获取活动详情
const GET_ACTION_DETAIL = (id) => fetch.get(`api_v1/edu/hot/info/${id}`)

// MINE

// 获取我的页面详情
const GET_USERINFO_BY_MINE = () => fetch.get('api_v1/edu/profile/dash')

// 选定学员
const SWITCH_STUDENT = (id) => fetch.get(`api_v1/edu/profile/switch/${id}`)

// 上传头像
const UPLOAD_IMG = (filePath, data) =>
  fetch.upload(`api_v1/edu/profile/upload`, filePath, data)

// 更新生日
const UPLOAD_BIRTHDAY = (data) =>
  fetch.post(`api_v1/edu/profile/update/student/birthday`, data)

// TEACHER

// 获取教练列表
const GET_TEACHER_LIST = (data) => fetch.get('api_v1/edu/coach/list', data)

// 获取教练详情
const GET_TEACHER_DETAIL = (id) => fetch.get(`api_v1/edu/coach/info/${id}`)

// 获取教练推荐课程
const GET_RECOMMEND_BY_TEACHER = (data) =>
  fetch.get(`api_v1/edu/coach/courses`, data)

// VATCTION&ADJUST

// 获取学员班级
const GET_CLASS_BY_STUDENT = (data) =>
  fetch.get('api_v1/edu/profile/classset', data)

// 获取学员课程详情
const GET_CLASS_DETAIL_BY_STUDENT = (id) =>
  fetch.get(`api_v1/edu/classstudent/info/${id}`)

// 获取学员课程记录
const GET_RECORD_BY_CLASS = (data) =>
  fetch.get('api_v1/edu/classrecord/list', data)

// 申请调课/请假
const SAVE_APPOINTMENT = (data) =>
  fetch.post(`api_v1/edu/appointment/save`, data)

// 获取学员可调课/请假课程
const GET_OLD_SCHEDULE_BY_CLASS = (data) =>
  fetch.get(`api_v1/edu/profile/courseticket`, data)

// 获取学员可调课课程(可更换的课程)
const GET_NEW_SCHEDULE_BY_CLASS = (id, data) =>
  fetch.get(`api_v1/edu/profile/courseticket/${id}`, data)

// _RECORD

// 获取请假/调课列表
const GET_ADJUST_RECORD_LIST = (data) =>
  fetch.get('api_v1/edu/appointment/list', data)

// 获取上课记录列表
const GET_RECORD_LIST = (data) =>
  fetch.get('api_v1/edu/classrecord/list', data)

// 获取班级课程表
const GET_COURESE_BY_CLASS = (data) =>
  fetch.get('api_v1/edu/classschedule/listforclass', data)

// BOOK

// 预约课程
const BOOK_COURSES = (data) => fetch.post('api_v1/edu/audition/save', data)

// 获取验证码
const GET_SMS = (data) => fetch.post('api_v1/edu/index/sms/send', data)

// MANANGER

// 获取学员请假/调课列表
const GET_ADJUST_MANAGER_LIST = (data) =>
  fetch.get('api_v1/edu/profile/coach/appointments', data)

// 获取学员约课列表
const GET_COURSE_MANAGER_LIST = (data) =>
  fetch.get('api_v1/edu/profile/coach/audition', data)

// 获取学员班级列表
const GET_CLASS_MANAGER_LIST = (data) =>
  fetch.get('api_v1/edu/profile/coach/classset', data)

// 获取学员列表
const GET_STUDENT_MANAGER_LIST_BY_CLASS = (id, data) =>
  fetch.get(`api_v1/edu/profile/coach/classset/${id}/students`, data)

// 获取联系记录
const GET_AUDITIONLOG_LIST = (data) =>
  fetch.get(`api_v1/edu/auditionlog/list`, data)

// 联系学员
const SET_AUDITIONLOG = (data) =>
  fetch.post(`api_v1/edu/auditionlog/save`, data)

export default {
  WX_LOGIN,
  GET_USERINFO,
  GET_MOBILE,
  GET_LOCATION,
  GET_AGREEMENT,
  GET_INDEX_DASH,
  GET_INDEX_COURSES_LIST,
  GET_INDEX_ACTION_LIST,
  GET_VENUE_LIST,
  GET_COURSES_DETAIL,
  GET_COURSES_SCHEDULE,
  GET_RECOMMEND_BY_COURSE,
  GET_TEACHER_BY_COURSE,
  GET_ACTION_LIST,
  GET_ACTION_DETAIL,
  GET_USERINFO_BY_MINE,
  SWITCH_STUDENT,
  UPLOAD_IMG,
  UPLOAD_BIRTHDAY,
  GET_TEACHER_LIST,
  GET_TEACHER_DETAIL,
  GET_RECOMMEND_BY_TEACHER,
  GET_CLASS_BY_STUDENT,
  GET_CLASS_DETAIL_BY_STUDENT,
  GET_RECORD_BY_CLASS,
  SAVE_APPOINTMENT,
  GET_OLD_SCHEDULE_BY_CLASS,
  GET_NEW_SCHEDULE_BY_CLASS,
  GET_ADJUST_RECORD_LIST,
  GET_RECORD_LIST,
  GET_COURESE_BY_CLASS,
  BOOK_COURSES,
  GET_SMS,
  GET_ADJUST_MANAGER_LIST,
  GET_COURSE_MANAGER_LIST,
  GET_CLASS_MANAGER_LIST,
  GET_STUDENT_MANAGER_LIST_BY_CLASS,
  GET_AUDITIONLOG_LIST,
  SET_AUDITIONLOG
}
