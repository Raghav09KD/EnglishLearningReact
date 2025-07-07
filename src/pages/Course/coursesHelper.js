import request from "../../lib/api/request";

export const getAllCourses = () =>
  request({
    method: "get",
    url: "/admin/courses",
  });

  export const getCourseById = (id) =>
  request({
    method: "get",
    url: `/admin/courses/${id}`,
  });
