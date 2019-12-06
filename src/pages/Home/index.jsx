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

export default class Home extends React.Component {
    // 官网state
    state = {
        selectedTab: '/home/index',
        hidden: false
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
                <TabBar.Item
                    title="首页"
                    key="index"
                    icon={<i className="iconfont icon-ind"></i>} //图标
                    selectedIcon={<i className="iconfont icon-ind"></i>} //选中图标
                    selected={this.state.selectedTab === '/home/index'}
                    onPress={() => { // 点击
                        this.setState({
                            selectedTab: '/home/index',
                        });
                        // 路由跳转
                        this.props.history.push("/home/index")
                    }}
                    data-seed="logId"
                >
                </TabBar.Item>
                <TabBar.Item
                    icon={<i className="iconfont icon-findHouse"></i>}
                    selectedIcon={<i className="iconfont icon-findHouse"></i>}
                    title="找房"
                    key="findHouse"
                    selected={this.state.selectedTab === '/home/houselist'}
                    onPress={() => {
                        this.setState({
                            selectedTab: '/home/houselist',
                        });
                        this.props.history.push("/home/houselist")
                    }}
                    data-seed="logId1"
                >
                </TabBar.Item>
                <TabBar.Item
                    icon={<i className="iconfont icon-infom"></i>}
                    selectedIcon={<i className="iconfont icon-infom"></i>}
                    title="资讯"
                    key="infom"
                    selected={this.state.selectedTab === '/home/news'}
                    onPress={() => {
                        this.setState({
                            selectedTab: '/home/news',
                        });
                        this.props.history.push("/home/news")
                    }}
                >
                </TabBar.Item>
                <TabBar.Item
                    icon={<i className="iconfont icon-my"></i>}
                    selectedIcon={<i className="iconfont icon-my"></i>}
                    title="我的"
                    key="my"
                    selected={this.state.selectedTab === '/home/profile'}
                    onPress={() => {
                        this.setState({
                            selectedTab: '/home/profile',
                        });
                        this.props.history.push("/home/profile")
                    }}
                >
                </TabBar.Item>
            </TabBar>
        </div>
    }
}