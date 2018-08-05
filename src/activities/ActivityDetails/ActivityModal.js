import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import ActivityDetails from './ActivityDetails.container'

export default class ActivityModal extends PureComponent {
  static propTypes = {
    discussionID: PropTypes.number,
    onCloseDiscussion: PropTypes.func.isRequired,
  }

  render() {
    const { onCloseDiscussion, discussionID } = this.props
    return (
      <Modal
        isOpen={!!discussionID}
        className="td-status__modal"
        overlayClassName="td-status__modal__overlay"
        contentLabel="Status Details"
        onRequestClose={onCloseDiscussion}
        ariaHideApp={false}
      >
        <button onClick={onCloseDiscussion} style={{ float: 'right' }}>
          x
        </button>
        <ActivityDetails {...this.props} />
      </Modal>
    )
  }
}
