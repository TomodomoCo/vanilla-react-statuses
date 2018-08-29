import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-tiny-spin'
import { getProfile, getCategories } from '@tomodomo/vanilla-react-utils'
import {
  getActivityById,
  getModAccessOnActivities,
  deleteActivityById,
  updateDiscussionById,
} from '../../api/discussions'
import { getCommentsByActivityId } from '../../api/comments'

const { ALLOW_SELF_DELETE } = window.tomodomo.config

import ActivityDetails from './ActivityDetails'
import ModTools from './DiscussionActions'

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

  fetchActivityUpdates = async discussionID => {
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
    const { discussion, isLegacy } = this.props
    if (!isLegacy) {
      this.fetchActivityUpdates(this.props.discussionID).catch(console.error)
      this.fetchPermissions().catch(console.error)
      this.fetchProfile().catch(console.error)
      this.fetchCategories().catch(console.error)
    } else {
      this.setState({ discussion })
    }
  }

  componentWillReceiveProps = nextProps => {
    if (!this.props.isLegacy && this.props.discussionID !== nextProps.discussionID) {
      this.fetchActivityUpdates(nextProps.discussionID).catch(console.error)
    } else {
      this.setState({ discussion: nextProps.discussion })
    }
  }

  render() {
    const { discussion, userPermissions, userProfile, categories } = this.state
    const canManageDiscussions = userPermissions && userPermissions['discussions.manage']
    if (!discussion) return <Spinner />

    const actionsElement = (
      <ModTools
        onDeleteActivity={
          canManageDiscussions ||
          (userProfile && userProfile.userID === discussion.insertUserID)
            ? this.onDeleteActivity
            : null
        }
        onChangeCategory={canManageDiscussions ? this.onChangeCategory : null}
        onCloseDiscussion={this.props.onCloseDiscussion}
        discussionCategoryID={discussion.discussionID}
        categories={categories}
      />
    )

    return (
      <ActivityDetails
        {...{
          ...discussion,
          onCloseDiscussion: this.props.onCloseDiscussion,
          actionsElement,
        }}
      />
    )
  }
}
