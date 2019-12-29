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
    titleSelectedStatus, // 标题高亮状态
    openType: '' // 打开的类别
  }

  // 点击标题状态
  onTitleClick = (type) => {
    this.setState({
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [type]: true
      },
      openType: type
    })
  }

  /* 渲染Picker() */
  renderPicker() {
    let { openType } = this.state
    // 区域:area  方式:mode  租金:price
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return <FilterPicker
        onCancel={this.onCancel}
        onSave={this.onSave}
      />
    }
    return null
  }
  /* Picker渲染是的遮罩层 */
  renderMask() {
    let { openType } = this.state
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return <div className={styles.mask} />
    }
    return null
  }
  /* 取消函数 opentype='' */
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }
  /* 确定函数 */
  onSave = () => {
    this.setState({
      openType: ''
    })
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            onTitleClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}
          {this.renderPicker()}


          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
