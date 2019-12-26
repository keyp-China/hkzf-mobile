import React from 'react'
import { NavBar, Icon } from 'antd-mobile'

// 封装的组件要使用路由 要使用withRouter包裹
import { withRouter } from 'react-router-dom'
// 校验类型
import PropTypes from 'prop-types'

import styles from './navheader.module.css' // 局部样式导入的方法

class NavHeader extends React.Component {
    render() {
        return <NavBar
            className={styles.navbar}
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go(-1)}
        >{this.props.children}</NavBar>
    }
}

// 校验children的类型必须为字符串
NavHeader.propTypes = {
    children: PropTypes.string
}

// 封住的组件路由不能使用时用withRouter
export default withRouter(NavHeader)