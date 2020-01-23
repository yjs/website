
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const websocketUrl = 'wss://demos.yjs.dev'

const suffix = '-v2'

export const doc = new Y.Doc()
export const websocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website' + suffix, doc)
// export const webrtcProvider = new WebrtcProvider('yjs-website' + suffix, doc)
export const awareness = websocketProvider.awareness // websocketProvider.awareness

export const indexeddbPersistence = new IndexeddbPersistence('yjs-website' + suffix, doc)

export const prosemirrorDoc = new Y.Doc({ gc: false })
prosemirrorDoc.clientID = doc.clientID // This is only okay because these documents are virtually the same and must share the same awareness state
export const prosemirrorWebsocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website-prosemirror' + suffix, prosemirrorDoc)
// export const prosemirrorWebrtcProvider = new WebrtcProvider('yjs-website-prosemirror' + suffix, prosemirrorDoc)
export const prosemirrorIndexeddbPersistence = new IndexeddbPersistence('yjs-website-prosemirror' + suffix, prosemirrorDoc)
export const prosemirrorEditorContent = prosemirrorDoc.getXmlFragment('prosemirror')

export const versionDoc = new Y.Doc()
// this websocket provider doesn't connect
export const versionWebsocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website-version' + suffix, versionDoc, { connect: false })
versionWebsocketProvider.connectBc() // only connect via broadcastchannel
export const versionIndexeddbPersistence = new IndexeddbPersistence('yjs-website-version' + suffix, versionDoc)
export const versionType = versionDoc.getArray('versions')

class LocalRemoteUserData extends Y.PermanentUserData {
  /**
   * @param {number} clientid
   * @return {string}
   */
  getUserByClientId (clientid) {
    return super.getUserByClientId(clientid) || 'remote'
  }
  /**
   * @param {Y.ID} id
   * @return {string}
   */
  getUserByDeletedId (id) {
    return super.getUserByDeletedId(id) || 'remote'
  }
}

export const permanentUserData = new LocalRemoteUserData(prosemirrorDoc, versionDoc.getMap('users'))
versionIndexeddbPersistence.whenSynced.then(() => {
  permanentUserData.setUserMapping(prosemirrorDoc, prosemirrorDoc.clientID, 'local', {})
})

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
window.versionDoc = versionDoc
// @ts-ignore
window.awareness = awareness
// @ts-ignore
// window.webrtcProvider = webrtcProvider
// @ts-ignore
window.websocketProvider = websocketProvider
// @ts-ignore
window.indexeddbPersistence = indexeddbPersistence
// @ts-ignore
window.prosemirrorDoc = prosemirrorDoc
// @ts-ignore
window.prosemirrorEditorContent = prosemirrorEditorContent