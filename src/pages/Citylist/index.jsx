import React from "react"
import axios from "axios"

import { NavBar, Icon, Toast } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized' // react-virtualized可视区域渲染
// 获取当前定位城市方法
import { getCurrentCity } from '../../utils'

import './citylist.scss'

// 有房源的城市
const HAS_HOUSE = ["北京", "上海", "深圳", "广州"]

export default class Citylist extends React.Component {
    state = {
        citylist: {}, // 城市列表
        cityindex: [], // 城市索引
        indexActive: 0 // 当前索引位置
    }

    listRef = React.createRef()

    componentDidMount() {
        this.getCitylist() // 获取城市列表
    }

    /* 获取城市列表 */
    async getCitylist() {
        // 1. 获取全部城市列表
        let res = await axios.get("http://localhost:8080/area/city?level=1")
        //获取城市数据与城市索引
        let { citylist, cityindex } = this.formatCity(res.data.body)

        // 2. 获取热门城市信息
        let hotres = await axios.get("http://localhost:8080/area/hot")
        citylist['hot'] = hotres.data.body
        cityindex.unshift('hot')

        // 3. 获取当前城市定位
        let currentCity = await getCurrentCity()
        citylist['#'] = [currentCity]
        cityindex.unshift('#')

        // 4. 赋值城市列表与城市索引
        this.setState({
            citylist,
            cityindex
        })
    }

    /* 格式化城市 */
    formatCity(list) {
        let citylist = {}
        // 遍历数据得到自己想要的数组
        list.forEach(item => {
            let word = item.short.substr(0, 1)
            if (!citylist[word]) {
                citylist[word] = [item]
            } else {
                citylist[word].push(item)
            }
        })
        let cityindex = Object.keys(citylist).sort() // 城市索引排序
        // 返回城市列表与城市索引数组
        return { citylist, cityindex }
    }

    /* 格式化word变大写 */
    formatWord = word => {
        switch (word) {
            case '#':
                return '当前城市'
            case 'hot':
                return '热门城市'
            default:
                return word.toUpperCase()
        }
    }

    /* 渲染城市列表 */
    rowRenderer = ({
        key, // 唯一key
        index, // 索引01234
        isScrolling, // 是否正在滚动
        isVisible, // 是否可见
        style, // 必加 不加无样式
    }) => {
        let word = this.state.cityindex[index] // # hot a b c d
        let citys = this.state.citylist[word] // 城市数组
        return (
            <div key={key} style={style} className="city">
                <div className='title'>{this.formatWord(word)}</div>
                {citys.map(item => {
                    return <div className="name"
                        key={item.value}
                        onClick={() => {
                            //北上广深才有房源
                            if (HAS_HOUSE.includes(item.label)) {
                                localStorage.setItem("my-city", JSON.stringify(item)) // 存储本地
                                this.props.history.push("/home/index") // 跳回首页
                            } else {
                                Toast.info(item.label + "市目前无房源")
                            }
                        }}
                    >
                        {item.label}
                    </div>
                })}
            </div>
        )
    }

    /* 当滚动到索引改变的时候 */
    onRowsRendered = ({ startIndex }) => {
        // startIndex最顶部结束的索引 stopIndex最底部结束的索引
        if (this.state.indexActive !== startIndex) {
            this.setState({
                indexActive: startIndex
            })
        }
    }

    /* 动态计算每个大盒子的高度 */
    getRowHeight = ({ index }) => {
        let word = this.state.cityindex[index]
        let citys = this.state.citylist[word]
        return 36 + 50 * citys.length // 字母高度+每个城市高度*城市数量
    }

    render() {
        return <div className="citylist">
            {/* 头部导航栏 */}
            <NavBar
                className="navbar"
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => this.props.history.go(-1)}
            >城市列表</NavBar>

            {/* AutoSizer自动占满整个屏幕 */}
            <AutoSizer>
                {/* 左侧城市列表 */}
                {({ height, width }) => (
                    <List
                        ref={this.listRef} // 为了获取这个dom对象
                        scrollToAlignment="start" // 点击滚动时设置滚动到顶部
                        width={width} // 列表宽度
                        height={height} // 列表高度
                        rowCount={this.state.cityindex.length} // 数组长度多少行
                        rowHeight={this.getRowHeight} // 每行的高度 可写数字或者函数（函数带参数对象有index索引）
                        rowRenderer={this.rowRenderer} // 渲染每行的内容
                        onRowsRendered={this.onRowsRendered} // 当滚动到索引改变的时候
                    />
                )}
            </AutoSizer>

            {/* 右侧城市索引 */}
            <ul className="city-index">
                {/* 循环生成字母 */}
                {
                    this.state.cityindex.map((item, index) => {
                        return <li
                            className={this.state.indexActive === index ? 'index-active' : ''}
                            key={index}
                            onClick={() => {
                                this.listRef.current.scrollToRow(index) // 滚动到相应的索引
                            }}
                        >
                            {item === 'hot' ? "热" : item.toUpperCase()}
                        </li>
                    })
                }
            </ul>
        </div>
    }
}