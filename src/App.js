import React from 'react'

// 导入 react路由
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Home from "./pages/Home"
import Citylist from "./pages/Citylist"
import Map from "./pages/Map"
import HouseDetail from "./pages/HouseDetail"
import Login from "./pages/Login"

export default class App extends React.Component {
    render() {
        return <Router>
            <div className="app">
                {/* 重定向  exact--精准匹配 */}
                <Route
                    exact
                    path="/"
                    render={() => {
                        return <Redirect to="/home/index"></Redirect>
                    }}>
                </Route>
                <Route path="/home" component={Home}></Route>
                <Route path="/citylist" component={Citylist}></Route>
                <Route path="/map" component={Map}></Route>
                <Route path="/detail/:id" component={HouseDetail}></Route>
                <Route path="/login" component={Login}></Route>
            </div>
        </Router>
    }
}