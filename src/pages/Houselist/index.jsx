import React from "react"
import SeachHeader from '../../components/SeachHeader'
import { getCurrentCity } from '../../utils/index.js'
import Filter from './components/Filter'

import './houselist.scss'

export default class Houselist extends React.Component {
    state = {
        cityname: ''
    }

    async componentDidMount() {
        let city = await getCurrentCity()
        this.setState({
            cityname: city.label
        })
    }

    render() {
        return <div className="houselist">
            {/* 顶部搜索栏 */}
            <div className="seach">
                <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                <SeachHeader cityname={this.state.cityname}></SeachHeader>
            </div>

            {/* 筛选功能 */}
            <Filter></Filter>
        </div>
    }
}