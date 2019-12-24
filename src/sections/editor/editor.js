import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from './schema.js'
import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'

import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import * as shared from '../../sharedTypes.js'
import { editor } from '../../elements.js'

const prosemirrorView = new EditorView(editor, {
  state: EditorState.create({
    schema,
    plugins: [
      ySyncPlugin(shared.prosemirrorEditorContent),
      yCursorPlugin(shared.awareness),
      yUndoPlugin(),
      keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo
      })
    ].concat(exampleSetup({ schema }))
  })
})
