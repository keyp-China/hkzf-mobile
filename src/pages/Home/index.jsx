import React from "react"
import { Route } from 'react-router-dom'

// 导入antd-mobile组件
import { TabBar } from 'antd-mobile';

import News from '../News'

export default class Home extends React.Component {
    // 官网state
    state = {
        selectedTab: 'blueTab',
        hidden: false
    }
    // 官网 renderContent 函数  渲染的内容
    renderContent(pageText) {
        return (
            <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
                <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
                <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                            hidden: !this.state.hidden,
                        });
                    }}
                >
                    Click to show/hide tab-bar
            </a>
                <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                            fullScreen: !this.state.fullScreen,
                        });
                    }}
                >
                    Click to switch fullscreen
            </a>
            </div>
        );
    }

    render() {
        return <div>
            <TabBar
                unselectedTintColor="#949494" //没选中颜色
                tintColor="#33A3F4" //选中的颜色
                barTintColor="white" //背景颜色
                hidden={this.state.hidden} //是否隐藏
            >
                <TabBar.Item
                    title="首页"
                    key="index"
                    icon={<i className="iconfont icon-ind"></i>} //图标
                    selectedIcon={<i className="iconfont icon-ind"></i>} //选中图标
                    selected={this.state.selectedTab === 'blueTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'blueTab',
                        });
                    }}
                    data-seed="logId"
                >
                    {this.renderContent('index')}
                </TabBar.Item>
                <TabBar.Item
                    icon={<i className="iconfont icon-findHouse"></i>}
                    selectedIcon={<i className="iconfont icon-findHouse"></i>}
                    title="找房"
                    key="findHouse"
                    selected={this.state.selectedTab === 'redTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'redTab',
                        });
                    }}
                    data-seed="logId1"
                >
                    {this.renderContent('findHouse')}
                </TabBar.Item>
                <TabBar.Item
                    icon={<i className="iconfont icon-infom"></i>}
                    selectedIcon={<i className="iconfont icon-infom"></i>}
                    title="资讯"
                    key="infom"
                    selected={this.state.selectedTab === 'greenTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'greenTab',
                        });
                    }}
                >
                    {this.renderContent('infom')}
                </TabBar.Item>
                <TabBar.Item
                    icon={<i className="iconfont icon-my"></i>}
                    selectedIcon={<i className="iconfont icon-my"></i>}
                    title="我的"
                    key="my"
                    selected={this.state.selectedTab === 'yellowTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'yellowTab',
                        });
                    }}
                >
                    {this.renderContent('My')}
                </TabBar.Item>
            </TabBar>
        </div>
    }
}