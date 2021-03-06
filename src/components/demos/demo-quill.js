import * as component from 'lib0/component.js'
import * as dom from 'lib0/dom.js'
import * as pair from 'lib0/pair.js'
import * as sharedTypes from '../../sharedTypes.js'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'

import * as elements from '../../elements.js'

/** @type {any} */ (Quill).register('modules/cursors', QuillCursors)

const clearQuillDemo = () => {
  const elems = elements.demoContent.querySelectorAll('.demo-quill')
  for (let i = 0; i < elems.length; i++) {
    elems[i].remove()
  }
}

let cssLoaded = false
let whenCssLoaded = () => {}

if (!elements.find('#quill-style')) {
  const quillStyle = document.body.appendChild(dom.element('link', [pair.create('rel', 'stylesheet'), pair.create('href', '/styles/quill.snow.css'), pair.create('id', 'quill-style')]))
  document.body.appendChild(dom.element('link', [pair.create('rel', 'stylesheet'), pair.create('href', '/styles/katex.min.css')]))
  document.body.appendChild(dom.element('link', [pair.create('rel', 'stylesheet'), pair.create('href', '/styles/monokai-sublime.min.css')]))
  ;/** @type {any} */ (quillStyle).onload = () => {
    cssLoaded = true
    whenCssLoaded()
  }
}

component.createComponent('y-demo-quill', {
  onStateChange: (state, prevState, component) => {
    if (!state) {
      clearQuillDemo()
      const binding = /** @type {any} */ (component).binding
      if (binding) {
        setTimeout(() => {
          binding.destroy()
        })
      }
    } else {
      const assignEditor = () => {
        if (state === component.state) {
          const { doc, awareness } = state
          if (doc && awareness) {
            const editorDom = dom.element('div')
            const containerDom = dom.element('div', [pair.create('class', 'demo-quill')], [editorDom])
            clearQuillDemo()
            elements.demoContent.appendChild(containerDom)

            // @ts-ignore
            var editor = new Quill(editorDom, {
              modules: {
                cursors: true,
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  ['image', 'code-block']
                ],
                history: {
                  userOnly: true
                }
              },
              placeholder: 'Start collaborating...',
              theme: 'snow' // or 'bubble'
            })
            const binding = new QuillBinding(doc.getText('quill-demo'), editor, awareness)
            ;/** @type {any} */ (component).binding = binding
            sharedTypes.setUndoManager(null)
          }
        }
      }

      if (!cssLoaded) {
        whenCssLoaded = assignEditor
      } else {
        assignEditor()
      }
    }
  }
})
