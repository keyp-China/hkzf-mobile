import React from 'react'

// 导入 react路由
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Home from "./pages/Home"
import Citylist from "./pages/Citylist"
import Map from "./pages/Map"
import HouseDetail from "./pages/HouseDetail"
import Login from "./pages/Login"
import AuthRoute from './components/AuthRoute'
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

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
                {/* 鉴权路由 权限控制 未登录跳转到登录页 */}
                <AuthRoute path='/rent' exact={true}> 
                    <Rent></Rent>
                </AuthRoute>
                <AuthRoute path='/rent/add' exact={true}> 
                    <RentAdd></RentAdd>
                </AuthRoute>
                <AuthRoute path='/rent/search' exact={true}> 
                    <RentSearch></RentSearch>
                </AuthRoute>
            </div>
        </Router>
    }
}