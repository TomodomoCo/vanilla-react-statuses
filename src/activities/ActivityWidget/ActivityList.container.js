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
    limit: PropTypes.number,
    // the presentational component (function, not instantiated yet!)
    children: PropTypes.func.isRequired,
    onOpenDiscussion: PropTypes.func,
  }

  static defaultProps = {
    onOpenDiscussion: () => {},
  }

  state = {
    discussions: null,
  }

  // eslint-disable-next-line react/sort-comp
  fetchActivityUpdates = async props => {
    // try to fetch the standard activities
    let discussions = []
    discussions = await getActivitiesByPage(1, {
      ignoreCache: true,   // ignore cache to force an update if the update timestamp changed
      attachHeaders: ['Link'],
    })
    console.log(``, discussions.length, props.limit)
    // complete the list with legacy activities, if there's still space
    if (discussions.length < props.limit) {
      const legacyDiscussions = await getLegacyActivitiesByPage(1, { ignoreCache: true })
      discussions = discussions.concat(
        legacyDiscussions.map(disc => ({ ...disc, isLegacy: true}))
      )
    }
    this.setState({ discussions })
  }

  componentWillMount = () => this.fetchActivityUpdates(this.props)

  componentWillReceiveProps = nextProps => {
    if (nextProps.timestamp !== this.props.timestamp || nextProps.page !== this.props.page) {
      this.fetchActivityUpdates(nextProps)
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
