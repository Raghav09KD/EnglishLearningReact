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

export const scoreSpeechApi = (data) =>
    request({
        method: "post",
        url: `/speechPractise/score`,
        data: data,
        auth: true,
    });