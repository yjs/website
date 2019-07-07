/* eslint-env browser */
import {
  navInternal, find, userlist
} from '../elements.js'

import * as time from 'lib0/time.js'
import * as math from 'lib0/math.js'

const mainContainer = find('main')

const scrollingElement = /** @type {HTMLElement} */ (document.scrollingElement || document.documentElement)

/**
 * @type {Element}
 */
let activeSection = mainContainer.children[0]
let lastScrollUpdate = time.getUnixTime()

const updateScrollInformation = () => {
  // find currently active element
  for (let currDiff = math.abs(activeSection.getBoundingClientRect().top), i = 0; i < mainContainer.children.length; i++) {
    const el = mainContainer.children[i]
    const nextDiff = math.abs(el.getBoundingClientRect().top)
    if (nextDiff < currDiff && nextDiff < 120) {
      currDiff = nextDiff
      activeSection = el
      break
    }
  }
  const activeId = activeSection.getAttribute('id') || ''
  for (let i = 0; i < navInternal.children.length; i++) {
    const el = navInternal.children[i].children[0] // get the <a> tag
    if ((el.getAttribute('href') || '').endsWith(activeId)) {
      el.classList.add('active')
    } else {
      el.classList.remove('active')
    }
  }
  lastScrollUpdate = time.getUnixTime()
  // if scrolled all the way to the top, show userlist
  if (scrollingElement.scrollTop === 0) {
    userlist.setAttribute('show', 'true')
  } else {
    userlist.removeAttribute('show')
  }
}

addEventListener('scroll', updateScrollInformation)
updateScrollInformation()

addEventListener('storage', event => {
  lastScrollUpdate = time.getUnixTime()
  const localStorageLocation = localStorage.getItem('location')
  if (location.hash.slice(1) !== localStorageLocation) {
    location.hash = '#' + localStorageLocation
  }
})

addEventListener('hashchange', () => {
  lastScrollUpdate = time.getUnixTime()
  if (location.hash.slice(1) !== localStorage.getItem('location')) {
    localStorage.setItem('location', location.hash.slice(1))
  }
})

// update location.hash
setInterval(() => {
  if (!document.hasFocus()) {
    lastScrollUpdate = time.getUnixTime()
  }
  if (time.getUnixTime() - lastScrollUpdate > 150 && location.hash.length > 0 && (activeSection.getAttribute('id') || '').length > 0 && activeSection.getAttribute('id') !== location.hash.slice(1) && document.hasFocus()) {
    const scroll = scrollingElement.scrollTop
    location.hash = '#' + activeSection.getAttribute('id')
    scrollingElement.scrollTop = scroll
    localStorage.setItem('location', /** @type {string} */ (activeSection.getAttribute('id')))
  }
}, 150)

// fallback if scrollingElement has no style
;(scrollingElement.style || {}).scrollBehavior = 'smooth'
