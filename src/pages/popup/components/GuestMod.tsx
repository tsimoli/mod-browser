import * as React from 'react'
import { ModModel } from '../../../models/Mod'
import { get } from '../../../storage/Storage'
import { Tokens } from '../../../models/UserInfo'
import { ModApi } from '../../../api/api'

export const GuestMod = (): JSX.Element => {
  const [mods, setMods] = React.useState<ModModel[]>([])

  React.useEffect(() => {
    async function getToken() {
      const tokens = await get<Tokens>('tokens')
      if (tokens) {
        const mods = await ModApi.getDailyGuestMod()
        console.log(mods)
        setMods(mods)
      } else {
        // api get daily mod
      }
    }
    getToken()
  }, [])
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
