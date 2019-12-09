import React from "react"
import axios from 'axios'
import { Carousel, Flex, Grid } from 'antd-mobile';

// 导入scss
import './index.scss'

// 需要先导入的本地资源
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
// 导航菜单的数据
const menus = [
    { name: '整租', imgSrc: nav1, path: '/home/houselist' },
    { name: '合租', imgSrc: nav2, path: '/home/houselist' },
    { name: '地图找房', imgSrc: nav3, path: '/map' },
    { name: '去出租', imgSrc: nav4, path: '/rent/add' }
]

export default class Index extends React.Component {
    state = {
        swipters: [], // 轮播数据
        imgHeight: 176,
        isplay: false, // 轮播图是否自动播放
        groups: [] // 租房小组数据
    }
    componentDidMount() {
        this.getSwiper() //获取轮播图数据
        this.getGroup() //获取租房小组数据
    }

    /* 获取轮播图数据 */
    async getSwiper() {
        let res = await axios.get("http://localhost:8080/home/swiper")
        this.setState({
            swipters: res.data.body
        }, () => {
            // 当数据获取完成的时候才去设置自动播放
            this.setState({
                isplay: true
            })
        })
    }
    /* 获取租房小组数据 */
    async getGroup() {
        let res = await axios.get("http://localhost:8080/home/groups")
        if (res.data.status != 200) {
            return
        }
        this.setState({
            groups: res.data.body
        })
    }

    /* 渲染轮播图 */
    renderSwiper() {
        return this.state.swipters.map(val => (
            <a
                key={val.id}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
                <img
                    src={`http://localhost:8080${val.imgSrc}`}
                    alt={val.alt}
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({ imgHeight: 'auto' });
                    }}
                />
            </a>
        ))
    }
    /* 渲染整租合租 */
    renderNav() {
        return menus.map(item => {
            return <Flex.Item
                key={item.name}
                onClick={() => {
                    // 路由跳转
                    this.props.history.push(item.path)
                }}>
                <img src={item.imgSrc} alt="" />
                <h2>{item.name}</h2>
            </Flex.Item>
        })
    }

    render() {
        return <div className="index">
            {/* 轮播图 */}
            <Carousel
                autoplay={this.state.isplay} // 是否自动播放
                infinite // 无限循环
            >
                {this.renderSwiper()}
            </Carousel>
            {/* 整租合租 */}
            <Flex className="hezu">
                {this.renderNav()}
            </Flex>
            {/* 租房小组 */}
            <div className="groups">
                {/* 标题 */}
                <div className="groups-title">
                    <h2>租房小组</h2>
                    <span>更多</span>
                </div>
                {/* 内容里面 四个 */}
                <Grid
                    data={this.state.groups} // 数组数据
                    columnNum={2} // 每行占几列
                    activeStyle={true} // 点击是否出现灰色样式
                    square={false} // 不要正方形
                    hasLine={false} // 不要边框线
                    renderItem={item => { //渲染每一个格子的 内容
                        return <Flex key={item.id} className="grid-item" justify="between">
                            <div className="desc">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                            <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                        </Flex>
                    }}
                />
            </div>
        </div>
    }
}