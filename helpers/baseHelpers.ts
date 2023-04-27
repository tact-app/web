export function setModifierToColor(
  color: string,
  modifier: string | number,
  separator: string = '.'
) {
  return color.split('.')[0] + `${separator}${modifier}`;
}

export function colorToCssVariable(color: string) {
  return `var(--chakra-colors-${color.split('.').join('-')})`;
}

export function getBoxShadowAsBorder(color: string, width: number = 1) {
  return `inset 0px 0px 0px ${width}px ${colorToCssVariable(color)}`
}
