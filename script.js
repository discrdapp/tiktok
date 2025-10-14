const t1 = document.getElementById('t1')
const t2 = document.getElementById('t2')
const t3 = document.getElementById('t3')
const twrap = document.getElementById('twrap')

const tiktoki = [
	{
		id: '1',
		username: 'liseq420',
		src: 'assets/vid/tt1.mp4',
		profilowe: 'https://d-art.ppstatic.pl/kadry/k/r/1/2d/6c/6582de1bb5643_o_large.jpg',
		like: '12k',
		comments: '5k',
		saves: '1k',
		shares: '2k',
		description: 'Bingo Bango Bongo Bish Bash Bosh #edit #cs2 #cs2edit #fyp',
	},
	{
		id: '2',
		username: 'liseq420',
		src: 'assets/vid/tt2.mp4',
		profilowe: 'https://d-art.ppstatic.pl/kadry/k/r/1/2d/6c/6582de1bb5643_o_large.jpg',
		like: '12k',
		comments: '2',
		saves: '2k',
		shares: '500k',
		description: 'OCEAN EYES #edit #cs2 #cs2edit #fyp',
	},
	{
		id: '4',
		username: 'liseq420',
		src: 'assets/vid/tt4.mp4',
		profilowe: 'https://d-art.ppstatic.pl/kadry/k/r/1/2d/6c/6582de1bb5643_o_large.jpg',
		like: '2M',
		comments: '66k',
		saves: '122k',
		shares: '12k',
		description: "I knew it, i just couldn't prove it #brainrot #67 #d4vd",
	},
]

let history = []
let currentHistoryIndex = -1
let isAnimating = false
let startY = 0

function createTiktokHTML(tiktokData) {
	if (!tiktokData) return ''
	const uniqueId = `desc-${tiktokData.id}`
	return `
		<video muted loop playsinline>
			<source src="${tiktokData.src}" type="video/mp4">
		</video>

		<div class="pause-overlay">
			<svg viewBox="0 0 100 100" class="pause-icon">
				<polygon points="35,25 35,75 75,50" fill="white"/>
			</svg>
		</div>

		<!-- VOLUME CONTROL -->
		<div class="volume-control">
			<i class="fa-solid fa-volume-xmark volume-icon"></i>
			<input type="range" min="0" max="1" step="0.01" value="0" class="volume-slider">
		</div>

		<!-- Pasek postępu -->
		<div class="progress-bar-container">
			<div class="progress-bar">
				<div class="progress-fill"></div>
				<div class="progress-handle"></div>
			</div>
		</div>

		<div class="dolwrap">
			<div class="username">${tiktokData.username}</div>
			<div class="description-wrapper">
				<p class="description collapsed" id="${uniqueId}-preview">
					${tiktokData.description}
				</p>
				<div class="collapse" id="${uniqueId}">
					<p class="description-full">${tiktokData.description}</p>
				</div>
				<a class="toggle-btn collapsed"
					data-bs-toggle="collapse"
					href="#${uniqueId}"
					role="button"
					aria-expanded="false"
					aria-controls="${uniqueId}">
				</a>
			</div>
		</div>

		<div class="przyciskiprawo">
			<div class="profil plus" style="background-image: url('${tiktokData.profilowe}')"></div>
			<div class="przycisktt"><i class="fa-solid fa-heart"></i><div class="ile">${tiktokData.like}</div></div>
			<div class="przycisktt"><i class="fa-solid fa-comment-dots"></i><div class="ile">${tiktokData.comments}</div></div>
			<div class="przycisktt"><i class="fa-solid fa-bookmark"></i><div class="ile">${tiktokData.saves}</div></div>
			<div class="przycisktt"><i class="fa-solid fa-share"></i><div class="ile">${tiktokData.shares}</div></div>
			<div class="profil muzyka" style="background-image: url('${tiktokData.profilowe}')"></div>
		</div>
	`
}

function setupBootstrapCollapse(wrapper) {
	const preview = wrapper.querySelector('.description')
	const full = wrapper.querySelector('.description-full')
	const btn = wrapper.querySelector('.toggle-btn')
	const collapseEl = wrapper.querySelector('.collapse')

	if (!preview || !full || !btn) return
	
	requestAnimationFrame(() => {
		const isOverflowing = preview.scrollHeight > preview.clientHeight + 1
		if (!isOverflowing) {
			btn.style.display = 'none'
			collapseEl.remove()
			return
		}
	})

	collapseEl.addEventListener('show.bs.collapse', () => {
		btn.classList.remove('collapsed')
		preview.style.display = 'none'
	})
	collapseEl.addEventListener('hide.bs.collapse', () => {
		btn.classList.add('collapsed')
		preview.style.display = '-webkit-box'
	})
}

function setupProgressBar(slotElement) {
	const video = slotElement.querySelector('video')
	const bar = slotElement.querySelector('.progress-bar')
	const fill = slotElement.querySelector('.progress-fill')
	const handle = slotElement.querySelector('.progress-handle')

	if (!video || !bar) return

	let isDragging = false

	video.addEventListener('timeupdate', () => {
		if (isDragging) return
		const progress = (video.currentTime / video.duration) * 100
		fill.style.width = `${progress}%`
		handle.style.left = `${progress}%`
	})

	bar.addEventListener('click', e => {
		const rect = bar.getBoundingClientRect()
		const x = e.clientX - rect.left
		const percent = x / rect.width
		video.currentTime = video.duration * percent
	})

	handle.addEventListener('mousedown', e => {
		isDragging = true
		bar.classList.add('dragging')
		document.addEventListener('mousemove', onDrag)
		document.addEventListener('mouseup', onDragEnd)
	})

	function onDrag(e) {
		const rect = bar.getBoundingClientRect()
		let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
		const percent = x / rect.width
		fill.style.width = `${percent * 100}%`
		handle.style.left = `${percent * 100}%`
		video.currentTime = video.duration * percent
	}

	function onDragEnd() {
		isDragging = false
		bar.classList.remove('dragging')
		document.removeEventListener('mousemove', onDrag)
		document.removeEventListener('mouseup', onDragEnd)
	}
}

let globalVolume = 0.5
let globalMuted = true

function setupVolumeControl(slotElement) {
	const video = slotElement.querySelector('video')
	const icon = slotElement.querySelector('.volume-icon')
	const slider = slotElement.querySelector('.volume-slider')

	if (!video || !icon || !slider) return

	// Apply global state
	video.volume = globalVolume
	video.muted = globalMuted
	slider.value = globalMuted ? 0 : globalVolume
	updateIcon()

	function updateIcon() {
		if (video.muted || video.volume === 0) {
			icon.classList.remove('fa-volume-high')
			icon.classList.add('fa-volume-xmark')
		} else {
			icon.classList.remove('fa-volume-xmark')
			icon.classList.add('fa-volume-high')
		}
	}

	function syncWithGlobal() {
		video.volume = globalVolume
		video.muted = globalMuted
		slider.value = globalMuted ? 0 : globalVolume
		updateIcon()
	}

	icon.addEventListener('click', () => {
		if (video.muted || video.volume === 0) {
			globalMuted = false
			globalVolume = globalVolume > 0 ? globalVolume : 1
		} else {
			globalMuted = true
		}
		document.querySelectorAll('.ttall').forEach(slot => {
			const ctrl = slot.querySelector('.volume-control')
			if (ctrl) setupVolumeControlSync(slot)
		})
	})

	slider.addEventListener('input', e => {
		const val = parseFloat(e.target.value)
		globalVolume = val
		globalMuted = val === 0
		document.querySelectorAll('.ttall').forEach(slot => {
			const ctrl = slot.querySelector('.volume-control')
			if (ctrl) setupVolumeControlSync(slot)
		})
	})

	function setupVolumeControlSync(slot) {
		const v = slot.querySelector('video')
		const s = slot.querySelector('.volume-slider')
		const i = slot.querySelector('.volume-icon')
		if (!v || !s || !i) return
		v.volume = globalVolume
		v.muted = globalMuted
		s.value = globalMuted ? 0 : globalVolume
		if (globalMuted || globalVolume === 0) {
			i.classList.remove('fa-volume-high')
			i.classList.add('fa-volume-xmark')
		} else {
			i.classList.remove('fa-volume-xmark')
			i.classList.add('fa-volume-high')
		}
	}
}
function setupPauseOverlay(slotElement) {
	const video = slotElement.querySelector('video')
	const wrapper = slotElement

	if (!video || !wrapper) return

	wrapper.classList.remove('video-paused')

	function updateOverlay() {
		wrapper.classList.toggle('video-paused', video.paused)
	}

	updateOverlay()
	
	wrapper.addEventListener('click', e => {
		if (!slotElement.classList.contains('active')) return
		if (e.target !== video) return

		if (video.paused) {
			video.play()
		} else {
			video.pause()
		}
	})
	
	video.addEventListener('play', updateOverlay)
	video.addEventListener('pause', updateOverlay)

	setTimeout(updateOverlay, 50)
}

function updateSlot(slotElement, tiktokData) {
	slotElement.innerHTML = createTiktokHTML(tiktokData)
	const wrapper = slotElement.querySelector('.description-wrapper')
	if (wrapper) setupBootstrapCollapse(wrapper)
	setupProgressBar(slotElement)
	setupVolumeControl(slotElement)
	setupPauseOverlay(slotElement)
}

function getNextRandomTiktok() {
	const currentVideoId = history.length > 0 ? history[history.length - 1] : null
	let randomTiktok
	do {
		randomTiktok = tiktoki[Math.floor(Math.random() * tiktoki.length)]
	} while (randomTiktok.id === currentVideoId && tiktoki.length > 1)
	return randomTiktok
}

function managePlayback(activeSlot) {
	document.querySelectorAll('.ttall').forEach(ttall => {
		ttall.classList.remove('active')
	})
	document.querySelectorAll('#twrap video').forEach(video => {
		video.pause()
	})

	const activeVideo = activeSlot.querySelector('video')

	if (activeSlot) {
		activeSlot.classList.add('active')
	}

	if (activeVideo) {
		activeVideo.volume = globalVolume
		activeVideo.muted = globalMuted

		activeVideo.currentTime = 0
		activeVideo.play().catch(error => {
			console.warn('Autoplay was prevented by the browser:', error)
		})
	}
}
function scrollNext() {
	if (isAnimating) return
	isAnimating = true

	if (currentHistoryIndex === 0) {
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(-100vh)'

		setTimeout(() => {
			currentHistoryIndex++
			if (currentHistoryIndex + 1 >= history.length) {
				history.push(getNextRandomTiktok().id)
			}
			const nextVideoData = tiktoki.find(o => o.id === history[currentHistoryIndex + 1])
			updateSlot(t3, nextVideoData)

			isAnimating = false
			managePlayback(t2)
		}, 300)
	} else {
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(-200vh)'

		setTimeout(() => {
			currentHistoryIndex++
			if (currentHistoryIndex >= history.length) {
				history.push(getNextRandomTiktok().id)
			}

			twrap.style.transition = 'none'

			const prevVideo = tiktoki.find(o => o.id === history[currentHistoryIndex - 1])
			const currentVideo = tiktoki.find(o => o.id === history[currentHistoryIndex])

			updateSlot(t1, prevVideo)
			updateSlot(t2, currentVideo)

			if (currentHistoryIndex + 1 >= history.length) {
				history.push(getNextRandomTiktok().id)
			}
			const nextVideo = tiktoki.find(o => o.id === history[currentHistoryIndex + 1])
			updateSlot(t3, nextVideo)

			twrap.style.transform = 'translateY(-100vh)'
			isAnimating = false
			managePlayback(t2)
		}, 300)
	}
}

function scrollPrevious() {
	if (currentHistoryIndex <= 0 || isAnimating) return
	isAnimating = true

	if (currentHistoryIndex === 1) {
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(0vh)'

		setTimeout(() => {
			currentHistoryIndex--
			isAnimating = false
			managePlayback(t1)
		}, 300)
	} else {
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(0vh)'

		setTimeout(() => {
			currentHistoryIndex--

			twrap.style.transition = 'none'

			const prevVideo = tiktoki.find(o => o.id === history[currentHistoryIndex - 1])
			const currentVideo = tiktoki.find(o => o.id === history[currentHistoryIndex])
			const nextVideo = tiktoki.find(o => o.id === history[currentHistoryIndex + 1])

			updateSlot(t1, prevVideo)
			updateSlot(t2, currentVideo)
			updateSlot(t3, nextVideo)

			twrap.style.transform = 'translateY(-100vh)'
			isAnimating = false
			managePlayback(t2)
		}, 300)
	}
}

function handleDragStart(e) {
	if (isAnimating) return
	startY = e.clientY || e.touches[0].clientY
	document.addEventListener('mousemove', handleDragMove)
	document.addEventListener('mouseup', handleDragEnd)
	document.addEventListener('touchmove', handleDragMove, { passive: true })
	document.addEventListener('touchend', handleDragEnd)
}

function handleDragMove(e) {
	if (isAnimating) return
	const currentY = e.clientY || e.touches[0].clientY
	const diff = currentY - startY

	const baseTranslateY = currentHistoryIndex === 0 ? 0 : -t2.clientHeight

	twrap.style.transition = 'none'
	twrap.style.transform = `translateY(${baseTranslateY + diff}px)`
}

function handleDragEnd(e) {
	if (isAnimating) return
	const endY = e.clientY || e.changedTouches[0].clientY
	const diff = endY - startY
	const threshold = t2.clientHeight * 0.2

	document.removeEventListener('mousemove', handleDragMove)
	document.removeEventListener('mouseup', handleDragEnd)
	document.removeEventListener('touchmove', handleDragMove)
	document.removeEventListener('touchend', handleDragEnd)

	if (diff < -threshold) {
		scrollNext()
	} else if (diff > threshold) {
		if (currentHistoryIndex <= 0) {
			twrap.style.transition = 'transform 0.2s ease-out'
			twrap.style.transform = 'translateY(0)'
		}
		scrollPrevious()
	} else {
		twrap.style.transition = 'transform 0.2s ease-out'
		if (currentHistoryIndex === 0) {
			twrap.style.transform = 'translateY(0)'
		} else {
			twrap.style.transform = 'translateY(-100vh)'
		}
	}
}

function initialize() {
	history.push(getNextRandomTiktok().id)
	history.push(getNextRandomTiktok().id)
	currentHistoryIndex = 0

	const firstVideoData = tiktoki.find(o => o.id === history[0])
	const secondVideoData = tiktoki.find(o => o.id === history[1])

	updateSlot(t1, firstVideoData)
	updateSlot(t2, secondVideoData)

	managePlayback(t1)

	twrap.addEventListener('mousedown', handleDragStart)
	twrap.addEventListener('touchstart', handleDragStart, { passive: true })
}

initialize()

