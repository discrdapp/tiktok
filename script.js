let t1 = document.getElementById('t1')
let t2 = document.getElementById('t2')
let t3 = document.getElementById('t3')

let twrap = document.getElementById('twrap')

let y = 0

let ktorytt = 0

let tiktoki = [
	{
        id: "1",
		src: 'assets/vid/tt1.mp4',
		like: '12k',
		comments: '5k',
		saves: '1k',
		shares: '2k',
	},
    {
        id: "2",
		src: 'assets/vid/tt2.mp4',
		like: '12k',
		comments: '2',
		saves: '2k',
		shares: '500k',
	},
    {
        id: "3",
		src: 'assets/vid/tt3.mp4',
		like: '64k',
		comments: '6k',
		saves: '5k',
		shares: '10k',
	},
    {
        id: "4",
		src: 'assets/vid/tt4.mp4',
		like: '2M',
		comments: '66k',
		saves: '122k',
		shares: '12k',
	},
]

let historia = []
let historiacount = 0;

function mousemove(e2) {
	twrap.style.transition = ''
	twrap.style.transform = 'translateY(' + (e2.clientY - y - ktorytt * t2.clientHeight) + 'px)'
}

twrap.addEventListener('mousedown', e => {
	y = e.clientY
	document.addEventListener('mousemove', mousemove)
})

twrap.addEventListener('mouseup', e => {
	document.removeEventListener('mousemove', mousemove)
	if (y - e.clientY > 0.2 * t2.clientHeight) {
		twrap.style.transform = `translateY(${-t2.clientHeight - ktorytt * t2.clientHeight}px)`
		twrap.style.transition = 'transform ease-in-out 0.1s'
		ktorytt++
        historiacount++
	} else if (e.clientY - y > 0.2 * t2.clientHeight && ktorytt == 0) {
		twrap.style.transform = `translateY(0px)`
		twrap.style.transition = 'transform ease-in-out 0.1s'
	} else if (e.clientY - y > 0.2 * t2.clientHeight) {
		twrap.style.transform = `translateY(0px)`
		twrap.style.transition = 'transform ease-in-out 0.1s'
		ktorytt--
        historiacount--
	} else {
		console.log('ten elese')
		twrap.style.transform = `translateY(${-(ktorytt * t2.clientHeight)}px)`
		twrap.style.transition = 'transform ease-in-out 0.1s'
	}

	if (historia.length > 0) {
		updatenext(ktorytt, 1)
	}

    console.log(ktorytt)
    console.log(historiacount)

    if (ktorytt == 2) {
        setTimeout(() => {
            twrap.style.transition = ""
            twrap.style.transform = `translateY(${-(t2.clientHeight)}px)`
        }, 300);
        ktorytt--
    } else if (ktorytt == 0 && historiacount > 0) {
        setTimeout(() => {
            twrap.style.transition = ""
            twrap.style.transform = `translateY(${-(t2.clientHeight)}px)`
        }, 300);
        ktorytt++
    }
})

function updatenext(co, x) {
	let tiktok = document.getElementById('t' + (co + 1))
    let randomtiktok;
    if (historia.length > historiacount && x == 0) {
        historiacount++
        randomtiktok = tiktoki.find(o => o.id == historia[historiacount])
        console.log("r1")
    } else if (x == 0) {
        randomtiktok = tiktoki.find(o => o.id == historia[historiacount])
        historiacount--;
        console.log("r2")
    } else {
        randomtiktok = tiktoki[Math.floor(Math.random()*tiktoki.length)]
        historia.push(randomtiktok.id)
        console.log("r3")
    }
    
    console.log(randomtiktok)


	tiktok.innerHTML = `
        <video controls>
            <source src="${randomtiktok.src}" type="video/mp4">
        </video>
        <div class="container przyciskiprawo">
            <div class="profil plus"><img src="assets/img/pfp.png" alt="pfp" srcset=""></div>
            <div class="przycisktt">
                <i class="fa-solid fa-heart"></i>
                <div class="ile">${randomtiktok.like}</div>
            </div>
            <div class="przycisktt">
                <i class="fa-solid fa-comment-dots"></i>
                <div class="ile">${randomtiktok.comments}</div>
            </div>
            <div class="przycisktt">
                <i class="fa-solid fa-bookmark"></i>
                <div class="ile">${randomtiktok.saves}</div>
            </div>
            <div class="przycisktt">
                <i class="fa-solid fa-share"></i>
                <div class="ile">${randomtiktok.shares}</div>
            </div>
            <div class="profil"><img src="assets/img/pfp.png" alt="pfp" srcset=""></div>
        </div>
    `
}

updatenext(1, 1)