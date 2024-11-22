document.addEventListener("DOMContentLoaded", function () {

    siteUrl = document.location.origin;

    const today = new Date().toISOString().split("T")[0];
    const upcomingEventsContainer = document.querySelector(".upcoming-events");
    const concludedEventsContainer = document.querySelector(".concluded-events");

    fetch("./assets/events.json")
        .then((response) => response.json())
        .then((events) => {

            events.sort((a, b) => new Date(b.date) - new Date(a.date));

            let countUpcoming = 0;
            let countConcluded = 0;
            const limitUpcoming = 2;
            const limitConcluded = 2;

            events.forEach((event) => {
                const eventDate = event.date;
                const isUpcoming = eventDate >= today;

                const eventElement = `
            <div class="${isUpcoming ? "upcoming-event" : "concluded-event"} ${event.status === "cancelled" ? "cancelled" : ""}">
                <img src='${siteUrl}/assets/img/icons/${isUpcoming ? "exclamation" : "concluded"}.svg' alt="">
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


                if (isUpcoming && countUpcoming < limitUpcoming) {
                    upcomingEventsContainer.innerHTML += eventElement;
                    countUpcoming++;
                } else if (!isUpcoming && countConcluded < limitConcluded) {
                    concludedEventsContainer.innerHTML += eventElement;
                    countConcluded++;
                }
            });
        })
        .catch((error) => console.error("Error fetching events:", error));
});