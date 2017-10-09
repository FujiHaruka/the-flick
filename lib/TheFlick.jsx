'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import TheFlickStyle from './TheFlickStyle'
import { htmlAttributesFor, eventHandlersFor, toggleBodyClass, isVideoSrc } from 'the-component-util'
import { get } from 'the-window'
import { TheSpin } from 'the-spin'
import { TheIcon } from 'the-icon'
import { TheButton } from 'the-button'
import { TheImage } from 'the-image'
import { TheVideo } from 'the-video'
import { TheCondition } from 'the-condition'
import Draggable from 'react-draggable'

const toggleDocumentScroll = (enabled) => toggleBodyClass('the-flick-fix', enabled)

/**
 * Flickable viewer of the-components
 */
class TheFlick extends React.Component {
  constructor (props) {
    super(props)
    const s = this
    s.state = {
      draggingPosition: null,
      animating: false,
      nextIndex: props.activeIndex || 0
    }
    s.body = null
    s.imageWraps = []
    s.movingTimer = -1
    s.resizeTimer = -1
  }

  render () {
    const s = this
    const {props, state} = s
    const {
      draggingPosition,
      animating,
      nextIndex
    } = state
    const {
      title,
      className,
      present,
      spinning,
      children,
      images,
      onClose,
      activeIndex
    } = props

    const count = images.length
    return (
      <div {...htmlAttributesFor(props, {except: ['className']})}
           {...eventHandlersFor(props, {except: []})}
           className={c('the-flick', className, {
             'the-flick-present': present
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
                <a onClick={() => onClose()}
                   className='the-flick-close-button'>
                  <TheIcon className={TheFlick.CLOSE_ICON}/>
                </a>
              </div>
            </div>
            <div className='the-flick-body'
                 ref={(body) => { s.body = body }}>
              <TheCondition if={spinning}>
                <TheSpin enabled={spinning}
                         cover
                         className='the-flick-spin'
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
                         position={draggingPosition}
                         onStart={(e, data) => s.handleDragStart(e, data)}
                         onDrag={(e, data) => s.handleDragDrag(e, data)}
                         onStop={(e, data) => s.handleDragStop(e, data)}
                         bounds={s.getBounds()}
              >
                <div className={c('the-flick-image-body-inner', {
                  'the-flick-image-body-inner-animating': animating
                })}
                     style={{
                       left: `${activeIndex * -100}%`,
                       width: `${count * 100}%`
                     }}
                >
                  {
                    images.map((props, i, arr) => (
                      <div key={i}
                           className={c('the-flick-image-wrap', {
                             'the-flick-image-wrap-active': i === activeIndex
                           })}
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

  componentDidMount () {
    const s = this
    const {props} = s
    toggleDocumentScroll(props.present)
    s.resizeTimer = setInterval(() => {

    }, 500)
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
    clearTimeout(s.resizeTimer)
    toggleDocumentScroll(false)
  }

  getBounds () {
    const s = this
    const {activeIndex, images} = s.props
    const bounds = {top: 0, bottom: 0}
    if (activeIndex === 0) {
      bounds.right = 20
    }
    if (activeIndex === images.length - 1) {
      bounds.left = -20
    }
    return bounds
  }

  handleDragStart (e) {
    const s = this
    clearTimeout(s.movingTimer)
    s.setState({
      nextIndex: s.props.activeIndex,
      draggingPosition: null,
      animating: false
    })
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

  moveTo (x, callback) {
    const s = this
    s.setState({animating: true})
    clearTimeout(s.movingTimer)
    s.setState({draggingPosition: {x, y: 0}})
    s.movingTimer = setTimeout(() => {
      s.setState({
        animating: false,
        draggingPosition: {x: 0, y: 0}
      })
      callback && callback()
    }, 300)
  }

  moveAmountFor (x) {
    const s = this
    const {body} = s
    const threshold = Math.min(80, body.offsetWidth / 2)
    const {images, activeIndex} = s.props
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

  changeIndexTo (nextIndex) {
    const s = this
    const {onChange, activeIndex} = s.props
    const {body} = s
    const amount = nextIndex - activeIndex
    s.moveTo(body.offsetWidth * amount * -1, () =>
      onChange({activeIndex: nextIndex})
    )
  }

  static FlipButton ({onClick, icon, className, style}) {
    return (
      <div className='the-flick-flip-button-wrap'
           {...{style}}>
        <TheButton className={c('the-flick-flip-button', className)}
                   {...{icon, onClick}}
        />
      </div>
    )
  }

  static Image (props) {
    if (typeof props === 'string') {
      props = {src: props}
    }
    const {
      src,
      alt,
      title,
      type,
      description
    } = props

    const isVideo = (type === 'video') || isVideoSrc(src)
    return (
      <div className='the-flick-image'>
        <TheCondition if={isVideo}>
          <TheVideo clasName={c('the-flick-image-image')}
                    preload='metadata'
                    scale='fit'
                    controls
                    {...{src, alt}}
          />
        </TheCondition>
        <TheCondition unless={isVideo}>
          <TheImage clasName={c('the-flick-image-image')}
                    scale='fit'
                    {...{src, alt}}
          />
        </TheCondition>
        <TheCondition if={Boolean(title)}>
          <h3 className='the-flick-image-title'>{title}</h3>
        </TheCondition>
        <TheCondition if={Boolean(description)}>
          <div className='the-flick-image-description'>{description}</div>
        </TheCondition>
      </div>
    )
  }
}

TheFlick.Style = TheFlickStyle
TheFlick.CLOSE_ICON = 'fa fa-close'
TheFlick.PREV_ICON = 'fa fa-chevron-left'
TheFlick.NEXT_ICON = 'fa fa-chevron-right'

TheFlick.propTypes = {
  /** Flick title */
  title: PropTypes.string,
  /** Images to flip */
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ).isRequired,
  /** Active index of images */
  activeIndex: PropTypes.number,
  /** Shows the dialog */
  present: PropTypes.bool.isRequired,
  /** Handle index change */
  onChange: PropTypes.func.isRequired,
  /** Close handler */
  onClose: PropTypes.func.isRequired,
  /** Show spin */
  spinning: PropTypes.bool
}

TheFlick.defaultProps = {
  title: null,
  images: [],
  activeIndex: 0,
  present: false,
  onClose: () => {},
  onChange: () => {},
  spinning: false
}

TheFlick.displayName = 'TheFlick'

export default TheFlick
