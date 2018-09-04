import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
      <div className="status__actions actions Options">
        <span className={`ToggleFlyout OptionsMenu ${isExpanded ? 'Open' : ''}`}>
          <span className="Button-Options" tabindex="0" role="button" aria-haspopup="true" aria-expanded={ isExpanded }>
            <span className="OptionsTitle" title="Options" />
            <span
              aria-hidden="true"
              className="Arrow SpFlyoutHandle"
              // timeout enough to let the event bubble up first - we want the handler from the highest
              // level to run before this one (otherwise it overwrites these effects)
              onClick={() => setTimeout(() => this.setState({ isExpanded: !isExpanded }), 10)}
            />
          </span>
          <ul
            className="Flyout MenuItems list-reset"
            role="menu"
            aria-labelledby="dropdown"
            aria-hidden="false"
            style={{ display: isExpanded ? 'block' : 'none' }}
            ref={element => {
              this.popoverElement = element
            }}
          >
            {this.props.modToolsElement}
          </ul>
        </span>
      </div>
    )
  }
}
