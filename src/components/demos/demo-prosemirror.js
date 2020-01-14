import * as component from 'lib0/component.js'
import * as dom from 'lib0/dom.js'
import * as pair from 'lib0/pair.js'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'

import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import { schema } from './demo-prosemirror-schema.js'
import * as elements from '../../elements.js'

const clearProsemirrorDemo = () => {
  const elems = elements.demoContent.querySelectorAll('.demo-prosemirror')
  for (let i = 0; i < elems.length; i++) {
    elems[i].remove()
  }
}

if (!elements.find('#prosemirror-style')) {
  document.body.appendChild(dom.element('link', [pair.create('rel', 'stylesheet'), pair.create('href', '/src/components/demos/demo-prosemirror.css'), pair.create('id', 'prosemirror-style')]))
}

component.createComponent('y-demo-prosemirror', {
  onStateChange: (state, prevState, component) => {
    if (!state) {
      clearProsemirrorDemo()
      if (/** @type {any} */ (component).pmView) {
        setTimeout(() => {
          /** @type {any} */ (component).pmView.destroy()
        })
      }
      // todo destroy old state
    } else {
      const { doc, awareness } = state
      if (doc && awareness) {
        const editorDom = dom.element('div', [pair.create('class', 'demo-prosemirror')])
        clearProsemirrorDemo()
        elements.demoContent.appendChild(editorDom)
        ;/** @type {any} */ (component).pmView = new EditorView(editorDom, {
          state: EditorState.create({
            schema,
            plugins: [
              ySyncPlugin(doc.getXmlFragment('prosemirror')),
              yCursorPlugin(awareness),
              yUndoPlugin(),
              keymap({
                'Mod-z': undo,
                'Mod-y': redo,
                'Mod-Shift-z': redo
              })
            ].concat(exampleSetup({ schema }))
          })
        })
      }
    }
  }
})
