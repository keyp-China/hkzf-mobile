import axios from 'axios'

/* 配置baseURL第一种方法
axios.defaults.baseURL = 'http://localhost:8080' */

// 第二种方法
let API = axios.create({
    baseURL: 'http://localhost:8080'
})

export { API as axios }