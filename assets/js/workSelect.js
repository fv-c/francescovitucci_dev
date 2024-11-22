$(document).ready(function () {
  var worksData;
  var instrumentsSet = new Set();

  const labelMap = {
    liveElectronics: "live electronics",
    fixedMedia: "fixed media"
  };

  $("#loading-message").show();

  var count = 0;

  var timestamp = new Date().getTime();
  $.getJSON("../assets/works.json?t=" + timestamp, function (works) {
    worksData = works;

    $("#loading-message").hide();
    $("#filters, #works").show();

    worksData.forEach(function (work) {
      work.instruments.forEach(function (instrument) {
        instrumentsSet.add(instrument);
      });
    });

    generateFilterButtons(Array.from(instrumentsSet));
  }).fail(function () {
    console.error("Errore nel caricamento del file JSON.");
  });

  function generateFilterButtons(instruments) {
    var filtersContainer = $("#filters");

    filtersContainer.append(`<button data-filter="all">All works</button>`);

    filtersContainer.append(
      `<button data-filter="none" class="active">None</button>`
    );

    instruments.forEach(function (instrument) {
      const label = labelMap[instrument] || instrument;
      filtersContainer.append(
        `<button data-filter="${instrument}">${label}</button>`
      );
    });

    $("#filters button").click(function () {
      var filter = $(this).attr("data-filter");

      $("#filters button")
        .removeClass("active")
        .each(function () {
          var originalText = $(this).attr("data-original-text");
          if (originalText) {
            $(this).text(originalText);
          }
        });

      $(this).addClass("active");

      filterWorks(filter);

      if (filter !== "none") {
        var count = worksData
          ? worksData.filter(
              (work) =>
                filter === "all" ||
                (filter !== "none" && work.instruments.includes(filter))
            ).length
          : 0;
        $(this).attr(
          "data-original-text",
          $(this).attr("data-original-text") || $(this).text()
        );
        $(this).text(`${$(this).attr("data-original-text")} (${count})`);
      }
    });

    $("#filters button").each(function () {
      $(this).attr("data-original-text", $(this).text());
    });
  }

  function displayWorks(works) {
    var worksContainer = $("#works");
    worksContainer.empty(); // Svuotiamo il contenitore
    works.forEach(function (work) {
      var workElement = `
        <div class="work">
            <div class="workCardWrapper">
                <div class="workCard">
                    <h2 class="workTitle">${work.title}</h2>
                    <p class="workSubtitle">${work.subtitle}</p>
                    <p class="workYear">${work.year}</p>
                    <img class="workImage" src="../assets/img/works/${work.image}">
                    <p class="workDuration">${work.duration}</p>
                    <hr>
                    <div class="premiereWrapper"><p class="workPremiere">${work.premiere}</p></div>
                    <hr>
                    <p class="workDescription">${work.description}</p>
                    <hr>
                    <div class="linksWrapper">`;

      if (work.soundcloud_url) {
        workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/soundcloud.svg"><a href="${work.soundcloud_url}" target="_blank" class="workSoundcloudLink">Listen on SoundCloud</a></div>`;
      }
      if (work.genericplay_url) {
        workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/headphones.svg"><a href="${work.genericplay_url}" target="_blank" class="workGenericPlayLink">Listen!</a></div>`;
      }
      if (work.youtube_url) {
        workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/youtube.svg"><a href="${work.youtube_url}" target="_blank" class="workYoutubeLink">Watch on YouTube</a></div>`;
      }
      if (work.spotify_url) {
        workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/spotify.svg"><a href="${work.spotify_url}" target="_blank" class="workSpotifyLink">Listen on Spotify</a></div>`;
      }

      if (work.buy_url) {
        workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/cart.svg"><a href="${work.buy_url}" target="_blank" class="workBuyLink">Buy the score</a></div>`;
      }

      if (work.info1_url) {
        workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/info.svg"><a href="${work.info1_url}" target="_blank" class="workInfoLink">What they say about...</a></div>`;
      }

      if (work.info2_url) {
        workElement += `<div class="workLink"><img class="workLinkIcon" src="../assets/img/icons/info.svg"><a href="${work.info2_url}" target="_blank" class="workInfoLink">what they say about...</a></div>`;
      }

      workElement += `
                        </div>
                        <hr>`;

      if (work.read) {
        workElement += `<a href="${work.read}" target="_blank" class="workReadMore">Read more</a>`;
      }
      workElement += `</div>
                </div>
            </div>`;

      worksContainer.append(workElement);
    });
  }

  function filterWorks(instrument) {
    if (!worksData) {
      console.error("I dati dei brani non sono stati caricati correttamente.");
      return;
    }
  
    var filteredWorks;
  
    if (instrument === "all") {
      filteredWorks = worksData.slice();
    } else if (instrument === "none") {
      filteredWorks = [];
    } else {
      filteredWorks = worksData.filter(function (work) {
        return work.instruments.includes(instrument);
      });
    }

    filteredWorks.sort(function (a, b) {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
  
      const dateA = a.premiere.slice(-10).split("-").reverse().join("-");
      const dateB = b.premiere.slice(-10).split("-").reverse().join("-");
      return dateB.localeCompare(dateA);
    });
  
    displayWorks(filteredWorks);
  }
  

  $("#filters button").click(function () {
    var filter = $(this).attr("data-filter");

    $("#filters button")
      .removeClass("active")
      .each(function () {

        var originalText = $(this).attr("data-original-text");
        if (originalText) {
          $(this).text(originalText);
        }
      });

    $(this).addClass("active");

    filterWorks(filter);

    $("#workCount").remove();

    count = worksData
      ? worksData.filter(
          (work) =>
            filter === "all" ||
            (filter !== "none" && work.instruments.includes(filter))
        ).length
      : 0;

    $("#filters").after(
      $('<div id="workCount"></div>').text("Works found: " + count)
    );

  });

  $("#filters button").each(function () {
    $(this).attr("data-original-text", $(this).text());
  });
});
