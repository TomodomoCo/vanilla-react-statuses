import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { stripHtmlTags, getUserUrl } from '@tomodomo/vanilla-react-utils'

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
      <div>
        <div className="td-status__author">
          <img
            src={this.props.insertUser.photoUrl}
            className="ProfilePhoto td-status__photo"
            alt={name}
          />
          <a href={getUserUrl(name)} className="td-status__username">{name}</a>&nbsp;
          <span className="td-status__separator">·</span>&nbsp;
          <span className="td-status__time">
            <time>{distanceInWordsToNow(dateInserted)} ago</time>
          </span>
        </div>
        <div className="td-status__content">
          <div className="td-status__text">
            {stripHtmlTags(this.props.body)}
          </div>
        </div>
        <div className="td-status__actions">
          {this.props.onDeleteComment && (
            <div className="td-status__action">
              <label className="td-status__action-label">Manage</label>
              <button onClick={this.onDeleteComment} className="td-status__delete">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
