import React, { Component } from 'react'
import NewActivityForm from '../NewActivityForm'
import ActivityListContainer from '../common/ActivityList.container'
import ActivityList from '../ActivityWidget/ActivityList'
import ActivityDetails from '../ActivityDetails'
import { addHistoryObserver } from '../common/browserHistory'

const { LIMIT_ACTIVITY, ACTIVITY_PATH } = window.tomodomo.config

export default class ActivityWidget extends Component {
  state = {
    discussionID: null,
    changedAt: new Date(),
  }

  componentWillMount() {
    this.initialHref = window.location.href
    // register an observer to show/hide the modal when users go fwd/back
    addHistoryObserver(historyState => {
      this.setState({
        discussionID: historyState ? historyState.discussionID : null,
      })
      if (!historyState.isHomePage) {
        window.location.reload()
      }
    })
  }

  onPostActivity = () => {
    this.setState({ changedAt: new Date() })
  }

  onOpenDiscussion = (discussionID, href) => {
    this.setState({ discussionID })
    window.history.pushState({ discussionID, isHomePage: true }, '', href)
  }

  onCloseDiscussion = ({ forceUpdate = false }) => {
    const state = {
      discussionID: null,
      ...(forceUpdate ? { changedAt: new Date() } : {}),
    }
    this.setState(state)
    window.history.pushState({ ...state, isHomePage: true }, '', this.initialHref)
  }

  render() {
    const { discussionID } = this.state
    return (
      <div className="activity-widget">
        <NewActivityForm onPostActivity={this.onPostActivity} hasAvatar />
        <ActivityListContainer
          timestamp={this.state.changedAt.getTime()}
          limit={LIMIT_ACTIVITY}
          onOpenDiscussion={this.onOpenDiscussion}
        >
          {ActivityList}
        </ActivityListContainer>
        <ActivityDetails discussionID={discussionID} onCloseDiscussion={this.onCloseDiscussion} />
        <a href={ACTIVITY_PATH} className="td-button td-button--outline td-button--full-width td-button--small u-mt--2">View more</a>
      </div>
    )
  }
}
