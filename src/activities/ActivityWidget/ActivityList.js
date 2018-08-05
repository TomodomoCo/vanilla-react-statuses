import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { stripHtmlTags, getUserUrl } from '@tomodomo/vanilla-react-utils'
import Comments from '../../comments/CommentsExpandableSummary'

const { LIMIT_ACTIVITY_COMMENTS } = window.tomodomo.config

export default class ActivityList extends PureComponent {
  static displayName = 'ActivityList'

  static propTypes = {
    discussions: PropTypes.arrayOf(
      PropTypes.shape({
        discussionID: PropTypes.number.isRequired,
        dateInserted: PropTypes.string.isRequired,
        lastPost: PropTypes.shape({
          dateInserted: PropTypes.string,
        }),
        body: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        categoryID: PropTypes.number,
        countComments: PropTypes.number,
        insertUser: PropTypes.shape({
          userID: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          photoUrl: PropTypes.string.isRequired,
        }),
      })
    ).isRequired,
    onOpenDiscussion: PropTypes.func,
  }

  onOpenDiscussion = discussion => ev => {
    if (ev.preventDefault) { // fixme: calls with different param types = confusion
      ev.preventDefault()
    }
    this.props.onOpenDiscussion(discussion.discussionID, discussion.url)
  }

  render() {
    const { discussions } = this.props
    if (!discussions.length) {
      return <div className="td-status__empty">Nothing new</div>
    }
    return (
      <ul className="td-status__list">
        {discussions.map(discussion => (
          <li className="td-status__item" key={discussion.discussionID}>
            <div className="td-status__author">
              <img
                src={discussion.insertUser.photoUrl}
                className="ProfilePhoto td-status__photo"
                alt={discussion.insertUser.name}
              />
              <a href={getUserUrl(discussion.insertUser.name)}>{discussion.insertUser.name}</a>
              &nbsp;posted a&nbsp;
              <a
                href={discussion.url}
                onClick={this.onOpenDiscussion(discussion)}
              >
                status
              </a>:
            </div>
            <div className="td-status__content">
              <div className="td-status__text">{stripHtmlTags(discussion.body)}</div>
              <Comments
                discussionID={discussion.discussionID}
                countComments={discussion.countComments}
                limitCount={LIMIT_ACTIVITY_COMMENTS}
                onClick={this.onOpenDiscussion(discussion)}
              />
            </div>
          </li>
        ))}
      </ul>
    )
  }
}
