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
  render(html`${Array.from(shared.awareness.getStates().entries()).filter(([clientid, state]) => state.user != null).map(([clientid, state]) => userTemplate(state.user.name, state.user.color, state.user.colorLight, clientid === shared.doc.clientID))}`, elements.userlist)
}

// @ts-ignore
shared.awareness.on('change', renderUserlist)
