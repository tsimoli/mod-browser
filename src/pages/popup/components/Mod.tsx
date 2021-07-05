import * as React from 'react'

export const Mod = (): JSX.Element => {
  // Check if user has tokens. If yes get active mod
  // with user tokens(create or get active). If not call get unique id from
  // from Unique.ts. Get active wod for unique id. If it doesn't exist
  // create active wod for user and return it
  return (
    <div className="bg-green-500">
      <div className="title">Mod</div>
    </div>
  )
}
