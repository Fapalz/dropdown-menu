export default class MenuItem {
  constructor(item, options = {}) {
    this.element = item
    this.timeoutOver = null
    this.timeoutOut = null
    this.options = MenuItem.mergeSettings(options)
  }

  static mergeSettings(options) {
    const settings = {
      out: () => {},
      over: () => {},
      delayOver: 100,
      delayOut: 250,
    }

    return Object.assign(settings, options)
  }

  itemOver() {
    if (this.timeoutOver) {
      clearTimeout(this.timeoutOver)
    }

    this.opening = true

    this.timeoutOver = setTimeout(() => {
      if (this.opening) {
        this.options.over(this.element)
      }
    }, this.options.delayOver)
  }

  itemOut() {
    if (this.timeoutOut) {
      clearTimeout(this.timeoutOut)
    }

    this.opening = false

    this.timeoutOut = setTimeout(() => {
      if (!this.opening) {
        this.options.out(this.element)
      }
    }, this.options.delayOut)
  }
}
