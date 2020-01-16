/* 吸顶功能封装 */
import React from 'react'

export default class Sticky extends React.Component {
    placeholderRef = React.createRef()
    contentRef = React.createRef()

    componentDidMount() {
        window.addEventListener("scroll", this.handlerScroll)
    }
    componentWillUnmount(){
        // 销毁组件时 删除事件监听
        window.removeEventListener('scroll',this.handlerScroll)
    }

    /* 滚动事件函数 */
    handlerScroll = () => {
        let pDiv = this.placeholderRef.current
        let cDiv = this.contentRef.current
        // 元素.getBoundingClientRect() 获取当前元素上下左右的距离
        let pTop = pDiv.getBoundingClientRect().top
        if (pTop < 0) {
            cDiv.style.position = 'fixed'
            cDiv.style.top = '0'
            cDiv.style.width = '100%'
            // 解决跳一下的问题 空div设置和内容区域一样的高度
            pDiv.style.height = `${this.props.height}px`
        } else { // 还原
            cDiv.style.position = 'static'
            pDiv.style.height = '0'
        }
    }

    render() {
        return (
            <div>
                {/* 占位 placeholder 用来测试距离顶部的距离 */}
                <div ref={this.placeholderRef}></div>
                {/* 传入的参数组件 content */}
                <div ref={this.contentRef}>{this.props.children}</div>
            </div>
        )
    }
}
