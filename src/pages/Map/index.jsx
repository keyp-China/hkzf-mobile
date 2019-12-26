import React from "react"
import NavHeader from '../../components/NavHeader'
import "./map.scss"

//react使用百度地图不能直接使用BMap 需要使用window.BMap
const BMap = window.BMap
export default class Map extends React.Component {
    componentDidMount() {
        //页面有个元素以后初始化一个地图
        this.initMap()
    }

    /* 初始化百度地图 */
    initMap() {
        var map = new BMap.Map("container");
        var point = new BMap.Point(116.404, 39.915);  //设置中心点坐标 经纬度
        map.centerAndZoom(point, 11);   //显示地图并缩放 值越大越详细
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