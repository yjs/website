
import CodeMirror from 'codemirror'
import { features } from '../elements.js'
import 'codemirror/mode/javascript/javascript.js'

const codemirrorEditor = CodeMirror.fromTextArea(features.querySelector('#features-typedemo'), {
  mode: 'javascript',
  readOnly: 'nocursor',
  autofocus: false
})
