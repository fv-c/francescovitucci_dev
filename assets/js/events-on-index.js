document.addEventListener("DOMContentLoaded", function () {
    siteUrl = document.location.origin;

    const today = new Date().toISOString().split("T")[0];
    const upcomingEventsContainer = document.querySelector(".upcoming-events");
    const concludedEventsContainer = document.querySelector(".concluded-events");

    fetch("./assets/events.json")
        .then((response) => response.json())
        .then((events) => {
            const upcomingEvents = events
                .filter(event => event.date >= today)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const concludedEvents = events
                .filter(event => event.date < today)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const limitUpcoming = 2;
            const limitConcluded = 2;

            function formatForCalendar(date, time = "00:00") {
                //console.log("Formatting event:", date, time);  // Debug

                if (time.includes("-")) {
                    const [start, end] = time.split("-");
                    return {
                        start: generateDateTimeString(date, start),
                        end: generateDateTimeString(date, end)
                    };
                } else {
                    const startDateTime = generateDateTimeString(date, time);
                    const endDateTime = addHoursToDate(startDateTime, 2);
                    return {
                        start: startDateTime,
                        end: endDateTime
                    };
                }
            }

            function generateDateTimeString(date, time) {
                if (!time.match(/^\d{2}:\d{2}$/)) {
                    console.error("Invalid time format:", time);
                    time = "00:00";  // Fallback a mezzanotte
                }

                const [hours, minutes] = time.split(":");
                const dateObj = new Date(date);
                dateObj.setUTCHours(hours, minutes, 0, 0);

                if (isNaN(dateObj.getTime())) {
                    console.error("Invalid date or time:", date, time);
                    return "";
                }

                return dateObj.toISOString().replace(/-|:|\.\d+/g, '');
            }

            function addHoursToDate(dateString, hours) {
                if (!dateString) {
                    console.error("Invalid date string provided to addHoursToDate:", dateString);
                    return "";
                }

                const formattedDateString = dateString.replace(
                    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
                    "$1-$2-$3T$4:$5:$6Z"
                );

                const dateObj = new Date(formattedDateString);
                if (isNaN(dateObj.getTime())) {
                    console.error("Failed to create Date object in addHoursToDate:", formattedDateString);
                    return "";
                }

                dateObj.setUTCHours(dateObj.getUTCHours() + hours);
                return dateObj.toISOString().replace(/-|:|\.\d+/g, '');
            }

            upcomingEvents.slice(0, limitUpcoming).forEach((event) => {
                const { start, end } = formatForCalendar(event.date, event.time);

                const description = `Created by francescovitucci.com\n\n${event.description || "No description available."}`;

                const googleCalendarLink = `
                    https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(event.title)}
                    &dates=${start}/${end}
                    &details=${encodeURIComponent(description)}
                    &location=${encodeURIComponent(event.location || "")}
                `;

                const eventElement = `
                    <div class="upcoming-event ${event.status === "cancelled" ? "cancelled" : ""}">
                        <img src='${siteUrl}/assets/img/icons/exclamation.svg' alt="">
                        <div class="event-info">
                            <p class="date-event">${new Date(event.date).toLocaleDateString()}</p>
                            <p class="time-event">${event.time}</p>
                            ${event.location ? `<p class="place-event">${event.location}</p>` : ""}
                        </div>
                        <h2>${event.title}</h2>
                        <a href="${googleCalendarLink}" target="_blank" class="add-to-calendar">Add to Google Calendar</a>
                        ${event.description ? `<p>${event.description}</p>` : ""}
                        ${event.status === "cancelled" ? `<div class="overlay">Cancelled</div>` : ""}
                    </div>
                `;
                upcomingEventsContainer.innerHTML += eventElement;
            });

            concludedEvents.slice(0, limitConcluded).forEach((event) => {
                const eventElement = `
                    <div class="concluded-event ${event.status === "cancelled" ? "cancelled" : ""}">
                        <img src='${siteUrl}/assets/img/icons/concluded.svg' alt="">
                        <div class="event-info">
                            <p class="date-event">${new Date(event.date).toLocaleDateString()}</p>
                            <p class="time-event">${event.time}</p>
                            ${event.location ? `<p class="place-event">${event.location}</p>` : ""}
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
