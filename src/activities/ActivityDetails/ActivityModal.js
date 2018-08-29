import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import ActivityDetails from './ActivityDetails.container'

export default class ActivityModal extends PureComponent {
  static propTypes = {
    discussionID: PropTypes.number,
    onCloseDiscussion: PropTypes.func.isRequired,
  }

  // always update when the window is closed.
  // This update may not be needed, but it's better UX, because we already create some expectations
  // of real-time behaviour with the reactivity to user's own actions
  // Plus, it's a shortcut for updating the number of comments in the list
  // (in case the user added or deleted a comment in the activity)
  onRequestClose = () => this.props.onCloseDiscussion({ forceUpdate: true })

  render() {
    const { onCloseDiscussion, discussionID } = this.props
    return (
      <Modal
        isOpen={!!discussionID}
        className="td-status__modal"
        overlayClassName="td-status__modal__overlay"
        contentLabel="Status Details"
        onRequestClose={this.onRequestClose}
        ariaHideApp={false}
      >
        <button onClick={this.onRequestClose} style={{ float: 'right' }}>
          x
        </button>
        <ActivityDetails {...this.props} />
      </Modal>
    )
  }
}
