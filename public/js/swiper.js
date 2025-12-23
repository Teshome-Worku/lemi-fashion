const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: false,
    spaceBetween: 0,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,

    },
    // autoplay: {
    //     delay: 2000,
    //     stopOnLastSlide: true,

    // },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    // scrollbar: {
    //     el: '.swiper-scrollbar',
    // },
    breakpoints: {
        0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
        768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        }

    }
});