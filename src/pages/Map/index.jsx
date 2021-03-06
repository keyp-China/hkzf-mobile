import React from "react"
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils/index'
import axios from "axios"
import { Toast } from 'antd-mobile'
import styles from './map.module.css' // 局部样式引入
import "./map.scss"

//react使用百度地图不能直接使用BMap 需要使用window.BMap
const BMap = window.BMap
export default class Map extends React.Component {
    state = {
        houselist: [], // 房屋列表
        isShowList: false // 是否显示房屋列表
    }

    componentDidMount() {
        //页面有个元素以后初始化一个地图
        this.initMap()
    }

    /* 初始化百度地图 */
    async initMap() {
        // 获取当前城市信息
        let currentCity = await getCurrentCity()
        // 初始化一个地图
        this.map = new BMap.Map("container");

        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder()
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(currentCity.label, (point) => {
            if (point) {
                this.map.centerAndZoom(point, 11); //显示地图并缩放 值越大越详细

                // 添加地图控件
                this.map.addControl(new BMap.NavigationControl()); // 平移缩放控件
                this.map.addControl(new BMap.ScaleControl()); // 比例尺控件

                // 调用添加覆盖物的方法
                this.renderOverlay(currentCity.value)

            }
        }, currentCity.label);
    }

    /* 获取房屋数据并添加覆盖物 */
    async renderOverlay(cityId, type = "circle") {
        Toast.loading('正在加载中...', 0)
        // 发送请求 获取房源数据
        let res = await axios.get(`http://localhost:8080/area/map?id=${cityId}`)
        // 遍历添加覆盖物
        Toast.hide()
        res.data.body.forEach(item => {
            let {
                coord: { latitude, longitude },
                label: cityName,
                count,
                value
            } = item
            // 通过经纬度创建坐标
            let newPoint = new BMap.Point(longitude, latitude)
            // 添加覆盖物
            let opts = {
                position: newPoint,    // 指定文本标注所在的地理位置
                offset: new BMap.Size(0, 0)    //设置文本偏移量
            }
            let label = new BMap.Label('', opts);  // 创建文本标注对象
            // 设置覆盖物内容
            if (type == "circle") { // 圆形
                label.setContent(`
                    <div class="${styles.bubble}">
                        <p class="${styles.name}">${cityName}</p>
                        <p>${count}套</p>
                    </div>
                `)
            } else if (type == "rect") { // 矩形
                label.setContent(`
                    <div class="${styles.rect}">
                        <span class="${styles.housename}">${cityName}</span>
                        <span class="${styles.housenum}">${count}套</span>
                        <i class="${styles.arrow}"></i>
                    </div>
                `)
            }
            // 设置覆盖物样式
            label.setStyle({
                cursor: 'pointer',
                border: '0px solid rgb(255, 0, 0)',
                padding: '0px',
                whiteSpace: 'nowrap',
                fontSize: '12px',
                color: 'rgb(255, 255, 255)',
                textAlign: 'center'
            });
            // 给覆盖物注册点击事件
            label.addEventListener("click", (e) => {
                // 当前缩放级别
                let zoom = this.map.getZoom()
                if (zoom == 11) {
                    // 清除旧的覆盖物 百度地图需要使用定时器 要不会报错
                    setTimeout(() => {
                        this.map.clearOverlays()
                    }, 0)
                    // 跳转位置
                    this.map.centerAndZoom(newPoint, 13);
                    this.renderOverlay(value)
                } else if (zoom == 13) {
                    setTimeout(() => {
                        this.map.clearOverlays()
                    }, 0)
                    this.map.centerAndZoom(newPoint, 15);
                    this.renderOverlay(value, "rect")
                } else if (zoom == 15) {
                    // 设置点击移动地图到中心点
                    // 获取点击坐标
                    let clickX = e.changedTouches[0].clientX
                    let clickY = e.changedTouches[0].clientY
                    // 获取中心点坐标
                    let centreX = window.innerWidth / 2
                    let centreY = (window.innerHeight - 330) / 2
                    // 计算移动坐标
                    let distanceX = centreX - clickX
                    let distanceY = centreY - clickY
                    // 移动方法panBy(x,y)
                    this.map.panBy(distanceX, distanceY)

                    // 获取房屋列表
                    this.getHouseList(value)
                }
            })
            // 放入覆盖物
            this.map.addOverlay(label);
        })
        // 给地图添加移动事件
        this.map.addEventListener("movestart", () => {
            this.setState({
                isShowList: false
            })
        })
    }

    /* 获取房屋列表 */
    getHouseList = async (id) => {
        Toast.loading('正在加载中...', 0)
        let res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        Toast.hide()
        this.setState({
            houselist: res.data.body.list,
            isShowList: true // 开启列表渲染状态
        })
    }

    /* 渲染房屋列表 */
    renderHouseList() {
        return this.state.houselist.map(item => {
            return <div className={styles.house} key={item.houseCode}>
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
        })
    }

    render() {
        return <div className="map">
            {/* 顶部navbar */}
            <NavHeader>地图找房</NavHeader>
            {/* 准备百度地图容器container */}
            <div id="container"></div>

            {/* 房子列表结构 */}
            <div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
                <div className={styles.titleWrap}>
                    <h1 className={styles.listTitle}>房屋列表</h1>
                    <a className={styles.titleMore} href="/house/list">更多房源</a>
                </div>
                {/* 内容区域 */}
                <div className={styles.houseItems}>
                    {this.renderHouseList()}
                </div>
            </div>
        </div>
    }
}