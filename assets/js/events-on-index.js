document.addEventListener("DOMContentLoaded", function () {

    siteUrl = document.location.origin;

    const today = new Date().toISOString().split("T")[0];
    const upcomingEventsContainer = document.querySelector(".upcoming-events");
    const concludedEventsContainer = document.querySelector(".concluded-events");

    fetch("./assets/events.json")
        .then((response) => response.json())
        .then((events) => {

            // Ordina gli eventi separatamente per upcoming e concluded
            const upcomingEvents = events
                .filter(event => event.date >= today)
                .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordine crescente

            const concludedEvents = events
                .filter(event => event.date < today)
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordine decrescente

            let countUpcoming = 0;
            let countConcluded = 0;
            const limitUpcoming = 2;
            const limitConcluded = 2;

            // Mostra gli eventi futuri (prossimi 2)
            upcomingEvents.slice(0, limitUpcoming).forEach((event) => {
                const eventElement = `
            <div class="upcoming-event ${event.status === "cancelled" ? "cancelled" : ""}">
                <img src='${siteUrl}/assets/img/icons/exclamation.svg' alt="">
                <div class="event-info">
                    <p class="date-event">${new Date(event.date).toLocaleDateString()}</p>
                    ${event.time ? `<p class="time-event">${event.time}</p>` : ""}
                    ${event.location ? `<p class="place-event">${event.location}</p>` : ""}
                    ${event.type ? `<p class="type-event">${event.type}</p>` : ""}
                </div>
                <h2>${event.title}</h2>
                ${event.description ? `<p>${event.description}</p>` : ""}
                ${event.status === "cancelled" ? `<div class="overlay">Cancelled</div>` : ""}
            </div>
        `;
                upcomingEventsContainer.innerHTML += eventElement;
            });

            // Mostra gli eventi passati (ultimi 2 conclusi)
            concludedEvents.slice(0, limitConcluded).forEach((event) => {
                const eventElement = `
            <div class="concluded-event ${event.status === "cancelled" ? "cancelled" : ""}">
                <img src='${siteUrl}/assets/img/icons/concluded.svg' alt="">
                <div class="event-info">
                    <p class="date-event">${new Date(event.date).toLocaleDateString()}</p>
                    ${event.time ? `<p class="time-event">${event.time}</p>` : ""}
                    ${event.location ? `<p class="place-event">${event.location}</p>` : ""}
                    ${event.type ? `<p class="type-event">${event.type}</p>` : ""}
                </div>
                <h2>${event.title}</h2>
                ${event.description ? `<p>${event.description}</p>` : ""}
                ${event.status === "cancelled" ? `<div class="overlay">Cancelled</div>` : ""}
            </div>
        `;
                concludedEventsContainer.innerHTML += eventElement;
            });

        })
        .catch((error) => console.error("Error fetching events:", error));
});
