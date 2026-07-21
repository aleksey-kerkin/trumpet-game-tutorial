import { describe, expect, it } from 'vitest'
import { fitStaffViewport } from './staffViewport'

function mockBBox(el: SVGGraphicsElement, box: DOMRectInit) {
  el.getBBox = () => ({
    x: box.x ?? 0,
    y: box.y ?? 0,
    width: box.width ?? 0,
    height: box.height ?? 0,
    ...box,
  } as DOMRect)
}

function createStaffSvg(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  mockBBox(svg, { x: 0, y: 0, width: 300, height: 120 })

  const stave = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  stave.setAttribute('class', 'vf-stave')
  mockBBox(stave, { x: 8, y: 24, width: 240, height: 72 })
  svg.appendChild(stave)

  const noteHead = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  mockBBox(noteHead, { x: 120, y: 40, width: 12, height: 8 })
  svg.appendChild(noteHead)

  return svg
}

describe('fitStaffViewport', () => {
  it('sets viewBox and dimensions from content bbox', () => {
    const svg = createStaffSvg()
    const height = fitStaffViewport(svg, 280, false)

    expect(svg.getAttribute('viewBox')).toBe('0 16 280 96')
    expect(svg.getAttribute('width')).toBe('280')
    expect(svg.getAttribute('height')).toBe(String(height))
    expect(height).toBeGreaterThan(0)
  })

  it('adds extra bottom padding when caption is present', () => {
    const svg = createStaffSvg()
    const withoutCaption = fitStaffViewport(svg, 280, false)
    const withCaption = fitStaffViewport(createStaffSvg(), 280, true)

    expect(withCaption).toBeGreaterThan(withoutCaption)
  })
})
