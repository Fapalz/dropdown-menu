/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import MenuItem from './MenuItem'
import DropdownMenu from './DropdownMenu'

const NavigationMenu = (options) => {
  const DEFAULTS = {
    dropDown: '.dropdown',
    dropDownMenu: '.dropdown-menu',
    container: '.dropdown-container',
    toRightClass: 'toright',
    delayOver: 100,
    delayOut: 250,
  }

  const settings = Object.assign(DEFAULTS, options)

  const state = {
    items: {},
    dropdowns: {},
    idCnt: 1,
    currentItem: null,
    overItem: null,
    outItem: null,
  }

  function getDropdown(dropdown) {
    if (!dropdown) return null

    const id = !dropdown.dataset.dropdownMenuIndex
      ? (dropdown.dataset.dropdownMenuIndex = state.idCnt++)
      : dropdown.dataset.dropdownMenuIndex

    if (!state.dropdowns[id]) state.dropdowns[id] = new DropdownMenu(dropdown)

    return state.dropdowns[id]
  }

  function findDropdow(item) {
    return item.querySelector(settings.dropDownMenu)
  }

  function cleardropdownStyle(el) {
    el.style.left = null
    el.style.right = null
    el.classList.remove(settings.toRightClass)
  }

  function setPopupAlign(dropdown) {
    if (!dropdown) return

    const container = document.querySelector(settings.container)

    cleardropdownStyle(dropdown)

    const isHasParentdropdownMenu = !!dropdown.parentElement.closest(
      settings.dropDownMenu
    )
    const isToRight = !!dropdown.parentElement.closest(
      `${settings.dropDownMenu}.${settings.toRightClass}`
    )
    const dropdownRightEdge =
      dropdown.getBoundingClientRect().left + dropdown.offsetWidth
    const containerRightEdge =
      container.getBoundingClientRect().left + container.offsetWidth

    if (dropdownRightEdge > containerRightEdge || isToRight) {
      const addleft = containerRightEdge - dropdownRightEdge

      if (isHasParentdropdownMenu || isToRight) {
        dropdown.style.left = 'auto'
        dropdown.style.right = '100%'
        dropdown.classList.add(settings.toRightClass)
      } else {
        const style = getComputedStyle(dropdown)
        const currentLeft = parseInt(style.left, 10)
        dropdown.style.left = `${currentLeft + addleft}px`
      }
    }
  }

  function dropdownShow(item) {
    const dropdown = findDropdow(item)
    const dropdownInstance = getDropdown(dropdown)
    if (!dropdownInstance) {
      return
    }
    dropdownInstance.show()
    setPopupAlign(dropdown)
  }

  function dropdownHide(item) {
    const dropdown = findDropdow(item)
    const dropdownInstance = getDropdown(dropdown)
    if (!dropdownInstance) {
      return
    }
    dropdownInstance.hide()
  }

  function getItem(item) {
    if (!item) return null

    const id = !item.dataset.dropdownItemIndex
      ? (item.dataset.dropdownItemIndex = state.idCnt++)
      : item.dataset.dropdownItemIndex

    if (!state.items[id])
      state.items[id] = new MenuItem(item, {
        over: () => {
          dropdownShow(item)
        },
        out: () => {
          dropdownHide(item)
        },
        delayOver: settings.delayOver,
        delayOut: settings.delayOut,
      })

    return state.items[id]
  }

  function itemOver(item) {
    const menuItem = getItem(item)
    if (!menuItem) return

    state.overItem = menuItem
    menuItem.itemOver()
  }

  function itemOut(item) {
    const menuItem = getItem(item)
    if (!menuItem) return

    state.outItem = menuItem
    menuItem.itemOut()
  }

  const items = Array.prototype.slice.call(
    document.querySelectorAll(settings.dropDown)
  )
  items.forEach((element) => {
    element.addEventListener('mouseenter', function () {
      itemOver(this)
    })

    element.addEventListener('mouseleave', function () {
      itemOut(this)
    })
  })
}

export default NavigationMenu
