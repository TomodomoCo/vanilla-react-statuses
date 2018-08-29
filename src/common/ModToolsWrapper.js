import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './mod-tools.scss'

export default class ModToolsWrapper extends Component {
  static propTypes = {
    modToolsElement: PropTypes.element,
  }

  state = {
    isExpanded: false,
  }

  handlerClickOutside = ({ target }) => {
    if (!this.popoverElement.contains(target)) {
      this.setState({ isExpanded: false })
    }
  }

  componentWillMount() {
    window.addEventListener('click', this.handlerClickOutside)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handlerClickOutside)
  }


  render() {
    const { isExpanded } = this.state
    return (
      // selector '.Options .SpFlyoutHandle' is styled as a gear in vanilla's css
      <div className="status__actions activity__actions Options">
        <div
          aria-hidden="true"
          className="SpFlyoutHandle"
          // timeout enough to let the event bubble up first - we want the handler from the highest
          // level to run before this one (otherwise it overwrites these effects)
          onClick={() => setTimeout(() => this.setState({ isExpanded: !isExpanded }), 10)}
        />
        <div
          className="actions__popover"
          style={{ display: isExpanded ? 'block' : 'none' }}
          ref={element => {
            this.popoverElement = element
          }}
        >
          <div className="actions__arrow" />
          {this.props.modToolsElement}
        </div>
      </div>
    )
  }
}
