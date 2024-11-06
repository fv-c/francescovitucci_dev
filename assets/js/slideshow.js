// Oggetto per memorizzare l'indice corrente di ciascuno slideshow
const slideIndex = {};

// Funzione per scorrere tra le slide
function plusSlides(n, slideId) {
    showSlides((slideIndex[slideId] += n), slideId);
}

// Funzione per mostrare una slide specifica
function currentSlide(n, slideId) {
    showSlides((slideIndex[slideId] = n), slideId);
}

// Funzione per mostrare le slide
function showSlides(n, slideId) {
    // Inizializza l'indice se non esiste
    if (!(slideId in slideIndex)) slideIndex[slideId] = 1;

    // Seleziona solo gli elementi con il data-slide-id specifico
    const slides = document.querySelectorAll(`.mySlides[data-slide-id="${slideId}"]`);
    const dots = document.querySelectorAll(`.dot-container[data-slide-id="${slideId}"] .dot`);

    // Assicura che esistano slide e dot prima di procedere
    if (slides.length === 0 || dots.length === 0) {
        //console.log(`No slides or dots found for slideshow ID ${slideId}`);
        return;
    }

    // Gestione dell'indice di scorrimento
    if (n > slides.length) slideIndex[slideId] = 1;
    if (n < 1) slideIndex[slideId] = slides.length;

    // Nasconde tutte le slide e rimuove lo stato attivo dai dot
    slides.forEach((slide, index) => {
        slide.style.display = "none";
        //console.log(`Hiding slide ${index + 1} for slideshow ID ${slideId}`);
    });

    dots.forEach((dot) => {
        dot.className = dot.className.replace(" active", "");
    });

    // Mostra la slide corrente e attiva il dot corrispondente
    slides[slideIndex[slideId] - 1].style.display = "block";
    dots[slideIndex[slideId] - 1].className += " active";

    //console.log(`Showing slide ${slideIndex[slideId]} for slideshow ${slideId}`);
}


// Inizializza tutti gli slideshow al caricamento completo della pagina
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".slideshow-container").forEach((element) => {
        const slideId = element.getAttribute("data-slide-id");
        slideIndex[slideId] = 1; // Imposta la prima slide visibile per ciascuno slideshow
        showSlides(slideIndex[slideId], slideId); // Visualizza la prima slide
        //console.log(`Initialized slideshow with ID ${slideId}`);
    });
});

function openFullscreen(slideshowId) {
    const elem = document.getElementById(slideshowId);
    const captions = elem.querySelectorAll('.text');
    const fullscreenBtn = elem.querySelector('.fullscreen-btn');

    if (!document.fullscreenElement) {
        // Entra in modalità fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        }
        // Cambia il testo del pulsante in "╳"
        fullscreenBtn.textContent = "╳";
    } else {
        // Esce dalla modalità fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
        // Ripristina il testo del pulsante
        fullscreenBtn.textContent = "⛶";
    }

    // Aggiungi o rimuovi la classe fullscreen-caption in base allo stato fullscreen
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            captions.forEach(caption => caption.classList.add("fullscreen-caption"));
            fullscreenBtn.textContent = "╳"; // Cambia in "X" quando in fullscreen
        } else {
            captions.forEach(caption => caption.classList.remove("fullscreen-caption"));
            fullscreenBtn.textContent = "⛶"; // Ripristina il simbolo fullscreen
        }
    });
}