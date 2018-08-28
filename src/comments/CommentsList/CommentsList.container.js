import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getProfile } from '@tomodomo/vanilla-react-utils'
import { deleteCommentById, getCommentsByActivityId } from '../../api/comments'
import { getModAccessOnActivities } from '../../api/discussions'
import CommentsList from './CommentsList'

export default class CommentsContainer extends Component {
  static propTypes = {
    discussionID: PropTypes.number.isRequired,
    limitCount: PropTypes.number,
    showDetails: PropTypes.bool,
    updateTimestamp: PropTypes.number,
    commentList: PropTypes.arrayOf(PropTypes.shape()),
    isLegacy: PropTypes.bool,
  }

  static defaultProps = {
    limitCount: undefined, // won't slice the array of comments
  }

  state = {
    comments: null,
    userPermissions: null,
    userProfile: null,
  }

  fetchPermissions = async () => {
    const up = await getModAccessOnActivities()
    this.setState({ userPermissions: await getModAccessOnActivities() })
  }

  fetchProfile = async () => {
    this.setState({ userProfile: await getProfile() })
  }

  fetchComments = async props => {
    const comments = await getCommentsByActivityId(props.discussionID, {
      ignoreCache: props && props.updateTimestamp !== this.props.updateTimestamp,
    })
    this.setState({ comments })
  }

  onDeleteComment = async id => {
    await deleteCommentById(id)
    // if the delete fails, an error is thrown and the following won't happen
    this.setState({
      comments: this.state.comments.filter(comment => comment.commentID !== id),
    })
  }

  componentWillMount = () => {
    if (this.props.commentList) {
      this.setState({ comments: this.props.commentList })
    } else {
      this.fetchComments(this.props).catch(console.error)
    }
    if (!this.props.isLegacy) {
      this.fetchPermissions().catch(console.error)
      this.fetchProfile().catch(console.error)
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.isLegacy && nextProps.commentList) {
      this.setState({ comments: nextProps.commentList })
    } else {
      this.fetchComments(nextProps)
    }
  }

  render() {
    const { comments, userPermissions, userProfile } = this.state
    if (!comments) return null
    return (
      <CommentsList
        comments={comments.slice(0, this.props.limitCount)}
        showDetails={this.props.showDetails}
        yielderOnDeleteComment={comment => (
          (userPermissions && userPermissions['comments.delete']) ||
          (userProfile && userProfile.userID === comment.insertUser.userID)
            ? this.onDeleteComment
            : null
        )}
      />
    )
  }
}
