export function setModifierToColor(color: string, modifier: string | number) {
  return color.split('.')[0] + `.${modifier}`;
}
