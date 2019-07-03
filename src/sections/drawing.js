import * as Y from 'yjs' // eslint-disable-line
import * as elements from '../elements.js'
import * as shared from '../sharedTypes.js'
import { userColor, usercolors } from '../usercolor.js'

const ctx = /** @type {CanvasRenderingContext2D} */ (elements.drawingCanvas.getContext('2d'))
const yDrawingContent = shared.drawingContent

const requestAnimationFrame = window.requestAnimationFrame || setTimeout

/**
 * @typedef {object} Coordinate
 * @property {number} Coordinate.x
 * @property {number} Coordinate.y
 */

let needToRedraw = true
let currentColor = '#333'

/**
 * Draw the canvas
 */
const draw = () => {
  if (needToRedraw) {
    needToRedraw = false
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    yDrawingContent.forEach(drawElement => {
      if (drawElement.get('type') === 'path') {
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.lineJoin = ctx.lineCap = 'round'
        const coordinate = /** @type {Coordinate} */ (drawElement.get('coordinate'))
        const color = /** @type {string} */ (drawElement.get('color'))
        const path = /** @type {Y.Array<Coordinate>} */ (drawElement.get('path'))
        ctx.shadowBlur = 2
        ctx.shadowColor = color
        ctx.beginPath()
        ctx.moveTo(coordinate.x * width, coordinate.y * height)
        ctx.strokeStyle = color
        let lastPoint = coordinate
        path.forEach(c => {
          // @todo this can be optimized by considering the previous coordinates too
          const pointBetween = {
            x: (c.x + lastPoint.x) / 2,
            y: (c.y + lastPoint.y) / 2
          }
          ctx.quadraticCurveTo(lastPoint.x * width, lastPoint.y * height, pointBetween.x * width, pointBetween.y * height)
          lastPoint = c
        })
        ctx.lineTo(lastPoint.x * width, lastPoint.y * height)
        ctx.stroke()
      }
    })
  }
}

yDrawingContent.observeDeep(() => {
  needToRedraw = true
  requestAnimationFrame(draw)
})

let currPath = null

const calculateCoordinateFromEvent = event => {
  const canvasRect = elements.drawingCanvas.getBoundingClientRect()
  return { x: (event.clientX - canvasRect.left) / canvasRect.width, y: (event.clientY - canvasRect.top) / canvasRect.height }
}

elements.drawingCanvas.addEventListener('mousedown', event => {
  const drawElement = new Y.Map()
  drawElement.set('color', currentColor)
  drawElement.set('type', 'path')
  drawElement.set('coordinate', calculateCoordinateFromEvent(event))
  currPath = new Y.Array()
  drawElement.set('path', currPath)
  yDrawingContent.push([drawElement])
})

const clearCurrPath = event => {
  currPath = null
}

elements.drawingCanvas.addEventListener('mouseleave', clearCurrPath)
elements.drawingCanvas.addEventListener('mouseup', clearCurrPath)

elements.drawingCanvas.addEventListener('mousemove', event => {
  if (currPath !== null) {
    currPath.push([calculateCoordinateFromEvent(event)])
  }
})

/**
 * @param {string} color
 */
const setCurrentColor = color => {
  elements.drawingMenubarActionColor.style.backgroundColor = color
  currentColor = color
}

elements.find('#drawer-menubar-colors-black').addEventListener('click', () =>
  setCurrentColor('#333')
)
elements.find('#drawer-menubar-colors-orange').addEventListener('click', () =>
  setCurrentColor('#ffbc42')
)
elements.find('#drawer-menubar-colors-blue').addEventListener('click', () =>
  setCurrentColor('#30bced')
)
elements.find('#drawer-menubar-colors-green').addEventListener('click', () =>
  setCurrentColor('#6eeb83')
)

elements.drawingMenubarActionClear.addEventListener('click', () => {
  yDrawingContent.delete(0, yDrawingContent.length)
  elements.drawingMenubarCheckbox.checked = false
})
