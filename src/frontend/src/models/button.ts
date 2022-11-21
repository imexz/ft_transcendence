export default class Button {
  constructor(button: any) {
    this.icon = button.icon;
    this.emit = button.emit;
    this.tooltip = button.tooltip;
  }
  icon: string
  emit: string
  tooltip: string
}