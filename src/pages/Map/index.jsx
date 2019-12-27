import React from "react"
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils/index'
import styles from './map.module.css' // 局部样式引入
import "./map.scss"
import axios from "axios"

//react使用百度地图不能直接使用BMap 需要使用window.BMap
const BMap = window.BMap
export default class Map extends React.Component {
    state = {
        houselist: [] // 房屋列表
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
        // 发送请求 获取房源数据
        let res = await axios.get(`http://localhost:8080/area/map?id=${cityId}`)
        // 遍历添加覆盖物
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
                    // 获取房屋列表
                    this.getHouseList(value)
                }
            })
            // 放入覆盖物
            this.map.addOverlay(label);
        })
    }

    /* 获取房屋列表 */
    getHouseList = async (id) => {
        let res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        this.setState({
            houselist: res.data.body.list
        })
    }

    render() {
        return <div className="map">
            {/* 顶部navbar */}
            <NavHeader>地图找房</NavHeader>
            {/* 准备百度地图容器container */}
            <div id="container"></div>
        </div>
    }
}