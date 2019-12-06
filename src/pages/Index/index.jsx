import React from "react"
import axios from 'axios'
import { Carousel } from 'antd-mobile';

export default class Index extends React.Component {
    state = {
        swipters: [], // 轮播数据
        imgHeight: 176,
        isplay: false // 轮播图是否自动播放

    }
    componentDidMount() {
        this.getSwiper() //获取轮播图数据
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

    render() {
        return <div className="index">
            {/* 轮播图 */}
            <Carousel
                autoplay={this.state.isplay} // 是否自动播放
                infinite // 无限循环
            >
                {this.renderSwiper()}
            </Carousel>
        </div>
    }
}