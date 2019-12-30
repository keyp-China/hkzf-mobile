import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state = {
    val: this.props.defaultvalue // 选中的值
  }

  render() {
    let { onCancel, onSave, data, cols, type } = this.props
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data} value={this.state.val} cols={cols}
          onChange={(val) => {
            this.setState({
              val
            })
          }}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={onCancel}
          onSave={() => {
            onSave(type, this.state.val)
          }}
        />
      </>
    )
  }
}
