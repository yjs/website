
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export const doc = new Y.Doc()
const url = location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? 'ws://localhost:1234' : 'wss://yjs-demos.now.sh'
export const provider = new WebsocketProvider(url, 'yjs-website', doc)
export const awareness = provider.awareness
export const prosemirrorEditorContent = /** @type {Y.XmlFragment} */ (doc.get('prosemirror', Y.XmlFragment))

