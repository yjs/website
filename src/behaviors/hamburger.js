import * as elements from '../elements.js'

elements.mainContainer.addEventListener('click', event => {
  elements.hamburgerCheckbox.checked = false
})

elements.navInternal.addEventListener('click', event => {
  elements.hamburgerCheckbox.checked = false
})