import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

// 类组件是 this.props
// 函数组件是 参数props
export default function FilterTitle(props) {
  // 父组件获取值
  let { titleSelectedStatus, onTitleClick } = props
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map(item => {
        // 判断是否选中
        let isSelected = titleSelectedStatus[item.type]
        return <Flex.Item key={item.type}
          onClick={() => {
            // 修改title状态为高亮
            onTitleClick(item.type, true)
          }}>
          {/* 选中类名： styles.selected */}
          <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')}>
            <span>{item.title}</span>
            <i className="iconfont icon-arrow" />
          </span>
        </Flex.Item>
      })}
    </Flex>
  )
}
