import './main.css'
import 'common/bg_colors.css'
import 'common/button.css'
import 'common/input_text.css'
import 'common/color_picker.css'
import 'common/inline_edit.css'
import 'common/action_list.css'

import React from 'react'
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom'
import { Link, Router, Route, Redirect, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import usersReducer from 'users/users_reducer'
import teamReducer from 'users/team/team_reducer'
import rolesReducer from 'roles/roles_reducer'
import projectsReducer from 'projects/projects_reducer'

import Header from 'header'
import Guide from 'guide'
import Team from 'users/team'
import Profile from 'users/profile'
import ProfileEdit from 'users/profile_edit'
import Roles from 'roles/roles'
import ProjectList from 'projects/projects_list'

const reducer = combineReducers({
  routing: routerReducer,
  users: usersReducer,
  team: teamReducer,
  roles: rolesReducer,
  projects: projectsReducer,
})

const middleware = applyMiddleware(thunk)

const store = createStore(reducer, middleware)

const history = syncHistoryWithStore(browserHistory, store)

const App = ({ children }) => (
  <div>
    <Header />

    { children }
  </div>
)

const NotFound = () => <div className="centered-container"><h1>NOT FOUND</h1></div>

render((
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ App }>
        <Route path="/profile/:id" component={Profile}></Route>
        <Route path="/profile/:id/edit" component={ProfileEdit}></Route>
        <Route path="/roles" component={Roles}></Route>
        <Route path="/team" component={Team}></Route>
        <Route path="/projects" component={ProjectList}></Route>
        <Route path="/guide" component={Guide}></Route>
        <Route path="/notfound" component={NotFound}></Route>
        <Redirect from="/**" to="/notfound"></Redirect>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))

