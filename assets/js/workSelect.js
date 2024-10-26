$(document).ready(function () {
    var worksData;

    // Carica il JSON e salva i dati nella variabile worksData
    var timestamp = new Date().getTime();
    $.getJSON('../assets/works.json?t=' + timestamp, function (works) {
        worksData = works;
    }).fail(function () {
        console.error('Errore nel caricamento del file JSON.');
    });

    // Funzione per mostrare i brani filtrati
    function displayWorks(works) {
        var worksContainer = $('#works');
        worksContainer.empty(); // Svuotiamo il contenitore
        works.forEach(function (work) {
            var workElement = `
        <div class="work">
            <div class="workCardWrapper">
                <div class="workCard">
                    <h2 class="workTitle">${work.title}</h2>
                    <p class="workSubtitle">${work.subtitle}</p>
                    <p class="workYear">${work.year}</p>
                    <img class="workImage" src="/assets/img/works/${work.image}">
                    <p class="workDuration">${work.duration}</p>
                    <hr>
                    <p class="workDescription">${work.description}</p>
                    <hr>`;

            // Aggiungiamo solo i link presenti
            if (work.soundcloud_url) {
                workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/soundcloud.svg"><a href="${work.soundcloud_url}" target="_blank" class="workSoundcloudLink">Listen on SoundCloud</a></div>`;
            }
            if (work.youtube_url) {
                workElement += `<a href="${work.youtube_url}" class="workYoutubeLink">Watch on YouTube</a>`;
            }
            if (work.spotify_url) {
                workElement += `<a href="${work.spotify_url}" class="workSpotifyLink">Listen on Spotify</a>`;
            }

            // Chiudiamo i div aperti
            workElement += `
                    </div>
                </div>
            </div>`;

            worksContainer.append(workElement);
        });
    }

    // Funzione per filtrare i brani per strumentazione
    function filterWorks(instrument) {
        if (!worksData) {
            console.error("I dati dei brani non sono stati caricati correttamente.");
            return;
        }

        var filteredWorks;

        // Filtra i brani in base allo strumento selezionato
        if (instrument === 'all') {
            filteredWorks = worksData.slice(); // Crea una copia dei dati
        } else if (instrument === 'none') {
            filteredWorks = [];
        } else {
            filteredWorks = worksData.filter(function (work) {
                return work.instruments.includes(instrument);
            });
        }

        // Ordina i brani per anno dal più recente al più vecchio
        filteredWorks.sort(function (a, b) {
            return b.year - a.year;
        });

        displayWorks(filteredWorks); // Mostra i brani filtrati
    }

    // Gestiamo il clic sui pulsanti di filtro
    $('#filters button').click(function () {
        var filter = $(this).attr('data-filter');

        // Rimuove la classe active da tutti i pulsanti
        $('#filters button').removeClass('active').each(function () {
            // Ripristina il testo originale per tutti i pulsanti
            var originalText = $(this).attr('data-original-text');
            if (originalText) {
                $(this).text(originalText);
            }
        });

        // Aggiunge la classe active solo al pulsante cliccato
        $(this).addClass('active');

        // Filtra i brani in base al filtro selezionato
        filterWorks(filter);

        // Contiamo i brani filtrati e aggiorniamo il testo del pulsante
        var count = worksData ? worksData.filter(work => filter === 'all' || (filter !== 'none' && work.instruments.includes(filter))).length : 0;
        $(this).attr('data-original-text', $(this).attr('data-original-text') || $(this).text());
        $(this).text(`${$(this).attr('data-original-text')} (${count})`);

        //$("#works").get(0).scrollIntoView({ behavior: 'smooth' });

    });

    // Salva il testo originale del pulsante quando viene cliccato la prima volta
    $('#filters button').each(function () {
        $(this).attr('data-original-text', $(this).text());
    });
});