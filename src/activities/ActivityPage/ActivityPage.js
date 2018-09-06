import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Url from 'url'
import ActivityListContainer from '../common/ActivityList.container'
import ActivityList from './ActivityList'
import ActivityDetails from '../ActivityDetails'
import { addHistoryObserver } from '../common/browserHistory'
import NewActivityForm from '../NewActivityForm'

const { ACTIVITY_PATH, ACTIVITY_LABEL } = window.tomodomo.config

export default class ActivityPage extends Component {
  static propTypes = {
    discussionId: PropTypes.string,
    // originalInnerHTML: PropTypes.string,
  }

  state = {
    discussionID: null,
    page: 1,
    isLastPage: true,
    changedAt: new Date(),
    legacyDiscussions: null,
  }

  componentWillMount() {
    const legacyDiscussionID = Url.parse(window.location.href, true).query.discussionID
    const standardDiscussionID = this.props.discussionId
    const discussionID = standardDiscussionID || legacyDiscussionID

    // if we have a discussionID, we must show the modal
    this.setState({ discussionID })
    this.isLegacy = legacyDiscussionID && !standardDiscussionID

    // get the page number from the url, if any
    // the Regexp looks for something like `/p3` followed by a url-specific separator or string end
    const pageMatcher = window.location.href.match(/\/p([0-9]+)(((\/)|(\?)|(#)).*)?$/)
    const page = pageMatcher ? parseFloat(pageMatcher[1]) : 1
    this.setState({ page })
    window.history.replaceState({ discussionID, page }, 'Activity')

    // register an observer to show/hide the modal when users go fwd/back
    addHistoryObserver(historyState => {
      // if the url is not a discussion or the activity list, redirect (full reload)
      if (
        window.location.pathname.indexOf(ACTIVITY_PATH) !== 0 &&
        window.location.pathname.indexOf('/discussion/') !== 0
      ) {
        window.location.assign(window.location.href)
      }
      this.setState({
        // If a page wasn't attached to the history then we're back on the first page,
        // w/o historyState, so we can set the page to the page we calculated above.
        // Same with discussionID
        page: (historyState && historyState.page) || page,
        discussionID: historyState ? historyState.discussionID : discussionID,
      })
    })
  }

  onChangePage = (newPage, options = { forceUpdate: false }) => {
    this.setState({
      page: newPage,
      discussionID: null,
    })
    if (options.forceUpdate) {
      this.setState({ changedAt: new Date() })
    }
    window.history.pushState({ page: newPage }, ACTIVITY_LABEL, `${ACTIVITY_PATH}/p${newPage}`)
  }

  onOpenDiscussion = (discussionID, href) => {
    // if `href` is missing, we're on a legacy page and we need to compute the url
    let nextHref = href
    if (!nextHref) {
      const crtUrl = Url.parse(window.location.href, true)
      delete crtUrl.search // if exists, it overwrites query
      crtUrl.query.discussionID = discussionID
      nextHref = Url.format(crtUrl)
      this.isLegacy = true
    }
    window.history.pushState({ discussionID }, ACTIVITY_LABEL, nextHref)
    this.setState({ discussionID })
  }

  onPostActivity = () => {
    if (this.state.page === 1) {
      this.setState({ changedAt: new Date() })
    } else {
      this.onChangePage(1)
    }
  }

  render() {
    const { page, legacyDiscussions } = this.state
    const discussionID = parseFloat(this.state.discussionID)

    return (
      <div className="activity-page">
        <h1 className="H HomepageTitle">{ACTIVITY_LABEL}</h1>
        <NewActivityForm onPostActivity={this.onPostActivity} hasAvatar />
        <ActivityListContainer
          onOpenDiscussion={this.onOpenDiscussion}
          page={page}
          timestamp={this.state.changedAt.getTime()}
          onFetchCompleted={() => window.scrollTo(0, 0)}
          onAssessedNextPageExistence={pageExists => {
            this.setState({ isLastPage: !pageExists })
          }}
          onAssessedLastStandardPageNumber={lastStandardPage => {
            this.lastStandardPage = lastStandardPage
          }}
          onFetchedLegacyActivities={res => this.setState({ legacyDiscussions: res })}
        >
          {ActivityList}
        </ActivityListContainer>
        <ActivityDetails
          discussionID={discussionID}
          onCloseDiscussion={({ forceUpdate }) => this.onChangePage(page, { forceUpdate })}
          isLegacy={this.isLegacy}
          discussion={
            legacyDiscussions &&
            legacyDiscussions.find(discussion => discussion.discussionID === discussionID)
          }
        />
        <div className="activity__nav">
          <button
            disabled={page === 1}
            onClick={() => this.onChangePage(page - 1)}
            className="td-button"
          >
            Previous page
          </button>
          <button
            disabled={this.state.isLastPage}
            onClick={() => this.onChangePage(page + 1)}
            className="td-button"
          >
            Next page
          </button>
        </div>
      </div>
    )
  }
}
