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
    categoryID: PropTypes.number.isRequired,
    onDeleteActivity: PropTypes.func,
    onChangeCategory: PropTypes.func,
    onCloseDiscussion: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        categoryID: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        children: PropTypes.array,
      })
    ),
    isLegacy: PropTypes.bool,
    comments: PropTypes.arrayOf(PropTypes.shape()), // only for legacy activities
  }

  state = {
    updateTimestamp: 0,
  }

  onDeleteActivity = async () => {
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      try {
        await this.props.onDeleteActivity()
        this.props.onCloseDiscussion({ forceUpdate: true })
      } catch (err) {
        alert(`Can't delete this discussion:\n${err.message}`)
      }
    }
  }

  onChangeCategory = async ev => {
    if (window.confirm('Are you sure you want to change the category of this discussion?')) {
      try {
        await this.props.onChangeCategory(ev.target.value)
        this.props.onCloseDiscussion({ forceUpdate: true })
      } catch (err) {
        alert(`Can't change the category of this discussion:\n${err.message}`)
      }
    }
  }

  /**
   * A bit of recursive magic to help displaying the categories.
   * They can be nested, we need them in a flat array
   * @param {Array|Object} ctg one or more categories
   * @returns {Array|Object}
   */
  flattenCategories = ctg => {
    if (Array.isArray(ctg)) {
      // this is flattening arrays (produced by children processing, below)
      return ctg.reduce((accu, crt) => accu.concat(this.flattenCategories(crt)), [])
    }
    const simplifiedCategory = {
      categoryID: ctg.categoryID,
      name: ctg.name,
      depth: ctg.depth,
    }

    // process any children (and grand-grand-...-children)
    const { children } = ctg
    if (children && children.length) {
      return this.flattenCategories([simplifiedCategory].concat(this.flattenCategories(children)))
    }
    return simplifiedCategory // this is the useful part of the category
  }

  render() {
    const { onDeleteActivity, onChangeCategory, categories, isLegacy } = this.props
    const userName = this.props.insertUser.name
    return (
      <div className="td-status__details">
        <div className="td-status__header" data-discussion-id={this.props.discussionID}>
          <div className="td-status__author">
            <img
              src={this.props.insertUser.photoUrl}
              className="ProfilePhoto td-status__photo"
              alt={userName}
            />
            <a href={getUserUrl(userName)}>{userName}</a>&nbsp;
            <span className="td-status__separator">·</span>&nbsp;
            <time>{distanceInWordsToNow(this.props.dateInserted)} ago</time>
          </div>
          <div className="td-status__content">
            <div className="td-status__text">{stripHtmlTags(this.props.body)}</div>
          </div>
          {(onChangeCategory || onDeleteActivity) && (
            <div className="td-status__actions">
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
                <button onClick={this.onDeleteActivity} className="td-status__delete">
                  &times;
                </button>
              )}
            </div>
          )}
        </div>
        <Comments
          discussionID={this.props.discussionID}
          countComments={this.props.countComments}
          showDetails
          updateTimestamp={this.state.updateTimestamp}
          legacyCommentList={this.props.comments}
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
