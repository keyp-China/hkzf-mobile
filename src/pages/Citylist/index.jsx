import React from "react"
import axios from "axios"

import { NavBar, Icon } from 'antd-mobile'

import './citylist.scss'

export default class Citylist extends React.Component {

    componentDidMount() {
        this.getCitylist() // 获取城市列表
    }

    /* 获取城市列表 */
    async getCitylist() {
        // 1. 获取全部城市列表
        let res = await axios.get("http://localhost:8080/area/city?level=1")
        //获取城市数据与城市索引
        let { citylist, cityindex } = this.formatCity(res.data.body)

        // 2. 获取热门城市信息
        let hotres = await axios.get("http://localhost:8080/area/hot")
        citylist.hot = hotres.data.body
        cityindex.unshift('hot')
        console.log(citylist, cityindex);

    }

    /* 格式化城市 */
    formatCity(list) {
        let citylist = {}
        // 遍历数据得到自己想要的数组
        list.forEach(item => {
            let word = item.short.substr(0, 1)
            if (!citylist[word]) {
                citylist[word] = [item]
            } else {
                citylist[word].push(item)
            }
        })
        let cityindex = Object.keys(citylist).sort() // 城市索引排序
        // 返回城市列表与城市索引数组
        return { citylist, cityindex }
    }

    render() {
        return <div className="citylist">
            {/* 头部导航栏 */}
            <NavBar
                className="navbar"
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => this.props.history.go(-1)}
            >城市列表</NavBar>
        </div>
    }
}