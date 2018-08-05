import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CommentsListContainer from './CommentsList'

// Shows the number of comments; when clicked, it toggles showing the list of comments or executes
// the given callback (onClick, if defined)
// Note: currently, it's always called with onClick defined
export default class CommentsExpandableSummary extends Component {
  static displayName = 'Comments'

  static propTypes = {
    discussionID: PropTypes.number.isRequired,
    countComments: PropTypes.number.isRequired,
    limitCount: PropTypes.number,
    href: PropTypes.string,
    onClick: PropTypes.func,
  }

  state = {
    isExpanded: false,
  }

  // if onClick was given, execute it, otherwise expand the comments
  onClick = (ev) => {
    ev.preventDefault()
    const { href, discussionID, onClick } = this.props
    if (onClick) {
      onClick(discussionID, href)
    } else {
      this.setState({ isExpanded: !this.state.isExpanded })
    }
  }

  getSummaryMessage = () => {
    const { countComments } = this.props
    switch (countComments) {
      case 0: return 'No comments'
      case 1: return '1 comment'
      default: return `${countComments} comments`
    }
  }

  render() {
    const summary = this.getSummaryMessage()
    return (
      <div className="td-status__comments">
        {summary && (
          <a
            className="td-status__comments__toggle"
            style={{ cursor: 'pointer' }}
            onClick={this.onClick}
            href={this.props.href}
          >
            {summary}
          </a>
        )}
        {this.state.isExpanded && (
          <CommentsListContainer
            discussionID={this.props.discussionID}
            limitCount={this.props.limitCount}
          />
        )}
      </div>
    )
  }
}
