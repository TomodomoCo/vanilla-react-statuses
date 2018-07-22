import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { getProfile, tagSearch } from 'vanilla-react-utils'
import NewActivityForm from './NewActivityForm'
import { postActivity } from '../../api/discussions'

export default class NewCommentFormContainer extends Component {
  static propTypes = {
    onPostActivity: PropTypes.func,
    hasAvatar: PropTypes.bool,
  }

  state = {
    userProfile: null,
  }

  componentWillMount = async () => {
    // note that later changes of shouldShowAvatar are not supported
    if (this.props.hasAvatar) {
      const userProfile = await getProfile()
      this.setState({ userProfile })
    }
  }

  onSubmit = text => {
    postActivity({ text, apiVersion: 1 })
      .then(this.props.onPostActivity)
      .catch(console.error)
  }

  tagSearch = (query, callback) => {
    if (!query) return
    tagSearch(query)
      // Transform the users to what react-mentions expects
      .then(res => res.map(({ id, name }) => ({ display: name, id })))
      .then(callback)
  }

  render() {
    return (
      <NewActivityForm
        onSubmit={this.onSubmit}
        userProfile={this.state.userProfile}
        tagSearch={debounce(this.tagSearch, 200)}
      />
    )
  }
}
