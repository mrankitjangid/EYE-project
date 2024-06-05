const host = 'https://eye-project.onrender.com/';
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


// fuction to fetch data
const fetchData = async (url) => {
    let response = await fetch(url)
    .then(
        resp => resp.json()
    );
    return response;
}


const showHeader = () => {
    let menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('show-menu');
}


const latestBlogList = document.getElementById('latest-blog-list');
const recommendBlogList = document.getElementById('recommend-blog-list');


const insertBlogPreview = async (blogPreviewList, blogId) => {
    const data = await fetchData(overviewURL + blogId);
    const blogPreviewSnippet = `
    <div class="md:flex w-auto xl:max-h-60">
    <!-- blog list thumbnail -->
    <div class="blog-thumbnail object-contain aspect-square xl:max-w-[40%]"><img class="w-full md:min-h-48 md:min-w-48 object-cover aspect-square" src="${data[1]}" alt="blog-thumbnail" width="100%" height="100%"></div>
    <!-- blog list title and description -->
    <div class="p-4">
    <!-- blog title -->
    <div class="blog-title text-md font-semibold"><a href="/blog/${blogId}" class=" text-xl">${data[2]}</a></div>
    <!-- blog description (almost 20 words) -->
    <div class="blog-description mt-1">${data[3]}</div>
    </div>
    </div>
    `;
    let newListItem = document.createElement('li');
    newListItem.classList.add(...'bg-slate-900 max-w-sm md:max-w-7xl rounded-3xl overflow-hidden shadow-slate-500 shadow-sm'.split(' '));
    newListItem.innerHTML = blogPreviewSnippet;
    blogPreviewList.appendChild(newListItem);
}

window.onload = function () {
    if( window.location.pathname == '/' || window.location.pathname == '' ) {
        setInterval(autoSlideChange, 3000);
    };
    if( window.location.pathname == '/workshop' ) {
        setInterval(autoSlideChange, 3000);
    };
}