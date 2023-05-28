export function colorToCssVariable(color: string) {
  return `var(--chakra-colors-${color.split('.').join('-')})`;
}

export function getBoxShadowAsBorder(color: string, width: number = 1) {
  return `inset 0px 0px 0px ${width}px ${colorToCssVariable(color)}`
}
