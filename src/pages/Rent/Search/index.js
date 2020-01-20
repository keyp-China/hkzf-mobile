import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCurrentCity } from '../../../utils/index'

import styles from './index.module.css'
import { axios } from '../../../utils/axios'

export default class Search extends Component {
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip}
        onClick={() => {
          this.onTipsClick(item)
        }}>
        {item.communityName}
      </li>
    ))
  }

  // 点击单个小区事件
  onTipsClick = (item) => {
    // 跳转并传值  
    //   下一页使用this.props.location.state接收参数
    this.props.history.push('/rent/add', {
      id: item.community,
      name: item.communityName
    })
  }

  // 值改变事件
  handleChange = async (val) => {
    this.setState({
      searchTxt: val
    })
    let { value } = await getCurrentCity()
    // 函数防抖 500毫秒后执行一次
    clearTimeout(this.timerId)
    this.timerId = setTimeout(async () => {
      let res = await axios("/area/community", {
        params: {
          id: value,
          name: val
        }
      })
      this.setState({
        tipsList: res.data.body
      })
    }, 500)

  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleChange}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
