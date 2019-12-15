/* 封装一些公共函数 */

import axios from 'axios'

// 获取当前定位城市信息
export let getCurrentCity = () => {
    // 从localStorage获取当前城市信息
    let city = JSON.parse(localStorage.getItem("my-city"))
    if (!city) {
        // 异步使用Promise处理
        return new Promise((resolve) => {
            // 通过百度地图获取当前城市
            let myCity = new window.BMap.LocalCity();
            myCity.get(async (result) => {
                // 根据城市名称获取城市详细信息
                let res = await axios.get(`http://localhost:8080/area/info?name=${result.name}`)
                localStorage.setItem("my-city", JSON.stringify(res.data.body)) // 成功先存储本地
                resolve(res.data.body) // 成功返回的数据
            });
        })
    } else {
        // 最好也返回promise对象--简写
        return Promise.resolve(city)
    }
}

