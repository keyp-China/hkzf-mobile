import axios from 'axios'

import { BASE_URL } from './url' // 环境变量中的baseURL
import { getToken } from '.';

/* 配置baseURL第一种方法
axios.defaults.baseURL = 'http://localhost:8080' */

// 第二种方法
let API = axios.create({
    baseURL: BASE_URL
})

/* 请求拦截器 */
API.interceptors.request.use((config) => {
    if (config.url.startsWith('/user')
        && !config.url.startsWith('/user/login')
        && !config.url.startsWith('/user/registered')) {
        config.headers['authorization'] = getToken()
    }
    return config
})

export { API as axios }