import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    values: [] // 选中标签集合
  }

  // 渲染标签
  renderFilters(arr) {
    // 高亮类名： styles.tagActive
    return arr.map(item => {
      // 是否高亮选中
      let isSelect = this.state.values.includes(item.value)
      return <span
        className={[styles.tag, isSelect ? styles.tagActive : ''].join(' ')}
        key={item.value}
        onClick={() => {
          this.onTagClick(item.value)
        }}
      >
        {item.label}
      </span>
    })
  }

  /* 点击标签事件 */
  onTagClick = (id) => {
    console.log(id);
    let newValues = [...this.state.values]
    let index = newValues.indexOf(id)
    if (index == -1) {
      newValues.push(id)
    } else {
      newValues.splice(index, 1)
    }
    this.setState({
      values: newValues
    })
  }

  render() {
    /* roomType, oriented, floor, characteristic */
    let { data } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(data.roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(data.oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(data.floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(data.characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} />
      </div>
    )
  }
}
