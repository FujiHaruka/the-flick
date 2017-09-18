'use strict'

import React from 'react'
import { TheFlick, TheFlickStyle } from 'the-flick'
import { TheButton, TheButtonStyle } from 'the-button'
import { TheSpinStyle } from 'the-spin'
import { TheImageStyle } from 'the-image'

const imageUrls = [
  'https://raw.githubusercontent.com/apeman-asset-labo/apeman-asset-images/master/dist/dummy/01.jpg',
  'https://raw.githubusercontent.com/apeman-asset-labo/apeman-asset-images/master/dist/dummy/02.jpg',
  'https://raw.githubusercontent.com/apeman-asset-labo/apeman-asset-images/master/dist/dummy/03.jpg',
  'https://raw.githubusercontent.com/apeman-asset-labo/apeman-asset-images/master/dist/dummy/04.jpg',
]

class ExampleComponent extends React.PureComponent {
  constructor (props) {
    super(props)
    const s = this
    s.state = {
      activeIndex: 1,
      present: true
    }
  }

  render () {
    const s = this
    return (
      <div>
        <TheButtonStyle/>
        <TheSpinStyle/>
        <TheImageStyle/>
        <TheFlickStyle/>

        <TheButton onClick={() => s.setState({present: true})}>
          Show Flick Images
        </TheButton>
        <TheFlick activeIndex={s.state.activeIndex}
                  onChange={({activeIndex}) => s.setState({activeIndex})}
                  present={s.state.present}
                  onClose={() => s.setState({present: false})}
                  images={[
                    imageUrls[0],
                    {src: imageUrls[1], spinning: true},
                    {src: imageUrls[2], title: 'Some title'},
                    {src: imageUrls[3], title: 'Some title', description: 'This is image description'},
                  ]}
        />
      </div>

    )
  }
}

export default ExampleComponent
