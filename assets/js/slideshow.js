const slideIndex = {};

function plusSlides(n, slideId) {
    showSlides((slideIndex[slideId] += n), slideId);
}

function currentSlide(n, slideId) {
    showSlides((slideIndex[slideId] = n), slideId);
}

function showSlides(n, slideId) {

    if (!(slideId in slideIndex)) slideIndex[slideId] = 1;

    const slides = document.querySelectorAll(`.mySlides[data-slide-id="${slideId}"]`);
    const dots = document.querySelectorAll(`.dot-container[data-slide-id="${slideId}"] .dot`);

    if (slides.length === 0 || dots.length === 0) {
        return;
    }

    if (n > slides.length) slideIndex[slideId] = 1;
    if (n < 1) slideIndex[slideId] = slides.length;

    slides.forEach((slide, index) => {
        slide.style.display = "none";
    });

    dots.forEach((dot) => {
        dot.className = dot.className.replace(" active", "");
    });

    slides[slideIndex[slideId] - 1].style.display = "block";
    dots[slideIndex[slideId] - 1].className += " active";

}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".slideshow-container").forEach((element) => {
        const slideId = element.getAttribute("data-slide-id");
        slideIndex[slideId] = 1;
        showSlides(slideIndex[slideId], slideId);
    });
});

function openFullscreen(slideshowId) {
    const elem = document.getElementById(slideshowId);
    const captions = elem.querySelectorAll('.text');
    const fullscreenBtn = elem.querySelector('.fullscreen-btn');

    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { 
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }

        fullscreenBtn.textContent = "╳";
    } else {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        fullscreenBtn.textContent = "⛶";
    }


    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            captions.forEach(caption => caption.classList.add("fullscreen-caption"));
            fullscreenBtn.textContent = "╳";
        } else {
            captions.forEach(caption => caption.classList.remove("fullscreen-caption"));
            fullscreenBtn.textContent = "⛶";
        }
    });
}