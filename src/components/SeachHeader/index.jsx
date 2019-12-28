import React from 'react'
import { withRouter } from 'react-router-dom'
import { Flex } from 'antd-mobile';
// 校验类型
import PropTypes from 'prop-types'

import './seachheader.scss'

class SeachHeader extends React.Component {
    render() {
        return <Flex className="searchBox">
            <Flex className="searchLeft">
                <div
                    className="location"
                    onClick={() => {
                        this.props.history.push("/citylist")
                    }}
                >
                    <span>{this.props.cityname}</span>
                    <i className="iconfont icon-arrow" />
                </div>
                <div
                    className="searchFrom"
                    onClick={() => {
                        this.props.history.push("/search")
                    }}
                >
                    <i className="iconfont icon-search" />
                    <span>请输入小区或地址</span>
                </div>
            </Flex>
            <i
                className="iconfont icon-map"
                onClick={() => {
                    this.props.history.push("/map")
                }}
            />
        </Flex>
    }
}

// 校验children的类型必须为字符串
SeachHeader.propTypes = {
    cityname: PropTypes.string
}
export default withRouter(SeachHeader)