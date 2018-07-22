import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-tiny-spin'
import HeaderLink from 'li'
import Url from 'url'
import { getActivitiesByPage, getLegacyActivitiesByPage } from '../../api/discussions'

export default class ActivityListContainer extends Component {
  static displayName = 'ActivityContainer'

  static propTypes = {
    // this value is not used per-se, it only triggers a new fetch
    timestamp: PropTypes.number,
    // the limit doesn't work in the API, so this is only used for page 1 (used in the widget)
    limit: PropTypes.number,
    page: PropTypes.number,
    // the presentational component (function, not instantiated yet!)
    children: PropTypes.func.isRequired,
    onOpenDiscussion: PropTypes.func,
    onFetchCompleted: PropTypes.func,
    onAssessedNextPageExistence: PropTypes.func,
    onAssessedLastStandardPageNumber: PropTypes.func,
    onFetchedLegacyActivities: PropTypes.func,
  }

  static defaultProps = {
    page: 1,
    onOpenDiscussion: () => {},
    onFetchCompleted: () => {},
    onAssessedNextPageExistence: () => {},
    onAssessedLastStandardPageNumber: () => {},
    onFetchedLegacyActivities: () => {},
  }

  state = {
    discussions: null,
  }

  // the following is going to be set in fetchActivityUpdatesAndSetPaginationLimits
  lastStandardPage = Number.MAX_SAFE_INTEGER

  // eslint-disable-next-line react/sort-comp
  fetchActivityUpdatesAndSetPaginationLimits = async props => {
    // if no props as args - fallback on current props
    const {
      page,
      onAssessedNextPageExistence,
      onFetchCompleted,
      onAssessedLastStandardPageNumber,
      onFetchedLegacyActivities,
    } =
      props || this.props
    let discussions = []

    // try to fetch the standard activities (note: lastStandardPage may not be set yet)
    if (page <= this.lastStandardPage) {
      discussions = await getActivitiesByPage(
        page,
        // we'll ignore cache in order to force an update if the update timestamp changed
        {
          ignoreCache: true,
          attachHeaders: ['Link'],
        }
      )
      try {
        // eslint-disable-next-line no-underscore-dangle
        const lastPageUrl = HeaderLink.parse(discussions._headers.Link).last
        this.lastStandardPage = parseInt(Url.parse(lastPageUrl, true).query.page, 10)
        onAssessedLastStandardPageNumber(this.lastStandardPage)
      } catch (e) {
        console.error('Parsing last page number', e)
        this.lastStandardPage = 0
      }
      onAssessedNextPageExistence(true)
    }

    // fetch the page as legacy
    if (page >= this.lastStandardPage) {
      const legacyPage = page - this.lastStandardPage
      // in case the retrieved page was the last standard page,
      // we only need to find if there's a legacy "next" page (skip retrieving the crt page again)
      if (legacyPage > 0) {
        discussions = await getLegacyActivitiesByPage(legacyPage, {
          ignoreCache: true,
        })
        onFetchedLegacyActivities(discussions)
      }
      // detect if there's no next page. Note: the following request is cached :)
      const nextPageDiscussions = await getLegacyActivitiesByPage(legacyPage + 1)
      onAssessedNextPageExistence(nextPageDiscussions.length)
    }

    this.setState({ discussions })
    onFetchCompleted()
  }

  componentWillMount = this.fetchActivityUpdatesAndSetPaginationLimits

  componentWillReceiveProps = nextProps => {
    if (nextProps.timestamp !== this.props.timestamp || nextProps.page !== this.props.page) {
      this.fetchActivityUpdatesAndSetPaginationLimits(nextProps)
    }
  }

  render() {
    const { discussions } = this.state
    if (!discussions) return <Spinner />
    const PresentationalComponent = this.props.children
    // nb: if limit is undefined, no slicing occurs
    return (
      <PresentationalComponent
        discussions={discussions.slice(0, this.props.limit)}
        onOpenDiscussion={this.props.onOpenDiscussion}
      />
    )
  }
}
