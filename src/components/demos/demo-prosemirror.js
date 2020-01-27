import * as component from 'lib0/component.js'
import * as dom from 'lib0/dom.js'
import * as pair from 'lib0/pair.js'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'

import { ySyncPlugin, ySyncPluginKey, yCursorPlugin, yUndoPlugin, yUndoPluginKey, undo, redo } from 'y-prosemirror'
import { schema } from './demo-prosemirror-schema.js'
import * as elements from '../../elements.js'
import { defineVersions } from 'y-webcomponents'

import * as Y from 'yjs'

import * as sharedTypes from '../../sharedTypes.js'
const versionType = sharedTypes.versionType

defineVersions()

const clearProsemirrorDemo = () => {
  const elems = elements.demoContent.querySelectorAll('.demo-prosemirror')
  for (let i = 0; i < elems.length; i++) {
    elems[i].remove()
  }
}

if (!elements.find('#prosemirror-style')) {
  document.body.appendChild(dom.element('link', [pair.create('rel', 'stylesheet'), pair.create('href', '/src/components/demos/demo-prosemirror.css'), pair.create('id', 'prosemirror-style')]))
}

const colors = [
  // { light: '#ee635233', dark: '#ee6352' },
  { light: '#6eeb8333', dark: '#6eeb83' },
  { light: '#ecd44433', dark: '#ecd444' }
]

component.createComponent('y-demo-prosemirror', {
  template: `<y-versions></y-versions>`,
  style: `
    y-versions {
      margin-top: .7em;
      max-height: 10em;
    }
  `,
  state: { },
  childStates: {
    'y-versions': (state, component) => ({
      versions: versionType.toArray(),
      addVersion: () => {
        const prevSnapshot = 0 < versionType.length ? Y.decodeSnapshot(versionType.get(0).snapshot) : Y.emptySnapshot
        const snapshot = Y.snapshot(sharedTypes.doc)
        if (!Y.equalSnapshots(prevSnapshot, snapshot)) {
          versionType.insert(0, [{ name: `Version ${versionType.length}`, snapshot: Y.encodeSnapshot(snapshot) }])
        }
      },
      selectVersion: (v, index) => {
        const editorview = /** @type {any} */ (component).pmView
        const snapshot = index < 0 ? null : Y.decodeSnapshot(versionType.get(index).snapshot)
        const prevSnapshot = index + 1 < versionType.length ? Y.decodeSnapshot(versionType.get(index + 1).snapshot) : Y.emptySnapshot
        editorview.dispatch(editorview.state.tr.setMeta(ySyncPluginKey, { snapshot, prevSnapshot }))
      },
      unselectVersion: () => {
        const editorview = /** @type {any} */ (component).pmView
        // editorview.dispatch(editorview.state.tr.setMeta(ySyncPluginKey, { snapshot: null, prevSnapshot: null }))
        const binding = ySyncPluginKey.getState(editorview.state).binding
        if (binding != null) {
          binding.unrenderSnapshot()
        }
      }
    })
  },
  onStateChange: (state, prevState, component) => {
    if (!state) {
      versionType.unobserve(component._internal.versionListener)
      clearProsemirrorDemo()
      if (/** @type {any} */ (component).pmView) {
        setTimeout(() => {
          /** @type {any} */ (component).pmView.destroy()
        })
      }
      // todo destroy old state
    } else {
      if (prevState == null) {
        component._internal.versionListener = () => {
          const yVersions = /** @type {any} */ (component.shadowRoot).querySelector('y-versions')
          yVersions.updateState({ versions: versionType.toArray() })
        }
        versionType.observe(component._internal.versionListener)
        // attach editor
        const editorDom = dom.element('div', [pair.create('class', 'demo-prosemirror')])
        clearProsemirrorDemo()
        elements.demoContent.appendChild(editorDom)
        const editorView = new EditorView(editorDom, {
          state: EditorState.create({
            schema,
            plugins: [
              ySyncPlugin(sharedTypes.prosemirrorEditorContent, { permanentUserData: sharedTypes.permanentUserData, colors }),
              yCursorPlugin(sharedTypes.awareness),
              yUndoPlugin(),
              keymap({
                'Mod-z': undo,
                'Mod-y': redo,
                'Mod-Shift-z': redo
              })
            ].concat(exampleSetup({ schema }))
          })
        })
        ;/** @type {any} */ (component).pmView = editorView
        const undoState = yUndoPluginKey.getState(editorView.state)
        sharedTypes.setUndoManager(undoState.undoManager)
      }
      }
  }
})
