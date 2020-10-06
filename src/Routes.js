import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './screens/Home'
import Profile from './screens/Profile'

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/profile" component={Profile} />
      <Route path="/" component={Home} />
    </Switch>
  )
}
