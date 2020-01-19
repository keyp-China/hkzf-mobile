import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import { axios } from '../../utils/axios'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  /* 受控表单用户 */
  getusername = (e) => {
    this.setState({
      username: e.target.value
    })
  }
  /* 受控表单密码 */
  getpassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  /* 提交表单 */
  handlerSubmit = async (e) => {
    e.preventDefault() // 阻止页面跳转
    let { username, password } = this.state
    let res = await axios.post('/user/login', { username, password })
    if (res.data.status === 200) {
      Toast.success('登陆成功', 2)
    } else {
      Toast.fail(res.data.description, 2)
    }
    console.log(res);
  }



  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={this.handlerSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                placeholder="请输入账号"
                onChange={this.getusername}
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
                onChange={this.getpassword}
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
