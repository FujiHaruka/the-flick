'use strict'

import c from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import Draggable from 'react-draggable'
import { TheButton } from 'the-button'
import { eventHandlersFor, htmlAttributesFor, toggleBodyClass } from 'the-component-util'
import { TheCondition } from 'the-condition'
import { TheIcon } from 'the-icon'
import { TheSpin } from 'the-spin'
import TheFlickImage from './TheFlickImage'
import TheFlickStyle from './TheFlickStyle'

const toggleDocumentScroll = (enabled) => toggleBodyClass('the-flick-fix', enabled)

/**
 * Flickable viewer of the-components
 */
class TheFlick extends React.Component {
  static FlipButton ({className, icon, onClick, style}) {
    return (
      <div className='the-flick-flip-button-wrap'
           {...{style}}>
        <TheButton className={c('the-flick-flip-button', className)}
                   {...{icon, onClick}}
        />
      </div>
    )
  }

  constructor (props) {
    super(props)
    const s = this
    s.state = {
      animating: false,
      draggingPosition: null,
      nextIndex: props.activeIndex || 0,
    }
    s.body = null
    s.imageWraps = []
    s.movingTimer = -1
  }

  changeIndexTo (nextIndex) {
    const s = this
    const {activeIndex, onChange} = s.props
    const {body} = s
    const amount = nextIndex - activeIndex
    s.moveTo(body.offsetWidth * amount * -1, () =>
      onChange({activeIndex: nextIndex})
    )
  }

  componentDidMount () {
    const s = this
    const {props} = s
    toggleDocumentScroll(props.present)
  }

  componentWillReceiveProps (nextProps) {
    const s = this
    const {props} = s
    if (props.present !== nextProps.present) {
      toggleDocumentScroll(nextProps.present)
    }

    const nextIndex = nextProps.activeIndex
    const updateNextIndex = (nextIndex === null) || (props.activeIndex !== nextIndex)
    if (updateNextIndex) {
      s.setState({nextIndex})
    }
  }

  componentWillUnmount () {
    const s = this
    clearTimeout(s.movingTimer)
    toggleDocumentScroll(false)
  }

  getBounds () {
    const s = this
    const {activeIndex, images} = s.props
    const bounds = {bottom: 0, top: 0}
    if (activeIndex === 0) {
      bounds.right = 20
    }
    if (activeIndex === images.length - 1) {
      bounds.left = -20
    }
    return bounds
  }

  handleDragDrag (e, data) {
    const s = this
    const {body} = s
    if (!body) {
      return
    }
    const {activeIndex} = s.props
    const {x} = data
    const amount = s.moveAmountFor(x)
    const nextIndex = activeIndex + amount
    if (s.state.nextIndex !== nextIndex) {
      s.setState({nextIndex})
    }
  }

  handleDragStart (e) {
    const s = this
    clearTimeout(s.movingTimer)
    s.setState({
      animating: false,
      draggingPosition: null,
      nextIndex: s.props.activeIndex,
    })
  }

  handleDragStop (e, data) {
    const s = this
    const {body} = s
    if (!body) {
      return
    }
    const {x} = data
    const amount = s.moveAmountFor(x)
    const {activeIndex, onChange} = s.props
    const toLeft = amount < 0
    if (toLeft) {
      s.changeIndexTo(activeIndex - 1)
      return
    }
    const toRight = amount > 0
    if (toRight) {
      s.changeIndexTo(activeIndex + 1)
      return
    }
    s.moveTo(0)
  }

  moveAmountFor (x) {
    const s = this
    const {body} = s
    const threshold = Math.min(80, body.offsetWidth / 2)
    const {activeIndex, images} = s.props
    const count = images.length
    const toLeft = (threshold < x) && (0 < activeIndex)
    if (toLeft) {
      return -1
    }
    const toRight = x < (threshold * -1) && (activeIndex < count - 1)
    if (toRight) {
      return 1
    }
    return 0
  }

  moveTo (x, callback) {
    const s = this
    s.setState({animating: true})
    clearTimeout(s.movingTimer)
    s.setState({draggingPosition: {x, y: 0}})
    s.movingTimer = setTimeout(() => {
      s.setState({
        animating: false,
        draggingPosition: {x: 0, y: 0},
      })
      callback && callback()
    }, 300)
  }

  render () {
    const s = this
    const {props, state} = s
    const {
      animating,
      draggingPosition,
      nextIndex,
    } = state
    const {
      activeIndex,
      children,
      className,
      images,
      onClose,
      present,
      spinning,
      title,
    } = props

    const count = images.length
    return (
      <div {...htmlAttributesFor(props, {except: ['className']})}
           {...eventHandlersFor(props, {except: []})}
           className={c('the-flick', className, {
             'the-flick-present': present,
           })}
      >
        <div className='the-flick-inner'>
          <div className='the-flick-back' onClick={() => onClose()}>
            <div className='the-flick-back-inner'/>
          </div>
          <div className='the-flick-content'>
            <div className='the-flick-header'>
              <div className='the-flick-header-row'>
              </div>
              <div className='the-flick-header-row'>
                <h5 className='the-flick-header-title'>{title || `${activeIndex + 1} / ${count}`}</h5>
              </div>
              <div className='the-flick-header-row'>
                <a className='the-flick-close-button'
                   onClick={() => onClose()}>
                  <TheIcon className={TheFlick.CLOSE_ICON}/>
                </a>
              </div>
            </div>
            <div className='the-flick-body'
                 ref={(body) => { s.body = body }}>
              <TheCondition if={spinning}>
                <TheSpin className='the-flick-spin'
                         cover
                         enabled={spinning}
                />
              </TheCondition>

              <TheCondition if={nextIndex > 0}>
                <TheFlick.FlipButton icon={TheFlick.PREV_ICON}
                                     onClick={() => s.changeIndexTo(activeIndex - 1)}
                                     style={{left: '16px'}}
                />
              </TheCondition>
              <TheCondition if={nextIndex < count - 1}>
                <TheFlick.FlipButton icon={TheFlick.NEXT_ICON}
                                     onClick={() => s.changeIndexTo(activeIndex + 1)}
                                     style={{right: '16px'}}
                />
              </TheCondition>
              <Draggable axis='x'
                         bounds={s.getBounds()}
                         onDrag={(e, data) => s.handleDragDrag(e, data)}
                         onStart={(e, data) => s.handleDragStart(e, data)}
                         onStop={(e, data) => s.handleDragStop(e, data)}
                         position={draggingPosition}
              >
                <div className={c('the-flick-image-body-inner', {
                  'the-flick-image-body-inner-animating': animating,
                })}
                     style={{
                       left: `${activeIndex * -100}%`,
                       width: `${count * 100}%`,
                     }}
                >
                  {
                    images
                      .map((props) => typeof props === 'string' ? {src: props} : props)
                      .map((props, i, arr) => (
                        <div className={c('the-flick-image-wrap', {
                               'the-flick-image-wrap-active': i === activeIndex,
                             })}
                             key={i}
                             ref={(imageWrap) => {s.imageWraps[i] = imageWrap}}
                        >
                          <TheCondition if={Math.abs(activeIndex - i) < 2}>
                            <TheFlick.Image {...props}/>
                          </TheCondition>
                        </div>
                      ))
                  }
                </div>
              </Draggable>
              {children}
            </div>
            <div className='the-flick-footer'>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

TheFlick.Style = TheFlickStyle
TheFlick.Image = TheFlickImage
TheFlick.CLOSE_ICON = 'fa fa-times'
TheFlick.PREV_ICON = 'fa fa-chevron-left'
TheFlick.NEXT_ICON = 'fa fa-chevron-right'

TheFlick.propTypes = {
  /** Flick title */
  /** Active index of images */
  activeIndex: PropTypes.number,
  /** Images to flip */
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ).isRequired,
  /** Handle index change */
  onChange: PropTypes.func.isRequired,
  /** Close handler */
  onClose: PropTypes.func.isRequired,
  /** Shows the dialog */
  present: PropTypes.bool.isRequired,
  /** Show spin */
  spinning: PropTypes.bool,
  title: PropTypes.string,
}

TheFlick.defaultProps = {
  activeIndex: 0,
  images: [],
  onChange: () => {},
  onClose: () => {},
  present: false,
  spinning: false,
  title: null,
}

TheFlick.displayName = 'TheFlick'

export default TheFlick
