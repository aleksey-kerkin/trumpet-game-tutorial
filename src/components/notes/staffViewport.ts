type BBox = { x: number; y: number; width: number; height: number }

const PAD_TOP = 8
const PAD_BOTTOM = 16
const ANNOTATION_PAD_BOTTOM = 24
const CLEF_PAD_ABOVE = 24
const CLEF_PAD_BELOW = 8

function unionBBox(a: BBox | null, b: BBox | null): BBox | null {
  if (!b) return a
  if (!a) return b
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  const right = Math.max(a.x + a.width, b.x + b.width)
  const bottom = Math.max(a.y + a.height, b.y + b.height)
  return { x, y, width: right - x, height: bottom - y }
}

function elementBBox(el: SVGGraphicsElement): BBox | null {
  try {
    const box = el.getBBox()
    if (box.width <= 0 && box.height <= 0) return null
    return { x: box.x, y: box.y, width: box.width, height: box.height }
  } catch {
    return null
  }
}

function applyClefPadding(svg: SVGSVGElement, contentBBox: BBox): BBox {
  const staveEl = svg.querySelector('.vf-stave') as SVGGraphicsElement | null
  const staveBox = staveEl ? elementBBox(staveEl) : null
  if (!staveBox) return contentBBox

  const top = Math.min(contentBBox.y, staveBox.y - CLEF_PAD_ABOVE)
  const bottom = Math.max(
    contentBBox.y + contentBBox.height,
    staveBox.y + staveBox.height + CLEF_PAD_BELOW,
  )
  return {
    x: Math.min(contentBBox.x, staveBox.x),
    y: top,
    width:
      Math.max(contentBBox.x + contentBBox.width, staveBox.x + staveBox.width) -
      Math.min(contentBBox.x, staveBox.x),
    height: bottom - top,
  }
}

export function measureStaffContentBBox(svg: SVGSVGElement): BBox {
  let contentBBox: BBox | null = null

  for (const stave of svg.querySelectorAll('.vf-stave')) {
    contentBBox = unionBBox(contentBBox, elementBBox(stave as SVGGraphicsElement))
  }

  for (const el of svg.querySelectorAll('path, line, rect')) {
    contentBBox = unionBBox(contentBBox, elementBBox(el as SVGGraphicsElement))
  }

  if (!contentBBox) {
    const fallback = svg.getBBox()
    return { x: fallback.x, y: fallback.y, width: fallback.width, height: fallback.height }
  }

  if (svg.querySelector('.vf-clef')) {
    return applyClefPadding(svg, contentBBox)
  }

  return contentBBox
}

export function fitStaffViewport(
  svg: SVGSVGElement,
  renderWidth: number,
  hasCaption: boolean,
): number {
  const bbox = measureStaffContentBBox(svg)
  const extraBottom = hasCaption ? ANNOTATION_PAD_BOTTOM : 0
  const height = bbox.height + PAD_TOP + PAD_BOTTOM + extraBottom
  svg.setAttribute('viewBox', `0 ${bbox.y - PAD_TOP} ${renderWidth} ${height}`)
  svg.setAttribute('width', String(renderWidth))
  svg.setAttribute('height', String(height))
  svg.style.width = `${renderWidth}px`
  svg.style.height = `${height}px`
  svg.style.display = 'block'
  return height
}
