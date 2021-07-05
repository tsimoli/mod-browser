import * as React from 'react'
import { Login } from './components/Login'
import { Home } from './components/Home'
import { Mod } from './components/Mod'
import { Initial } from './components/Initial'
import { UserInfoProvider, useUserInfo } from '../../context/UserInfoProvider'
import {
  Route,
  MemoryRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom'

const App = (): JSX.Element => {
  return (
    <UserInfoProvider>
      <main className="w-extension h-extension min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Router>
            <Switch>
              <Route exact path="/Login" component={Login} />
              <PrivateRoute exact path="/home" component={Home} />
              <Route path="/mod" component={Mod} />
              <Route path="*" component={Initial} />
            </Switch>
          </Router>
        </div>
      </main>
    </UserInfoProvider>
  )
}

export function PrivateRoute({ component: Component, ...rest }): JSX.Element {
  const userInfo = useUserInfo()
  console.log(userInfo)

  return (
    <Route
      {...rest}
      render={(props: any) =>
        userInfo.tokens ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

export default App
