import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-tiny-spin'
import { getProfile, getCategories } from 'vanilla-react-utils'
import {
  getActivityById,
  getModAccessOnActivities,
  deleteActivityById,
  updateDiscussionById,
} from '../../api/discussions'
import { getCommentsByActivityId } from '../../api/comments'

import ActivityDetails from './ActivityDetails'

export default class ActivityDetailsContainer extends Component {
  static propTypes = {
    discussionID: PropTypes.number.isRequired,
    onCloseDiscussion: PropTypes.func.isRequired,
    // IMPORTANT: `discussion` is present only for legacy activities
    discussion: PropTypes.shape(),
    isLegacy: PropTypes.bool,
  }

  state = {
    discussion: null,
    userPermissions: null,
    userProfile: null,
    categories: null,
  }

  fetchActivityUpdates = async props => {
    const { discussionID } = props || this.props
    const discussion = await getActivityById(discussionID)
    discussion.comments = await getCommentsByActivityId(discussionID)
    this.setState({ discussion })
  }

  fetchPermissions = async () => {
    this.setState({ userPermissions: await getModAccessOnActivities() })
  }

  fetchProfile = async () => {
    this.setState({ userProfile: await getProfile() })
  }

  fetchCategories = async () => {
    this.setState({ categories: await getCategories() })
  }

  onDeleteActivity = () => deleteActivityById(this.props.discussionID)

  onChangeCategory = categoryID => updateDiscussionById(this.props.discussionID, { categoryID })

  componentWillMount = () => {
    const { discussion, isLegacy } = this.props // if present => legacy
    if (!isLegacy) {
      this.fetchActivityUpdates().catch(console.error)
      this.fetchPermissions().catch(console.error)
      this.fetchProfile().catch(console.error)
      this.fetchCategories().catch(console.error)
    } else {
      this.setState({ discussion })
    }
  }

  componentWillReceiveProps = nextProps => {
    if (!this.props.isLegacy) {
      this.fetchActivityUpdates(nextProps).catch(console.error)
    } else {
      this.setState({ discussion: nextProps.discussion })
    }
  }

  render() {
    const { discussion, userPermissions, userProfile, categories } = this.state
    const canManageDiscussions = userPermissions && userPermissions['discussions.manage']
    if (!discussion) return <Spinner />
    return (
      <ActivityDetails
        {...{
          ...discussion,
          onDeleteActivity:
            canManageDiscussions ||
            (userProfile && userProfile.userID === discussion.insertUser.userID)
              ? this.onDeleteActivity
              : null,
          onChangeCategory: canManageDiscussions ? this.onChangeCategory : null,
          onCloseDiscussion: this.props.onCloseDiscussion,
          categories,
        }}
      />
    )
  }
}
