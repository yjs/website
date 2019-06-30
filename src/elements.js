
/**
 * @param {string} selector
 * @return {Element}
 */
export const find = selector => /** @type {Element} */ (document.body.querySelector(selector))

export const mainContainer = find('main')
export const nav = find('nav')
export const navInternal = find('.nav-internal')
export const editor = find('#editor')
export const features = find('#features')
export const intro = find('#intro')
export const introCursors = find('#intro-cursors')
export const userlist = find('#userlist')