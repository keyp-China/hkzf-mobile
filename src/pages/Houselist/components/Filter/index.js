import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { getCurrentCity } from '../../../../utils/index.js'
import { axios } from '../../../../utils/axios.js'

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
    openType: '', // 打开的类别
    filterdata: {} // 筛选数据
  }

  componentDidMount() {
    this.getFilterData() // 获取筛选数据
  }

  /* 获取筛选数据 */
  async getFilterData() {
    let city = await getCurrentCity()
    let res = await axios(`/houses/condition?id=${city.value}`)
    this.setState({
      filterdata: res.data.body
    })
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
    let { openType, filterdata } = this.state
    /* 区域、特点、楼层、朝向、租金、方式、房间类型、地铁 */
    let { area, characteristic, floor, oriented, price, rentType, roomType, subway } = filterdata
    // 区域:area  方式:mode  租金:price
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      let data = null
      let cols = 1 // 默认一列
      switch (openType) {
        case 'area':
          data = [area, subway]
          cols = 3
          break;
        case 'mode':
          data = rentType
          break;
        case 'price':
          data = price
          break;
      }

      return <FilterPicker
        data={data} // 显示数据
        cols={cols} // 显示列数
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
