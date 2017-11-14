'use strict'

import React from 'react'
import { TheImage } from 'the-image'
import c from 'classnames'
import { TheVideo } from 'the-video'
import { isVideoSrc } from 'the-component-util'
import { TheCondition } from 'the-condition'
import { get } from 'the-window'

class TheFlickImage extends React.Component {
  constructor (props) {
    super(props)
    const s = this
    s.resizeTimer = -1
    s.imageElm = null
    s.innerElm = null
    s.state = {
      scale: 1
    }
  }

  render () {
    const s = this
    const {
      src,
      alt,
      title,
      type,
      description
    } = s.props
    const {scale} = s.state

    const isVideo = (type === 'video') || isVideoSrc(src)
    return (
      <div className='the-flick-image'
           ref={(imageElm) => { s.imageElm = imageElm }}
      >
        <div className='the-flick-image-inner'
             ref={(innerElm) => { s.innerElm = innerElm }}
             style={scale < 1 ? {transform: `scale(${scale},${scale})`} : {}}
        >
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
                      width='auto'
                      height='auto'
            />
          </TheCondition>
          <div className='the-flick-image-info'>
            <TheCondition if={Boolean(title)}>
              <h3 className='the-flick-image-title'>{title}</h3>
            </TheCondition>
            <TheCondition if={Boolean(description)}>
              <div className='the-flick-image-description'>{description}</div>
            </TheCondition>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount () {
    const s = this
    s.resizeTimer = setInterval(() => {
      const {imageElm, innerElm} = s
      if (!imageElm || !innerElm) {
        return
      }
      const maxHeight = imageElm.offsetHeight
      const height = innerElm.offsetHeight
      const scale = Math.min(maxHeight, height) / height
      if (s.state.scale !== scale) {
        s.setState({scale})
      }
    }, 300)
  }

  componentWillUnmount () {
    const s = this
    clearTimeout(s.resizeTimer)
  }

}

export default TheFlickImage
