
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export const doc = new Y.Doc()
console.log('ws://localhost:1234')
export const provider = new WebsocketProvider('ws://localhost:1234', 'yjs.dev', doc)
export const awareness = provider.awareness
export const prosemirrorEditorContent = /** @type {Y.XmlFragment} */ (doc.get('prosemirror', Y.XmlFragment))

