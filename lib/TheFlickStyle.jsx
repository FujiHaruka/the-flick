'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import TheStyle from 'the-style'
import { asStyleData } from 'the-component-util'

/** Style for TheFlick */
const TheFlickStyle = ({id, className, options}) => (
  <TheStyle {...{id}}
            className={c('the-flick-style', className)}
            styles={TheFlickStyle.data(options)}
  />
)

TheFlickStyle.displayName = 'TheFlickStyle'
TheFlickStyle.propTypes = {
  /** Style options */
  options: PropTypes.object
}

TheFlickStyle.defaultProps = {
  options: {}
}

TheFlickStyle.data = (options) => {
  const {ThemeValues} = TheStyle
  const {
    dominantColor = ThemeValues.dominantColor,
    contentWidth = ThemeValues.contentWidth
  } = options
  return asStyleData('.the-flick', {
    '&': {
      display: 'none',
      backgroundColor: 'transparent',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      zIndex: 99
    },
    '.the-flick-back': {
      backgroundColor: 'rgba(0,0,0,0.66)',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      zIndex: 1
    },
    '.the-flick-back-inner': {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      display: 'block'
    },
    '.the-flick-inner': {
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      padding: '36px 24px',
      zIndex: 4,
      justifyContent: 'center',
      flexDirection: 'column'
    },
    '.the-flick-close-button': {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: '16px',
      fontSize: '16px',
      lineHeight: `16px`,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 44
    },
    '.the-flick-body': {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
      background: 'rgba(44, 44, 44, 0.9)',
      border: '1px solid #111',
      borderRadius: '4px',
      transition: 'height 300ms',
      zIndex: 4,
      color: '#AAA'
    },
    '.the-flick-image-body-inner': {
      display: 'flex',
      position: 'relative',
      boxSizing: 'border-box',
      alignItems: 'flex-start',
      '&.the-flick-image-body-inner-animating': {
        transition: 'transform 300ms'
      },
      '&.react-draggable-dragging': {
        transition: 'none'
      }
    },
    '.the-flick-image-wrap': {
      width: '100%'
    },
    '.the-flick-image-wrap-active': {},
    '.the-flick-image': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '4px 32px',
      boxSizing: 'border-box',
      '.the-image': {
        background: 'transparent'
      },
      '.the-image-spin': {
        fontSize: '44px',
        color: '#888'
      }
    },
    '.the-flick-image-title': {
      color: '#CCC',
      display: 'block',
      margin: '8px 0',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '1.5em'
    },
    '.the-flick-image-description': {},
    '.the-flick-flip-button-wrap': {
      position: 'absolute',
      zIndex: 5,
      top: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '1px',
      overflow: 'visible'
    },
    '.the-flick-flip-button': {
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderColor: '#EEE',
      color: '#CCC',
      height: '128px',
      padding: 0,
      minWidth: '21px',
      borderRadius: '4px',
      '&:active': {
        color: '#888'
      }
    },
    '&.the-flick-present': {
      display: 'block'
    }
  })
}

export default TheFlickStyle
