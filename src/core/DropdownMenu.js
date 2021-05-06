import {
  whenTransitionEnds,
  nextFrame,
} from '@fapalz/utils/src/utils/transition'

export default class DropdownMenu {
  constructor(element) {
    this.element = element
    this.isShow = false
  }

  show() {
    this.isShow = true
    this.element.classList.add('is-enter')

    nextFrame(() => {
      this.element.classList.add('is-enter-active')
    })
  }

  hide() {
    this.isShow = false
    this.element.classList.remove('is-enter-active')

    whenTransitionEnds(this.element, '', () => {
      if (this.isShow) return
      this.element.classList.remove('is-enter')
    })
  }
}
