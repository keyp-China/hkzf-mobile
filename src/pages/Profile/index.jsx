import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal, Toast } from 'antd-mobile'

import { BASE_URL } from '../../utils/url'
import { isAuth, getToken, removeToken } from '../../utils'
import { axios } from '../../utils/axios'

import styles from './index.module.css'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  { id: 4, name: '成为房主', iconfont: 'icon-identity' },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class Profile extends Component {
  state = {
    isLogin: isAuth(), // 是否登录
    userinfo: { avatar: '', nickname: '' } // 用户信息
  }

  componentDidMount() {
    this.getUserinfo()
  }

  /* 获取用户信息 */
  async getUserinfo() {
    if (!this.state.isLogin) {
      return
    }
    // let res = await axios('/user', { headers: { authorization: getToken() } })
    let res = await axios('/user')
    if (res.data.status === 200) {
      this.setState({
        userinfo: res.data.body
      })
    }
  }

  /* 退出 */
  logout = () => {
    Modal.alert('退出', '你确定要退出么', [
      {
        text: '取消', onPress: () => { }
      },
      {
        text: '确定', onPress: async () => {
          let res = await axios.post('/user/logout')
          if (res.data.status === 200) {
            Toast.info('退出成功', 1)
            removeToken()
            this.setState({
              isLogin: false,
              userinfo: { avatar: '', nickname: '' }
            })
          }
        }
      }
    ])
  }

  render() {
    const { history } = this.props
    const { avatar, nickname } = this.state.userinfo
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={avatar ? BASE_URL + avatar : DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {
                this.state.isLogin ?
                  /* 登录后展示： */
                  <>
                    <div className={styles.auth}>
                      <span onClick={this.logout}>退出</span>
                    </div>
                    <div className={styles.edit}>
                      编辑个人资料
                  <span className={styles.arrow}>
                        <i className="iconfont icon-arrow" />
                      </span>
                    </div>
                  </>
                  :
                  /* 未登录展示：*/
                  <div className={styles.edit}>
                    <Button
                      type="primary"
                      size="small"
                      inline
                      onClick={() => history.push('/login')}
                    >去登录</Button>
                  </div>
              }
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
