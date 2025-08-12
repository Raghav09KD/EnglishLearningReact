import request from "../../lib/api/request";

export const getAllListeningCourse = () => request({
  method: "get",
  url: `/voicePractise/getAllListeningCourse`,
  auth: true,
})

export const getAllListeningCourseDetails = (id) => request({
  method: "get",
  url: `/voicePractise/getDetails/${id}`,
  auth: true,
})

export const updateProgress = (progress) => request({
  method: "post",
  url: `/voicePractise/updateProgress`,
  auth: true,
  data: progress
})

export const fetchListeningProgress = (data) =>
  request({
    method: "get",
    url: `/voicePractise/viewProgress`,
    auth: true,
  });
