import React from 'react'
import Meta from 'react-helmet'
import ListView from '../common/ListView'
import CartItem from './CartItem'
import Button from '../common/input/Button'
import { boxShadow } from '../common/defaultStyles'

import mockCartItems from '../../test/cart/mockCartItems'

const SHOW_MORE_INCREMENT = 10

const styleCenterContent = {
  display: 'flex',
  justifyContent: 'center',
}

const styleCartListWrapper = {
  maxWidth: '80em',
  width: '80em',
  boxShadow: boxShadow,
  marginRight: '3px',
  marginLeft: '1px',
  backgroundColor: 'white',
  color: '#222',
}

const styleShowMore = {
  margin: '1em auto 1.618em auto',
}
const styleShowMoreFocus = {
  outline: '2px dashed #5C87AC',
  outlineOffset: '.118em',
}

export default class Cart extends React.Component {

  constructor(props) {
    super()
    this.state = {
      numShownItems: props.numberOfGranulesSelected < SHOW_MORE_INCREMENT ? props.numberOfGranulesSelected : SHOW_MORE_INCREMENT,
    }
  }

  // handleExpandableToggle = event => {
  //   // prevent focus-change state from disrupting if each expandable is open
  //   let toggledElement = event.value
  //   this.setState({
  //     [toggledElement]: event.open,
  //   })
  // }

  propsForResult = (item, itemId) => {
    return {
      // handleExpandableToggle: this.handleExpandableToggle
    }
  }

  handleSelectItem = e => {
    console.log("handleSelectItem: e = ", e)
  }

  handleShowMore = () => {
    const { numberOfGranulesSelected } = this.props
    const { numShownItems } = this.state
    if(numShownItems < numberOfGranulesSelected) {

      const nextNumShownItems = (numShownItems + SHOW_MORE_INCREMENT) > numberOfGranulesSelected
          ? numberOfGranulesSelected
          : (numShownItems + SHOW_MORE_INCREMENT)

      this.setState(prevState => {
        return {
          ...prevState,
          numShownItems: nextNumShownItems,
        }
      })
    }
  }

  render() {

    const {loading, selectedGranules, numberOfGranulesSelected} = this.props
    const { numShownItems } = this.state

    const showMoreButton =
        numShownItems < numberOfGranulesSelected ? (
            <Button
                text="Show More"
                onClick={this.handleShowMore}
                style={styleShowMore}
                styleFocus={styleShowMoreFocus}
            />
        ) : null

    return (
        <div style={styleCenterContent}>
          <Meta
              title="File Access Cart"
              robots="noindex"
          />

          <div style={styleCartListWrapper}>
            <ListView
                items={mockCartItems}
                loading={!!loading}
                resultsMessage={"Selected Granules"}
                shown={numShownItems}
                total={numberOfGranulesSelected}
                onItemSelect={this.handleSelectItem}
                ListItemComponent={CartItem}
                GridItemComponent={null}
                propsForItem={this.propsForResult}
            />
            {showMoreButton}
          </div>
        </div>
    )
  }
}