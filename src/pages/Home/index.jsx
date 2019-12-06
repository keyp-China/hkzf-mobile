import React from "react"
import { Route } from 'react-router-dom'

// 导入antd-mobile组件
import { TabBar } from 'antd-mobile';

import Index from '../Index'
import Houselist from '../Houselist'
import News from '../News'
import Profile from '../Profile'

// 导入home样式
import './home.css'

/* tabbarItems数据 */
const tabbarItems = [
    { title: "首页", icon: "icon-ind", path: "/home/index" },
    { title: "找房", icon: "icon-findHouse", path: "/home/houselist" },
    { title: "资讯", icon: "icon-infom", path: "/home/news" },
    { title: "我的", icon: "icon-my", path: "/home/profile" }
]

export default class Home extends React.Component {
    // 官网state
    state = {
        selectedTab: '/home/index',
        hidden: false
    }

    /* tabbarItems渲染 */
    renderTabbar() {
        return tabbarItems.map(item => {
            return <TabBar.Item
                title={item.title}
                key={item.path}
                icon={<i className={`iconfont ${item.icon}`}></i>} //图标
                selectedIcon={<i className={`iconfont ${item.icon}`}></i>} //选中图标
                selected={this.state.selectedTab === item.path}
                onPress={() => { // 点击
                    this.setState({
                        selectedTab: item.path,
                    });
                    // 路由跳转
                    this.props.history.push(item.path)
                }}
            >
            </TabBar.Item>
        })
    }

    render() {
        return <div className="home">
            <Route path="/home/index" component={Index}></Route>
            <Route path="/home/houselist" component={Houselist}></Route>
            <Route path="/home/news" component={News}></Route>
            <Route path="/home/profile" component={Profile}></Route>
            <TabBar
                unselectedTintColor="#949494" //没选中颜色
                tintColor="#33A3F4" //选中的颜色
                barTintColor="white" //背景颜色
                hidden={this.state.hidden} //是否隐藏
                noRenderContent={true} //true 代表不渲染内容
            >
                {/* 循环生成tabbar */}
                {this.renderTabbar()}
            </TabBar>
        </div>
    }
}