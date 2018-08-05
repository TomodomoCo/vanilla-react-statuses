import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { stripHtmlTags, getUserUrl } from '@tomodomo/vanilla-react-utils'

export default class SimpleComment extends PureComponent {
  static propTypes = {
    insertUser: PropTypes.shape({
      photoUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    body: PropTypes.string.isRequired,
  }

  render() {
    const { name } = this.props.insertUser

    return (
      <div className="comment comment--simple">
        <div className="sblist__author">
          <img
            src={this.props.insertUser.photoUrl}
            className="ProfilePhoto sblist__photo"
            alt={name}
          />
          <a href={getUserUrl(name)}>{name}</a> replied:
        </div>
        <div className="comment__body">{stripHtmlTags(this.props.body)}</div>
      </div>
    )
  }
}
