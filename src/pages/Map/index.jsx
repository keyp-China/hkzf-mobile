import React from "react"
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils/index'
import "./map.scss"

//react使用百度地图不能直接使用BMap 需要使用window.BMap
const BMap = window.BMap
export default class Map extends React.Component {
    componentDidMount() {
        //页面有个元素以后初始化一个地图
        this.initMap()
    }

    /* 初始化百度地图 */
    async initMap() {
        // 获取当前城市信息
        let currentCity = await getCurrentCity()
        // 初始化一个地图
        var map = new BMap.Map("container");

        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder()
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(currentCity.label, function (point) {
            if (point) {
                map.centerAndZoom(point, 11);
                // map.addOverlay(new BMap.Marker(point));

                // 添加地图控件
                map.addControl(new BMap.NavigationControl()); // 平移缩放控件
                map.addControl(new BMap.ScaleControl()); // 比例尺控件
            }
        }, currentCity.label);

        /* var point = new BMap.Point(116.404, 39.915);  //设置中心点坐标 经纬度
        map.centerAndZoom(point, 11);   //显示地图并缩放 值越大越详细 */
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