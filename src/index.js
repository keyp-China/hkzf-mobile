import React from 'react'
import ReactDOM from 'react-dom'

// 全局导入antd-mobile样式
import 'antd-mobile/dist/antd-mobile.css'
// 导入自己的初始化样式
import './index.css'
// 引入字体图标
import './assets/fonts/iconfont.css'

import App from './App';

ReactDOM.render(<App />, document.getElementById("root"))