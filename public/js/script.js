const host = process.env.HOST;
const overviewURL = `${host}overview/`;


let currentSlide = 0;
let carouselItems = document.querySelectorAll('.carousel-item');
let carouselIndicators = document.querySelectorAll('.carousel-indicator');

const changeSlide = (n) => {
    carouselItems[currentSlide].classList.add('hidden');
    currentSlide = (currentSlide + n) % carouselItems.length;
    if (currentSlide < 0)
        currentSlide = carouselItems.length - 1;
    updateCarouselIndicator(currentSlide);
    carouselItems[currentSlide].classList.remove('hidden');
}


const autoSlideChange = () => {
    carouselItems[currentSlide].classList.add('hidden');
    currentSlide = (currentSlide + 1) % carouselItems.length;
    updateCarouselIndicator(currentSlide);
    carouselItems[currentSlide].classList.remove('hidden');
}


const jumpToSlide = (n) => {
    carouselItems[currentSlide].classList.add('hidden');
    currentSlide = n;
    updateCarouselIndicator(currentSlide);
    carouselItems[currentSlide].classList.remove('hidden');
}

const updateCarouselIndicator = (n) => {
    carouselIndicators.forEach((item) => {
        if (!item.classList.contains('opacity-50')) {
            item.classList.add('opacity-50')
        }
    })
    carouselIndicators[n].classList.remove('opacity-50');
}

// function to load question
const showQuestion = (n) => {
    const questionList = document.querySelectorAll('.question-container .question');
    const answerList = document.querySelectorAll('.question-container .answer');
    n = Number(n);
    for (let i = 0; i < questionList.length; i++) {
        if (i === n) {
            answerList[i].classList.toggle('hidden');
            questionList[i].classList.toggle('mb-2');
        } else if (!(answerList[i].classList.contains('hidden'))) {
            answerList[i].classList.add('hidden');
        }
        if ( i != n && !(questionList[i].classList.contains('mb-2')) ) questionList[i].classList.add('mb-2');
    }
}

const showHeader = () => {
    let menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('show-menu');
}

window.onload = function () {
    if( window.location.pathname == '/' || window.location.pathname == '' ) {
        setInterval(autoSlideChange, 3000);
    };
    if( window.location.pathname == '/workshop' ) {
        setInterval(autoSlideChange, 3000);
    };
}