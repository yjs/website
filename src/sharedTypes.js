
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'

const websocketUrl = 'wss://demos.yjs.dev'

export const doc = new Y.Doc()
export const websocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website', doc)
export const awareness = websocketProvider.awareness
// export const webrtcProvider = new WebrtcProvider('yjs-website', doc, { awareness })
export const prosemirrorEditorContent = doc.getXmlFragment('prosemirror')

/**
 * An array of draw element.
 * A draw element is a Y.Map that has a type attribute. We will support only type "path", but you could also define type "text", or type "rectangle".
 *
 * @type {Y.Array<Y.Map<Y.Array|String|object>>}
 */
export const drawingContent = doc.getArray('drawing')

// @ts-ignore
window.ydoc = doc
// @ts-ignore
window.awareness = awareness
// @ts-ignor
// window.webrtcProvider = webrtcProvider 
// @ts-ignore
window.websocketProvider = websocketProvider
