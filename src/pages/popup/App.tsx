import * as React from 'react'
import { Login } from './Login'
import { Home } from './Home'
import { Initial } from './Initial'
import { TokenProvider, useTokens } from '../../context/TokenProvider'
import {
  Route,
  MemoryRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom'

const App = (): JSX.Element => {
  return (
    <TokenProvider>
      <main className="w-extension h-extension min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Router>
            <Switch>
              <Route exact path="/Login" component={Login} />
              <PrivateRoute exact path="/home" component={Home} />
              <Route path="*" component={Initial} />
            </Switch>
          </Router>
        </div>
      </main>
    </TokenProvider>
  )
}

export function PrivateRoute({ component: Component, ...rest }): JSX.Element {
  const tokens = useTokens()
  console.log(tokens)
  return (
    <Route
      {...rest}
      render={(props: any) =>
        tokens.tokens ? (
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
