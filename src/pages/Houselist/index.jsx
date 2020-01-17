import React from "react"
import SeachHeader from '../../components/SeachHeader'
import { getCurrentCity } from '../../utils/index.js'
import Filter from './components/Filter'
import Sticky from '../../components/Sticky' // 吸顶组件
import NoHouse from '../../components/NoHouse' // 无房组件
import { axios } from '../../utils/axios'
import { Toast } from 'antd-mobile'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized' // react-virtualized可视区域渲染
import { Spring } from 'react-spring/renderprops'

import styles from './houselist.module.css'
import './houselist.scss'

export default class Houselist extends React.Component {
    state = {
        cityname: '',
        cityid: '',
        list: [],
        count: 0,
        isloading: false // 数据还在加载中
    }
    filters = {}

    async componentDidMount() {
        let city = await getCurrentCity()
        this.setState({
            cityname: city.label,
            cityid: city.value
        }, () => {
            this.gethouselist()
        })

    }

    /* houselist获取filter的值 */
    onFilter = (filters) => {
        // 重新筛选时 返回顶部
        window.scrollTo(0, 0)
        this.filters = filters
        this.gethouselist()
    }

    /* 获取筛选房屋数据 */
    gethouselist = async () => {
        Toast.loading("正在加载中...", 0)
        let res = await axios('/houses', {
            params: {
                cityId: this.state.cityid,
                ...this.filters,
                start: 1,
                end: 20
            }
        })
        // Toast.hide()
        Toast.info(`总共有${res.data.body.count}套房源`, 1.5)
        this.setState({
            list: res.data.body.list,
            count: res.data.body.count,
            isloading: true
        })
    }

    /* 是否加载更多数据 */
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index]; // 隐式转换成布尔
    }

    /* 加载更多数据 */
    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise((resolve) => {
            axios('/houses', {
                params: {
                    cityId: this.state.cityid,
                    ...this.filters,
                    start: startIndex,
                    end: stopIndex
                }
            }).then(res => {
                this.setState({
                    list: [...this.state.list, ...res.data.body.list]
                })
                // 成功这个promise必须写resolve 表示完成
                resolve()
            })

        })
    }

    /* 房屋列表每行数据 */
    rowRenderer = ({
        key, // 唯一key
        index, // 索引01234
        style, // 必加 不加无样式
    }) => {
        let item = this.state.list[index]
        if (!item) {
            // 没数据则先用loading来占位
            return <div key={key} style={style}>
                ...loading
            </div>
        }
        return (
            <div key={key} style={style} className={styles.house}
                onClick={() => {
                    this.props.history.push(`/detail/${item.houseCode}`)
                }}>
                <div className={styles.imgWrap}>
                    <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} alt="" />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.desc}>{item.desc}</div>
                    <div>
                        {/* ['近地铁','随时看房'] */}
                        {item.tags.map((v, i) => {
                            let tagclass = `tag${i % 3 + 1}`
                            return <span className={[styles.tag, styles[tagclass]].join(' ')} key={i}>
                                {v}
                            </span>
                        })}
                    </div>
                    <div className={styles.price}>
                        <span className={styles.priceNum}>{item.price}</span> 元/月
                </div>
                </div>
            </div>
        );
    }

    renderHouseList = () => {
        if (this.state.isloading && this.state.count == 0) {
            return <NoHouse>暂无更多房源</NoHouse>
        }
        return <InfiniteLoader
            isRowLoaded={this.isRowLoaded}  // 是否加载
            loadMoreRows={this.loadMoreRows} // 加载更多
            rowCount={this.state.count}  // 总条数
            minimumBatchSize={10} // 默认就是10条
        >
            {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                    {/* WindowScroller让整个页面一起滚动 */}
                    {({ height, isScrolling, onChildScroll, scrollTop }) => (
                        <AutoSizer>
                            {/* AutoSizer为了占满整个屏幕 */}
                            {({ width }) => (
                                <List
                                    autoHeight // 使用WindowScroller必须加
                                    width={width} // 列表宽度
                                    height={height} // 列表高度
                                    rowCount={this.state.count} // 总条数
                                    rowHeight={120} // 每行的高度
                                    rowRenderer={this.rowRenderer} // 渲染每行的内容
                                    onRowsRendered={onRowsRendered} // list滚动调用
                                    ref={registerChild} // 获取组件
                                    isScrolling={isScrolling}
                                    onScroll={onChildScroll}
                                    scrollTop={scrollTop}
                                />
                            )}
                        </AutoSizer>
                    )}
                </WindowScroller>
            )}
        </InfiniteLoader>
    }

    render() {
        return <div className="houselist">
            {/* 顶部搜索栏 */}
            <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
            >
                {(props) => <div className="seach" style={props}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                    <SeachHeader cityname={this.state.cityname}></SeachHeader>
                </div>
                }
            </Spring>

            {/* 筛选功能 */}
            {/* Sticky是自己封装的吸顶组件 */}
            <Sticky height={40}>
                <Filter onFilter={this.onFilter}></Filter>
            </Sticky>

            {/* 房屋列表 */}
            {this.renderHouseList()}
        </div>
    }
}