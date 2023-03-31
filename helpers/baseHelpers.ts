export function setModifierToColor(
  color: string,
  modifier: string | number,
  separator: string = '.'
) {
  return color.split('.')[0] + `${separator}${modifier}`;
}
