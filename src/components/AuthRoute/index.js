/* 鉴权路由 */
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils'
/* 函数组件 */
function AuthRoute({ path, exact, children }) {
    return <Route
        exact={exact}
        path={path}
        render={() => {
            if (!isAuth()) {
                return <Redirect to="/login"></Redirect>
            }
            return children
        }}>
    </Route>
}

export default AuthRoute