import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { getProfile, tagSearch } from '@tomodomo/vanilla-react-utils'
import { postComment } from '../../api/comments'
import NewCommentForm from './NewCommentForm'

export default class NewCommentFormContainer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    discussionID: PropTypes.number.isRequired,
  }

  state = {
    userProfile: null,
  }

  componentWillMount = async () => {
    const userProfile = await getProfile()
    this.setState({ userProfile })
  }

  onSubmit = (event, text) => {
    event.preventDefault()
    postComment({ text, discussionID: this.props.discussionID, apiVersion: 1 })
      .then(this.props.onSubmit) // allow effects in the parent
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
      <NewCommentForm
        onSubmit={this.onSubmit}
        userProfile={this.state.userProfile}
        tagSearch={debounce(this.tagSearch, 200)}
      />
    )
  }
}
