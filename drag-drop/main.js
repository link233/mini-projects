const allUnitsArr = [ ...document.querySelectorAll('.one-unit') ]

allUnitsArr.forEach(item => {
  item.addEventListener('click', handleClick)
  item.addEventListener('mousedown', handleMouseDown)
  item.addEventListener('mouseup', handleMouseUp)
  item.addEventListener('transitionend', handleTransitionEnd)
})

/**
 * 添加功能
 */

// 单元拖拽时，阻止 非添加单元样式切换的事件处理
let clickable = true
let clickTimeId = 0

function handleClick (e) {
  if (!clickable) {
    clickable = true
    return
  }

  // 获取事件绑定的元素
  const target = e.currentTarget

  // 判断元素是否为添加按钮
  if (target.classList.contains('add-unit')) { // yes
    const rootDiv = document.createElement('div')
    rootDiv.classList.add('one-unit')

    const currency = document.createElement('div')
    currency.classList.add('currency')
    currency.innerText = 'CNY'

    const div = document.createElement('div')

    const spanInner1 = document.createElement('span')
    spanInner1.classList.add('num')
    spanInner1.innerText = '75'

    const spanInner2 = document.createElement('span')
    spanInner2.classList.add('symbol')
    spanInner2.innerText = '%'

    div.appendChild(spanInner1)
    div.appendChild(spanInner2)

    rootDiv.appendChild(currency)
    rootDiv.appendChild(div)

    rootDiv.addEventListener('click', handleClick)
    rootDiv.addEventListener('mousedown', handleMouseDown)
    rootDiv.addEventListener('mouseup', handleMouseUp)
    rootDiv.addEventListener('transitionend', handleTransitionEnd)

    e.currentTarget.parentNode.insertBefore(rootDiv, e.currentTarget.parentNode.lastElementChild)
  } else { // no
    const allUnitsArr = [ ...document.querySelectorAll('.one-unit') ]
    allUnitsArr.forEach(item => {
      item.classList.remove('selected-unit')
    })
    target.classList.add('selected-unit')
  }
}


/**
 * 拖拽功能 - 拖动主体
 */
const wallet = document.querySelector('.container')
const moveBar = document.querySelector('.moveBar')

// 是否允许拖动
let isStartedPos = false

const startedPos = { x: 0, y: 0 }
const baseDis = { x: 0, y: 0 }

let disX = 0
let disY = 0

// 在鼠标按下时，记录鼠标位置
moveBar.addEventListener('mousedown', (e) => {
  isStartedPos = true
  startedPos.x = e.clientX
  startedPos.y = e.clientY
})

// 在鼠标弹起时，记录当前移动到的位置
moveBar.addEventListener('mouseup', () => {
  isStartedPos = false
  baseDis.x = disX
  baseDis.y = disY
})

// 将滑动事件绑定在 body 上，这是因为如果滑动太快会脱离 moveBar 区域。
document.body.addEventListener('mousemove', (e) => {
  if (isStartedPos) {
    disX = baseDis.x + e.clientX - startedPos.x
    disY = baseDis.y + e.clientY - startedPos.y

    wallet.style.transform = `translate(${disX}px, ${disY}px)`
  }
})


/**
 * 拖拽功能 - 排序
 */

// 是否允许拖拽
let blockMoving = false

// 鼠标按下初始位置
const starteBlockPos = { x: 0, y: 0 }

// 元素移动距离
let blockDisX = 0
let blockDisY = 0

let target = null

let targetIndex = 0

let currentPosIndex = 0

let moveStep = 0

let blockWidth = 0

// 元素之间的间隙
const gapWidth = 16

function handleMouseDown (e) {
  if (e.currentTarget.classList.contains('add-unit')) return

  clickTimeId = setTimeout(() => {
    clickable = false
  }, 200)

  const allArr = [ ...document.querySelectorAll('.one-unit') ]
  allArr.forEach((item, index) => {
    if (item === e.currentTarget) {
      targetIndex = index
      currentPosIndex = index
    }
  })

  blockMoving = true

  starteBlockPos.x = e.clientX
  starteBlockPos.y = e.clientY

  target = e.currentTarget
  target.style.transition = `none`
  target.style.zIndex = 10

  blockWidth = target.getBoundingClientRect().width
}

function handleMouseUp (e) {
  if (e.currentTarget.classList.contains('add-unit')) return

  clearTimeout(clickTimeId)

  blockMoving = false

  const allUnits = document.querySelectorAll('.one-unit')

  if (moveStep < 0 - targetIndex) {
    moveStep = -targetIndex
  } else if (moveStep > allUnits.length - targetIndex - 2) {
    moveStep = allUnits.length - targetIndex - 2
  }

  target.style.transition = `all 0.2s ease-in-out`
  target.style.zIndex = 0

  target.style.transform = `translateX(${moveStep * (blockWidth + gapWidth)}px)`
  moveStep = 0
}

document.body.addEventListener('mousemove', (e) => {
  if (blockMoving) {
    blockDisX = e.clientX - starteBlockPos.x
    blockDisY = e.clientY - starteBlockPos.y
    target.style.transform = `translate(${blockDisX}px, ${blockDisY}px)`

    changPos(
      document.querySelectorAll(".one-unit"),
      targetIndex,
      blockDisX,
      blockWidth + gapWidth
    )
  }
})

/**
 * @description 目标单元移动
 * @param {HTMLElement[]} allUnits 所有单元节点
 * @param {number} targetIndex 目标索引
 * @param {number} disX 目标 x 轴位移
 * @param {number} moveWidth 目标单元宽度（自身宽度 + 间隙）
 */
function changPos (allUnits, targetIndex, disX, moveWidth) {
  moveStep = parseInt(disX / moveWidth)
  currentPosIndex = moveStep + targetIndex

  for (let i = 0; i < allUnits.length; i++) {
    if (i !== targetIndex) {
      allUnits[i].style.transform = 'translate(0px)'
    }
  }

  if (currentPosIndex > targetIndex) {
    const needMoveCount = currentPosIndex - targetIndex

    for (let i = 1; i <= needMoveCount; i++) {
      if (targetIndex + i !== allUnits.length - 1) {
        allUnits[targetIndex + i] ? (
          allUnits[targetIndex + i].style.transform = `translateX(-${moveWidth}px)`
        ) : ''
      }
    }
  } else if (currentPosIndex < targetIndex) {
    const needMoveCount = targetIndex - currentPosIndex

    for (let i = 1; i <= needMoveCount; i++) {
      allUnits[targetIndex - i] ? (
        allUnits[targetIndex - i].style.transform = `translateX(${moveWidth}px)`
      ) : ''
    }
  }
}

function handleTransitionEnd (e) {
  if (target !== e.currentTarget) {
    if (currentPosIndex !== targetIndex) {
      console.log('handleTransitionEnd')

      const all = document.querySelectorAll('.one-unit')

      if (currentPosIndex < 0) {
        currentPosIndex = 0
      } else if (currentPosIndex > all.length - 2) {
        currentPosIndex = all.length - 2
      }

      if (currentPosIndex < targetIndex) {
        target.parentNode.insertBefore(target, all[currentPosIndex])
      } else {
        target.parentNode.insertBefore(target, all[currentPosIndex + 1])
      }

      const allArr = [...all]
      allArr.forEach((item) => {
        item.style.transition = 'none'
        item.style.transform = 'translateX(0px)'
      })

      setTimeout(() => {
        allArr.forEach((item) => {
          item.style.transition = 'all 0.2s ease-in-out'
        })
      }, 200)
    }
  }
}
