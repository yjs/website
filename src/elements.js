
/**
 * @param {string} selector
 * @return {HTMLElement}
 */
export const find = selector => /** @type {HTMLElement} */ (document.body.querySelector(selector))

export const mainContainer = find('main')
export const nav = find('nav')
export const navInternal = find('.nav-internal')
export const editor = find('#editor')
export const features = find('#features')
export const intro = find('#intro')
export const introCursors = find('#intro-cursors')
export const userlist = find('#userlist')
export const hamburgerCheckbox = /** @type {HTMLInputElement} */ (find('#hamburger-checkbox'))
export const demoContent = find('#demo-content')