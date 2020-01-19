import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { withFormik } from 'formik'
import * as Yup from 'yup'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import { axios } from '../../utils/axios'

import styles from './index.module.css'

class Login extends Component {
  render() {
    // 使用withFormik可得 values相当于state 
    let { values, handleChange, handleSubmit, errors } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                placeholder="请输入账号"
                onChange={handleChange}
                value={values.username}
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {errors.username && <div className={styles.error}>{errors.username}</div>}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
                onChange={handleChange}
                value={values.password}
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password && <div className={styles.error}>{errors.password}</div>}
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

// export default Login
export default withFormik({
  mapPropsToValues: () => ({ username: '', password: '' }), // 所有值都相当于state 提供初始数据

  handleSubmit: async (values, { props }) => {
    // e.preventDefault() // 阻止页面跳转
    let { username, password } = values
    let res = await axios.post('/user/login', { username, password })
    if (res.data.status === 200) {
      Toast.success('登陆成功', 2)
    } else {
      Toast.fail(res.data.description, 2)
    }
    console.log(res);
  },

  // 验证1：validate
  /* validate: (values) => {
    let errors = {} // 存储错误信息
    if (!values.username) {
      errors.username = '用户名不能为空'
    }
    if (!values.password) {
      errors.password = '密码不能为空'
    }
    return errors
  } */

  // 验证2：validationSchema配合Yup验证
  validationSchema: Yup.object().shape({
    // 名：检验规则  Yup链式编程 .matches(正则，错误提示)
    username: Yup.string().required('用户名不能为空').matches(/^[a-zA-Z_\d]{5,8}$/, '用户名为5-8位'),
    password: Yup.string().required('密码不能为空').matches(/^[a-zA-Z_\d]{5,12}$/, '密码为5-12位')
  })

})(Login)
