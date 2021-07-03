import * as React from 'react'
import { Link } from 'react-router-dom'

export const Initial = (): JSX.Element => {
  return (
    <div className="min-h-screen flex items-center">
      <div className="m-auto">
        <div className="">Start</div>
        <div className="">
          <Link to={'/home'}>Home</Link>
        </div>
      </div>
    </div>
  )
}
