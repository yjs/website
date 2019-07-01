import * as elements from '../elements.js'

elements.mainContainer.addEventListener('click', event => {
  if (event.target !== elements.hamburgerCheckbox) {
    elements.hamburgerCheckbox.checked = false
  }
})
