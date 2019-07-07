import { html, render } from 'lit-html'
import * as shared from './sharedTypes.js'
import * as elements from './elements.js'

/**
 * @param {string} name
 * @param {string} color
 * @param {boolean} islocaluser
 */
const userTemplate = (name, color, colorLight, islocaluser) => html`<div y-islocaluser="${islocaluser.toString()}" style="background-color:${colorLight};border-color:${color}">${name}</div>`
export const renderUserlist = () => {
  render(html`${Array.from(shared.awareness.getStates().entries()).map(([clientid, state]) => userTemplate(state.username, state.color, state.colorLight, clientid === shared.doc.clientID))}`, elements.userlist)
}

shared.awareness.on('change', renderUserlist)
