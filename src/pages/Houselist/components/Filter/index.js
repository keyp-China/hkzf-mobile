import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 控制FilterTitle是否高亮
const titleSelectedStatus = {
  area: false, // 区域
  mode: false, // 方式
  price: false, // 租金
  more: false // 筛选
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus // 标题高亮状态
  }

  // 修改标题状态
  changeTitleStatus = (type, status) => {
    this.setState({
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [type]: status
      }
    })
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            onTitleClick={this.changeTitleStatus}
          />

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
