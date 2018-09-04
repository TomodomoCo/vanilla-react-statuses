import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import ModToolsWrapper from '../../common/ModToolsWrapper'

export default class DiscussionActions extends PureComponent {
  static propTypes = {
    discussionCategoryID: PropTypes.number.isRequired,
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
    const { onDeleteActivity, onChangeCategory, categories } = this.props

    if (!onDeleteActivity && !onChangeCategory) return null

    const modToolsElement = (
      <Fragment>
        {onChangeCategory &&
        categories && (
          <li role="presentation" className="no-icon">
            <div className="status__move">
              <label>Move Status</label>
              <select
                name="categories"
                onChange={this.onChangeCategory}
                defaultValue={this.props.discussionCategoryID}
              >
                {this.flattenCategories(categories).map(({ categoryID, name, depth }) => (
                  <option value={categoryID} key={categoryID}>
                    {'- '.repeat(depth - 1) + name}
                  </option>
                ))}
              </select>
            </div>
          </li>
        )}
        {onDeleteActivity && (
          <li role="presentation" className="no-icon">
            <a href="javascript:;" role="menuitem" className="dropdown-menu-link dropdown-menu-link-edit" onClick={this.onDeleteActivity}>Delete Status</a>
          </li>
        )}
      </Fragment>
    )
    return <ModToolsWrapper modToolsElement={modToolsElement} />
  }
}
