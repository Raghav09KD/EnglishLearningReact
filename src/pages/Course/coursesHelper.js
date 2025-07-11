import request from "../../lib/api/request";

export const getAllCourses = () =>
  request({
    method: "get",
    url: "/courses/getCources",
  });

export const getCourseById = (id) =>
  request({
    method: "get",
    url: `/courses/getCourse/${id}`,
  });

export const getCourseSection = (id) =>
  request({
    method: "get",
    url: `/courses/getCourse/${id}/sections-titles`,
    auth: true
  });

export const getCourseSectionDetails = (id, sectionid) =>
  request({
    method: "get",
    url: `/courses/getCourse/${id}/section/${sectionid}`,
    auth: true
  });

export const updateCourseProgress = (data) =>
  request({
    method: "post",
    url: "/courses/updateProgress",
    data: data,
    auth: true
  });

  export const getStudentProgress = () =>
  request({
    method: "get",
    url: "/admin/progress",
    auth: true
  });