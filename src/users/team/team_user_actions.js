import React, { Component } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'

import { map, addIndex } from 'ramda'

import Loader from 'common/loader'
import Dropdown from 'common/dropdown'

import { update as updateUser, remove as removeUser } from 'users/users_actions'

@connect(
  null,
  { archiveUser: (id) => updateUser(id, { archived: 1 }, true),
    unArchiveUser: (id) => updateUser(id, { archived: 0 }, true),
    promoteAdmin: (id) => updateUser(id, { admin: 1 }, true),
    unPromoteAdmin: (id) => updateUser(id, { admin: 0 }, true),
    removeUser: (id) => removeUser(id, true)
  }
)
export default class TeamUserActions extends Component {
  state = { loading: false };

  handleAction(action) {
    this.setState({ loading: true })
    action().catch().then(() => this.setState({ loading: false }))
  }

  render() {
    const { user, archiveUser, unArchiveUser, promoteAdmin, unPromoteAdmin, removeUser } = this.props
    const actionButton = <span className={cn('button button--gear button--borderless',
                               { 'button--loading': this.state.loading })} />

    const userActions = []
    if (user.archived) {
      userActions.push(['UnArchive', unArchiveUser.bind(this, user.id)])
      userActions.push(['Permanently remove', removeUser.bind(this, user.id)])
    } else {
      userActions.push(['Archive', archiveUser.bind(this, user.id)])
      if (user.admin) {
        userActions.push(['Revoke Admin Rights', unPromoteAdmin.bind(this, user.id)])
      } else {
        userActions.push(['Promote to Admin', promoteAdmin.bind(this, user.id)])
      }
    }

    const actionNodes = addIndex(map)(([title, action], idx) =>
      <li key={idx} className="action-list__action"
          onClick={this.handleAction.bind(this, action)}>{title}</li>)

    return this.state.loading ? <span className="team__user-actions"><Loader /></span> :
      <span className="team__user-actions">
        <Dropdown actionButton={actionButton} corner="right">
          <ul className="action-list">
            { actionNodes(userActions) }
          </ul>
        </Dropdown>
      </span>
  }
}
