
import request from "../../lib/api/request";

export const addCommentAPI = (data) =>
    request({
        method: "post",
        url: "/courseComments/add",
        data: data,
        auth: true
    });


export const fetchAllComments = (id) =>
    request({
        method: "get",
        url: `/courseComments/${id}`,
        auth: true
    });
