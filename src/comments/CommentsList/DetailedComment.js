import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { stripHtmlTags, getUserUrl } from 'vanilla-react-utils'

export default class DetailedComment extends PureComponent {
  static propTypes = {
    commentID: PropTypes.number.isRequired,
    insertUser: PropTypes.shape({
      photoUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    body: PropTypes.string.isRequired,
    dateInserted: PropTypes.string.isRequired,
    onDeleteComment: PropTypes.func,
  }

  onDeleteComment = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await this.props.onDeleteComment(this.props.commentID)
      } catch (err) {
        alert(`Can't delete this comment:\n${err.message}`)
      }
    }
  }

  render() {
    const { name } = this.props.insertUser
    const dateInserted = new Date(this.props.dateInserted)
    return (
      <div className="comment comment--detailed" data-comment-id={this.props.commentID}>
        <div className="sblist__author">
          <img
            src={this.props.insertUser.photoUrl}
            className="ProfilePhoto sblist__photo"
            alt={name}
          />
          <a href={getUserUrl(name)}>{name}</a>&nbsp;<span className="status-header__separator">·</span>&nbsp;<time>{distanceInWordsToNow(dateInserted)} ago</time>
        </div>
        <div className="comment__body">{stripHtmlTags(this.props.body)}</div>
        {this.props.onDeleteComment && (
          <div className="status__actions comment__actions">
            <button onClick={this.onDeleteComment} className="button">&times;</button>
          </div>
        )}

      </div>
    )
  }
}
