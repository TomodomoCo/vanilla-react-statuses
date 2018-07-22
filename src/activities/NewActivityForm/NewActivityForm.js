import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MentionsInput, Mention } from 'react-mentions'
import './styles.scss'

const { ACTIVITY_POST_MAXLEN } = window.tomodomo.config

export default class NewActivityForm extends Component {
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

  onChange = event => {
    this.setState({ text: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
    this.props.onSubmit(this.state.text)
    this.setState({ text: '' })
  }

  render() {
    const { userProfile, tagSearch } = this.props
    const charsCountdown = ACTIVITY_POST_MAXLEN - this.state.text.length
    return (
      <div className="FormWrapper FormWrapper-Condensed activity-form-wrapper">
        {userProfile && (
          <img src={userProfile.photoUrl} alt={userProfile.name} className="ProfilePhoto" />
        )}
        <form className="Activity activity-form" id="tem_activity" onSubmit={this.onSubmit}>
          <MentionsInput
            className="mentions"
            wrap={1}
            rows={3}
            cols={5}
            placeholder="What's on your mind?"
            maxLength={ACTIVITY_POST_MAXLEN || undefined}
            onChange={this.onChange}
            value={this.state.text}
            markup={'@"__display__"'}
            displayTransform={(id, display, type) => (
              '@' + display
            )}
          >
            {tagSearch && (
              <Mention
                className="user-mention"
                trigger="@"
                onAdd={(...args) => console.log('added a new mention', ...args)}
                data={tagSearch}
                appendSpaceOnAdd={true}
                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                  <div className="user-tag">{highlightedDisplay}</div>
                )}
              />
            )}
          </MentionsInput>
          {!!ACTIVITY_POST_MAXLEN && charsCountdown !== ACTIVITY_POST_MAXLEN && (
            <div className="chars-countdown">
              {charsCountdown} characters left
            </div>
          )}
          <div className="Buttons">
            <input
              type="submit"
              id="Form_Share"
              name="Share"
              value="Submit"
              className="Button Primary"
              disabled={!this.state.text.length}
            />
          </div>
        </form>
      </div>
    )
  }
}
