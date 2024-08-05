window.addEventListener('load', function () {
  let list = [
    'https://app.maifangqi.com/uploads/files/20240325/a84676b42b7f66a31e826298eff2f945.mp4',
    'https://app.maifangqi.com/uploads/file/20231219/76e9bcb8d4c3068583b9ddb9791b0170.mp4'
  ]
  let index = 0

  let video = document.getElementById('video')
  video.src = list[index]

  // 视频播放结束
  video.addEventListener('ended', function () {
    index++

    if (index < list.length) {
      video.src = list[index]
    } else {
      index = 0
      video.src = list[index]
    }

    clearInterval(timer)
  })

  /* 播放与暂停 */
  let videoPlayBtn = document.getElementById('video-play')
  videoPlayBtn.addEventListener('click', function () {
    if (video.paused) {
      // 视频处于暂停状态
      video.play()
    } else {
      // 视频正在播放
      video.pause()
    }
  })

  video.addEventListener('play', function () {
    videoPlayBtn.className = 'iconfont icon-zanting'
  })

  video.addEventListener('pause', function () {
    videoPlayBtn.className = 'iconfont icon-bofang-1'

    clearInterval(timer)
  })

  /* 进度条 */
  let duration = 0
  let timer = null

  let currentTimeDom = document.querySelector('.current-time')
  let durationDom = document.querySelector('.duration')
  let progressBallDom = document.querySelector('.progress-ball')

  // 视频数据加载
  video.addEventListener('loadedmetadata', function (e) {
      //视频的总长度
      duration = e.target.duration
      durationDom.innerText = transformTime(e.target.duration)
  })

  // 视频正在播放中
  video.addEventListener('playing', function (e) {
    timer = setInterval(function () {
      currentTimeDom.innerText = transformTime(e.target.currentTime)

      let progress = e.target.currentTime / duration * 100
      progressBallDom.style.left = `${progress}%`
    }, 100)
  })

  // 时间转换
  function transformTime (time) {
    let timeNumer = parseInt(time)

    let s = timeNumer % 60
    let m = parseInt(timeNumer / 60 % 60)

    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  /* 全屏与退出全屏 */
  let fullscreenBtn = document.getElementById('fullscreen')
  let exitFullscreenBtn = document.getElementById('exitFullscreen')
  let videoBox = document.getElementById('video-box')

  fullscreenBtn.addEventListener('click', function () {
    videoBox.requestFullscreen().then(() => {
      console.log('全屏成功')
    }).catch(() => {
      console.log('全屏失败')
    })
  })

  exitFullscreenBtn.addEventListener('click', function () {
    document.exitFullscreen().then(() => {
      console.log('退出全屏成功')
    }).catch(() => {
      console.log('退出全屏失败')
    })
  })

  /* 监听全屏模式变化 */
  document.addEventListener('fullscreenchange', function () {
    if (document.fullscreenElement === null) {
      // 当前处于全屏模式
      exitFullscreenBtn.style.display = 'none'
      fullscreenBtn.style.display = 'inline-block'
    } else {
      // 当前不处于全屏模式
      exitFullscreenBtn.style.display = 'inline-block'
      fullscreenBtn.style.display = 'none'
    }
  })

  /* 控件的显示与隐藏 */
  let controlsState = true

  let controlsDom = document.querySelector('.controls')
  let prevBtnDom = document.querySelector('.prev-btn')
  let nextBtnDom = document.querySelector('.next-btn')

  video.addEventListener('click', function () {
    if (controlsState) {
      controlsDom.style.display = 'none'
      prevBtnDom.style.display = 'none'
      nextBtnDom.style.display = 'none'
    } else {
      controlsDom.style.display = 'flex'
      prevBtnDom.style.display = 'block'
      nextBtnDom.style.display = 'block'
    }

    controlsState = !controlsState
  })

  /* 下一个视频 / 上一个视频 */
  nextBtnDom.addEventListener('click', function () {
    index++

    if (index < list.length) {
      video.src = list[index]
    } else {
      index = 0
      video.src = list[index]
    }
  })

  prevBtnDom.addEventListener('click', function () {
    index--

    if (index < 0) {
      index = list.length - 1
      video.src = list[index]
    } else {
      video.src = list[index]
    }
  })
})
