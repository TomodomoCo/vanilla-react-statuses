import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MentionsInput, Mention } from 'react-mentions'

const { ACTIVITY_COMMENT_MAXLEN } = window.tomodomo.config

export default class NewCommentForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    userProfile: PropTypes.shape({
      name: PropTypes.string.isRequired,
      photoUrl: PropTypes.string.isRequired,
    }),
    tagSearch: PropTypes.func, // not required: if exists, it will be used
  }

  state = {
    text: '',
  }

  onChange = (event) => {
    this.setState({ text: event.target.value })
  }

  onSubmit = event => {
    this.props.onSubmit(event, this.state.text)
    this.setState({ text: '' })
  }

  render() {
    const { userProfile } = this.props
    const charsCountdown = ACTIVITY_COMMENT_MAXLEN - this.state.text.length
    return (
      <div className="FormWrapper td-status-form td-status-form--comment">
        {userProfile && (
          <img src={userProfile.photoUrl} alt={userProfile.name} className="ProfilePhoto td-status-form__photo" />
        )}
        <form className="Comment td-status-form__form" onSubmit={this.onSubmit}>
          <MentionsInput
            className="mentions"
            wrap={1}
            rows={3}
            cols={5}
            placeholder="Leave a comment"
            maxLength={ACTIVITY_COMMENT_MAXLEN || undefined}
            onChange={this.onChange}
            value={this.state.text}
            markup={'@"__display__"'}
            displayTransform={(id, display, type) => (
              '@' + display
            )}
          >
            {this.props.tagSearch && (
              <Mention
                className="user-mention"
                trigger="@"
                onAdd={(...args) => console.log('added a new mention', ...args)}
                data={this.props.tagSearch}
                appendSpaceOnAdd={true}
                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                  <div className="user-tag">{highlightedDisplay}</div>
                )}
              />
            )}
          </MentionsInput>
          <div className="td-status-form__footer">
            <div className="td-status-form__count">
            {!!ACTIVITY_COMMENT_MAXLEN &&
              charsCountdown !== ACTIVITY_COMMENT_MAXLEN && (
                <span>{charsCountdown} characters left</span>
              )}
            </div>
            <div className="td-status-form__actions">
              <input
                type="submit"
                value="Add Reply"
                className="Button Primary td-status-form__submit"
                disabled={!this.state.text}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}
