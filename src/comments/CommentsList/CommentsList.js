import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SimpleComment from './SimpleComment'
import DetailedComment from './DetailedComment'

export default class CommentsList extends PureComponent {
  static propTypes = {
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        commentID: PropTypes.number.isRequired,
        body: PropTypes.string.isRequired,
        insertUser: PropTypes.shape({
          name: PropTypes.string.isRequired,
          photoUrl: PropTypes.string.isRequired,
        }).isRequired,
      }),
    ).isRequired,
    showDetails: PropTypes.bool,
    yielderOnDeleteComment: PropTypes.func,
  }

  render() {
    const Comment = this.props.showDetails ? DetailedComment : SimpleComment
    return (
      <ul className="comments">
        {this.props.comments.map(comment => (
          <li key={comment.commentID} className="sblist__item">
            <Comment {...comment} onDeleteComment={this.props.yielderOnDeleteComment(comment)} />
          </li>
        ))}
      </ul>
    )
  }
}
