import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import { axios } from '../../utils/axios'
import { setToken } from '../../utils'

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
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                type="text"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* {errors.username && <div className={styles.error}>{errors.username}</div>} */}
            <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            <ErrorMessage className={styles.error} name="password" component="div"></ErrorMessage>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
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
      setToken(res.data.body.token)
      let state = props.location.state
      if (state) {
        // 有则跳转回原来的页面
        props.history.push(state.from.pathname)
      } else {
        // props.history.push('/home/profile')
        props.history.go(-1)
      }
    } else {
      Toast.fail(res.data.description, 2)
    }
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
