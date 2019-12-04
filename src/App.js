import React from 'react'

// 导入 antd-mobile组件
import { Button } from 'antd-mobile'
// 导入 react路由
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from "./pages/Home"
import Citylist from "./pages/Citylist"

export default class App extends React.Component {
    render() {
        return <Router>
            <div>
                <Route path="/home" component={Home}></Route>
                <Route path="/citylist" component={Citylist}></Route>
            </div>
        </Router>
    }
}