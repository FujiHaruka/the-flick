/**
 * Test for TheFlickImage.
 * Runs with mocha.
 */
'use strict'

import TheFlickImage from '../lib/TheFlickImage'
import React from 'react'
import { ok, equal } from 'assert'
import { render } from 'the-script-test'

describe('the-flick-image', () => {
  before(() => {
  })

  after(() => {
  })

  it('Render a component', () => {
    let element = render(
       <TheFlickImage />
    )
    ok(element)
  })
})

/* global describe, before, after, it */
