import * as React from 'react'
import { Link } from 'react-router-dom'
import { useUserInfo } from '../../../context/UserInfoProvider'
import { Redirect } from 'react-router-dom'

export const Initial = (): JSX.Element => {
  const userInfo = useUserInfo()

  if (userInfo.tokens) {
    return <Redirect to="/mod" />
  } else {
    return (
      <div className="min-h-screen flex items-center">
        <div className="m-auto">
          <div className="">
            <Link to={'guest/mod'} className="">
              Start
            </Link>
          </div>
          <div className="">
            <Link to={'/login'}>Login</Link>
          </div>
        </div>
      </div>
    )
  }
}
