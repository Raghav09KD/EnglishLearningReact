import api from "./axios";
const api_url = process.env.REACT_APP_API_URI
console.log("🚀 ~ api_url:", api_url)
console.log("🚀 ~ process.env:", process.env)

/**
 * Common Axios API call handler
 * 
 * @param {Object} options
 * @param {string} options.method - HTTP method: "get", "post", "put", "delete"
 * @param {string} options.url - URL path (relative to base)
 * @param {Object} [options.data] - Payload for POST/PUT
 * @param {Object} [options.params] - Query parameters
 * @param {boolean} [options.auth] - Whether to attach auth token
 * 
 * @returns {Promise<Object>} Response data
 */
const request = async ({ method, url, data = {}, params = {}, auth = true }) => {
  try {
    const headers = {};

    if (!auth) {
      delete api.defaults.headers.common["Authorization"];
    }
    const fullUrl = `${api_url}${url}`;
    const res = await api({
      method,
      url : fullUrl,
      data,
      params,
      headers,
    });

    return res.data;
  } catch (err) {
    console.error(`[API ERROR] ${method.toUpperCase()} ${url}`, err.response?.data || err.message);
    throw err.response?.data || { error: "Something went wrong" };
  }
};

export default request;