import axios from 'axios'

import { BASE_URL } from './url' // 环境变量中的baseURL

/* 配置baseURL第一种方法
axios.defaults.baseURL = 'http://localhost:8080' */

// 第二种方法
let API = axios.create({
    baseURL: BASE_URL
})

export { API as axios }