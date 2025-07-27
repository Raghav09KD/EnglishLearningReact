import request from "../../../lib/api/request";

export const createSpeech = (data) =>
    request({
        method: "post",
        url: `/speechPractise/create`,
        data: data,
        auth: true,
    });

export const fetchAllSpeechPractise = () =>
    request({
        method: "get",
        url: `/speechPractise/all`,
        auth: true,
    });

export const toggleSpeechAPI = (data) =>
    request({
        method: "patch",
        url: `/speechPractise/toggleSpeech`,
        data: data,
        auth: true,
    });

export const updateSpeechRecordAPI = (data) =>
    request({
        method: "put",
        url: `/speechPractise/update`,
        data: data,
        auth: true,
    });


export const scoreSpeechApi = (data) =>
    request({
        method: "post",
        url: `/speechPractise/score`,
        data: data,
        auth: true,
    });

export const fetchProgress = (data) =>
    request({
        method: "get",
        url: `/speechPractise/progress?userId=${data?.userId}`,
        auth: true,
    });