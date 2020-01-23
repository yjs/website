import * as dcomps from 'd-components'
import * as component from 'lib0/component.js'
import * as types from '../sharedTypes.js'

dcomps.defineTab()

component.createComponent('y-demos', {
  template: '<d-tab></d-tab>',
  state: { doc: types.doc, awareness: types.awareness },
  childStates: {
    'd-tab': state => ({
      items: [
        { title: 'ProseMirror', import: () => import('./demos/demo-prosemirror.js'), component: 'y-demo-prosemirror', state },
        { title: 'Quill', import: () => import('./demos/demo-quill.js'), component: 'y-demo-quill', state },
        { title: 'Drawing', import: () => import('./demos/demo-drawing.js'), component: 'y-demo-drawing', state }
      ],
      selected: 0
    })
  }
})
