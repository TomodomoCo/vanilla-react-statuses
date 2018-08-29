import React, { Component } from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { stripHtmlTags, getUserUrl } from '@tomodomo/vanilla-react-utils'
import Comments from '../../comments/CommentsList'
import NewCommentForm from '../../comments/NewCommentForm'

export default class ActivityDetails extends Component {
  static propTypes = {
    discussionID: PropTypes.number.isRequired,
    dateInserted: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    countComments: PropTypes.number,
    insertUser: PropTypes.shape({
      userID: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      photoUrl: PropTypes.string.isRequired,
    }),
    // categoryID: PropTypes.number.isRequired,
    isLegacy: PropTypes.bool,
    comments: PropTypes.arrayOf(PropTypes.shape()), // only for legacy activities
    actionsElement: PropTypes.element,
  }

  state = {
    updateTimestamp: 0,
  }

  render() {
    const { isLegacy } = this.props
    const userName = this.props.insertUser.name
    return (
      <div className="td-status__details">
        <div className="td-status__item td-status__item--primary" data-discussion-id={this.props.discussionID}>
          <div className="td-status__author">
            <img
              src={this.props.insertUser.photoUrl}
              className="ProfilePhoto td-status__photo"
              alt={userName}
            />
            <a href={getUserUrl(userName)} className="td-status__username">{userName}</a>&nbsp;
            <span className="td-status__separator">·</span>&nbsp;
            <span className="td-status__time">
              <time>{distanceInWordsToNow(this.props.dateInserted)} ago</time>
            </span>
          </div>
          <div className="td-status__content">
            <div className="td-status__text">{stripHtmlTags(this.props.body)}</div>
          </div>
          {(onChangeCategory || onDeleteActivity) && (
            <div className="status__actions activity__actions">
              {onChangeCategory &&
              categories && (
                <select
                  name="categories"
                  onChange={this.onChangeCategory}
                  defaultValue={this.props.categoryID}
                >
                  {this.flattenCategories(categories).map(({ categoryID, name, depth }) => (
                    <option value={categoryID} key={categoryID}>
                      {'- '.repeat(depth - 1) + name}
                    </option>
                  ))}
                </select>
              )}
              {onDeleteActivity && (
                <button onClick={this.onDeleteActivity} className="button">
                  &times;
                </button>
              )}
            </div>
          )}
          {this.props.actionsElement}
        </div>
        <Comments
          discussionID={this.props.discussionID}
          countComments={this.props.countComments}
          showDetails
          updateTimestamp={this.state.updateTimestamp}
          commentList={this.props.comments}
          isLegacy={isLegacy}
        />
        {!isLegacy && (
          <NewCommentForm
            discussionID={this.props.discussionID}
            // when a new comment is added, we must update <Comments/>
            onSubmit={() => {
              this.setState({ updateTimestamp: new Date().getTime() })
            }}
          />
        )}
      </div>
    )
  }
}
