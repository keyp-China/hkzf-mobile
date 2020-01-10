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
// PickerView的默认选中值
const selectedValue = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus, // 标题高亮状态
    selectedValue, // 默认选中的值
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
    // 点击的标题高亮 有值的标题高亮
    let { selectedValue, titleSelectedStatus } = this.state
    let newtitleSelectedStatus = { ...titleSelectedStatus }
    for (let key in newtitleSelectedStatus) { // key:area、mode、price、more
      if (key == type) {
        newtitleSelectedStatus[key] = true
        continue; // 结束本次循环 进行下次循环
      }
      let selectedVal = selectedValue[key]
      // 处理是否有值高亮判断
      newtitleSelectedStatus = this.isNullValue(key, selectedVal, newtitleSelectedStatus)
    }
    this.setState({
      titleSelectedStatus: newtitleSelectedStatus,
      openType: type
    })
  }

  /* 处理是否有值高亮判断 */
  isNullValue(key, selectedVal, newtitleSelectedStatus) {
    if (key == 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {//有值area选中
      newtitleSelectedStatus[key] = true;
    } else if (key == 'mode' && selectedVal[0] !== 'null') {//有值mode应该选中
      newtitleSelectedStatus[key] = true;
    } else if (key == "price" && selectedVal[0] !== 'null') {//有值 price应该选中
      newtitleSelectedStatus[key] = true;
    } else if (key == "more" && selectedVal.length != 0) {//more有值应该选中
      //  more要选中
    } else {
      newtitleSelectedStatus[key] = false;//没有值 不选中
    }
    return newtitleSelectedStatus
  }

  /* 渲染Picker() */
  renderPicker() {
    let { openType, filterdata, selectedValue } = this.state
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
        key={openType} // 当key值改变时组件会重新初始化更新defaultvalue
        data={data} // 显示数据
        cols={cols} // 显示列数
        defaultvalue={selectedValue[openType]} // 默认值
        type={openType}
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
  /* 渲染More */
  renderMore(){
    if(this.state.openType == 'more'){
      return <FilterMore />
    }
    return null
  }

  /* 取消函数 opentype='' */
  onCancel = (type) => {
    let { titleSelectedStatus, selectedValue } = this.state
    let newtitleSelectedStatus = { ...titleSelectedStatus }
    // 处理是否有值高亮判断
    newtitleSelectedStatus = this.isNullValue(type, selectedValue[type], newtitleSelectedStatus)
    this.setState({
      openType: '',
      titleSelectedStatus: newtitleSelectedStatus
    })
  }
  /* 确定函数 */
  onSave = (type, value) => {
    let newtitleSelectedStatus = { ...this.state.titleSelectedStatus }
    // 处理是否有值高亮判断
    newtitleSelectedStatus = this.isNullValue(type, value, newtitleSelectedStatus)
    this.setState({
      openType: '',
      selectedValue: {
        ...this.state.selectedValue,
        [type]: value
      },
      titleSelectedStatus: newtitleSelectedStatus
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
          {this.renderMore()}
        </div>
      </div>
    )
  }
}
