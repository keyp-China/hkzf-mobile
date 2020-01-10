import React from "react"
import SeachHeader from '../../components/SeachHeader'
import { getCurrentCity } from '../../utils/index.js'
import Filter from './components/Filter'
import { axios } from '../../utils/axios'

import './houselist.scss'

export default class Houselist extends React.Component {
    state = {
        cityname: '',
        cityid: ''
    }

    async componentDidMount() {
        let city = await getCurrentCity()
        this.setState({
            cityname: city.label,
            cityid: city.value
        })
    }

    /* houselist获取filter的值 */
    onFilter = (filters) => {
        console.log(filters);
        this.filters = filters
        this.gethouselist()
    }

    /* 获取筛选房屋数据 */
    gethouselist = async () => {
        let res = await axios('/houses', {
            cityid: this.state.cityid,
            ...this.filters,
            start: 1,
            end: 20
        })
        console.log(res);
    }

    render() {
        return <div className="houselist">
            {/* 顶部搜索栏 */}
            <div className="seach">
                <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                <SeachHeader cityname={this.state.cityname}></SeachHeader>
            </div>

            {/* 筛选功能 */}
            <Filter onFilter={this.onFilter}></Filter>
        </div>
    }
}