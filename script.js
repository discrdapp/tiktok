const t1 = document.getElementById('t1')
const t2 = document.getElementById('t2')
const t3 = document.getElementById('t3')
const twrap = document.getElementById('twrap')

// --- STATE MANAGEMENT ---
const tiktoki = [
	{
		id: '1',
		src: 'assets/vid/tt1.mp4',
		profilowe: 'https://d-art.ppstatic.pl/kadry/k/r/1/2d/6c/6582de1bb5643_o_large.jpg',
		like: '12k',
		comments: '5k',
		saves: '1k',
		shares: '2k',
	},
	{
		id: '2',
		src: 'assets/vid/tt2.mp4',
		profilowe: 'https://d-art.ppstatic.pl/kadry/k/r/1/2d/6c/6582de1bb5643_o_large.jpg',
		like: '12k',
		comments: '2',
		saves: '2k',
		shares: '500k',
	},
	{
		id: '4',
		src: 'assets/vid/tt4.mp4',
		profilowe: 'https://d-art.ppstatic.pl/kadry/k/r/1/2d/6c/6582de1bb5643_o_large.jpg',
		like: '2M',
		comments: '66k',
		saves: '122k',
		shares: '12k',
	},
]

let history = []
let currentHistoryIndex = -1
let isAnimating = false
let startY = 0

// --- HELPER FUNCTIONS ---

function createTiktokHTML(tiktokData) {
	if (!tiktokData) return ''
	return `
        <video muted loop playsinline>
            <source src="${tiktokData.src}" type="video/mp4">
        </video>
        <div class="container przyciskiprawo">
            <div class="profil plus" style="background-image: url('${tiktokData.profilowe}')"></div>
            <div class="przycisktt"><i class="fa-solid fa-heart"></i><div class="ile">${tiktokData.like}</div></div>
            <div class="przycisktt"><i class="fa-solid fa-comment-dots"></i><div class="ile">${tiktokData.comments}</div></div>
            <div class="przycisktt"><i class="fa-solid fa-bookmark"></i><div class="ile">${tiktokData.saves}</div></div>
            <div class="przycisktt"><i class="fa-solid fa-share"></i><div class="ile">${tiktokData.shares}</div></div>
            <div class="profil muzyka" style="background-image: url('${tiktokData.profilowe}')"></div>
        </div>
    `
}

function updateSlot(slotElement, tiktokData) {
	slotElement.innerHTML = createTiktokHTML(tiktokData)
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
		activeVideo.currentTime = 0
		activeVideo.play().catch(error => {
			console.warn('Autoplay was prevented by the browser:', error)
		})
	}
}

// --- CORE SCROLLING LOGIC ---

function scrollNext() {
	if (isAnimating) return
	isAnimating = true

	if (currentHistoryIndex === 0) {
		// Moving from start state to loop state
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(-100vh)' // Animate to show t2

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
		// Looping
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(-200vh)' // Animate to show t3

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
		// Returning to start state
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(0vh)' // Animate back to t1

		setTimeout(() => {
			currentHistoryIndex--
			isAnimating = false
			managePlayback(t1)
		}, 300)
	} else {
		// Looping backwards
		twrap.style.transition = 'transform 0.3s ease-out'
		twrap.style.transform = 'translateY(0vh)' // Animate to show t1

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

// --- EVENT LISTENERS ---

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

// --- INITIALIZATION ---
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
