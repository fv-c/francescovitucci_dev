document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  const upcomingEventsContainer = document.querySelector(".upcoming-events");
  const concludedEventsContainer = document.querySelector(".concluded-events");

  upcomingEventsContainer.querySelector(".loading-message").style.display =
    "block";
  concludedEventsContainer.querySelector(".loading-message").style.display =
    "block";

  fetch("../assets/events.json")
    .then((response) => response.json())
    .then((events) => {
      upcomingEventsContainer.querySelector(".loading-message").remove();
      concludedEventsContainer.querySelector(".loading-message").remove();

      let currentYear = null;

      // Formatta le date per Google Calendar
      function formatForCalendar(date, time = "00:00") {
        if (time.includes("-")) {
          const [start, end] = time.split("-");
          return {
            start: generateDateTimeString(date, start),
            end: generateDateTimeString(date, end),
          };
        } else {
          const startDateTime = generateDateTimeString(date, time);
          const endDateTime = addHoursToDate(startDateTime, 2);
          return {
            start: startDateTime,
            end: endDateTime,
          };
        }
      }

      function generateDateTimeString(date, time) {
        if (!time.match(/^\d{2}:\d{2}$/)) {
          console.error("Invalid time format:", time);
          time = "00:00"; 
        }

        const [hours, minutes] = time.split(":");
        const dateObj = new Date(date);
        dateObj.setHours(hours, minutes, 0, 0);

        if (isNaN(dateObj.getTime())) {
          console.error("Invalid date or time:", date, time);
          return "";
        }

        return formatDateForGoogle(dateObj);
      }

      function addHoursToDate(dateString, hours) {
        const formattedDateString = dateString.replace(
          /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
          "$1-$2-$3T$4:$5:$6"
        );

        const dateObj = new Date(formattedDateString);
        if (isNaN(dateObj.getTime())) {
          console.error("Failed to create Date object:", formattedDateString);
          return "";
        }

        dateObj.setHours(dateObj.getHours() + hours);

        return formatDateForGoogle(dateObj);
      }

      function formatDateForGoogle(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
      }

      // Eventi futuri
      events
        .filter((event) => event.date >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach((event) => {
          const eventYear = new Date(event.date).getFullYear();
          if (eventYear !== currentYear) {
            const yearDivider = document.createElement("h2");
            yearDivider.className = "year-divider";
            yearDivider.textContent = eventYear;
            upcomingEventsContainer.appendChild(yearDivider);
            currentYear = eventYear;
          }

          const { start, end } = formatForCalendar(event.date, event.time);
          const description = `Created by francescovitucci.com\n\n${event.description || "No description available."}`;

          const googleCalendarLink = `
            https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              event.title
            )}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(event.location || "")}
          `;

          const eventElement = document.createElement("div");
          eventElement.className = `upcoming-event ${
            event.status === "cancelled" ? "cancelled" : ""
          }`;

          eventElement.innerHTML = `
                        <div class="event-info-wrapper">
                            <div class="event-info">
                                <p class="date-event">${new Date(
                                  event.date
                                ).getDate()} ${
            [
              "JAN.",
              "FEB.",
              "MAR.",
              "APR.",
              "MAY.",
              "JUNE",
              "JULY",
              "AUG.",
              "SEPT.",
              "OCT.",
              "NOV.",
              "DEC.",
            ][new Date(event.date).getMonth()]
          }</p>
                                ${
                                  event.time
                                    ? `<p class="time-event">${event.time}</p>`
                                    : ""
                                }
                                ${
                                  event.location
                                    ? `<p class="place-event">${event.location}</p>`
                                    : ""
                                }
                            </div>
                        </div>
                        <div class="event-content">
                            <h2>${event.title}</h2>
                            ${
                              event.description
                                ? `<p>${event.description}</p>`
                                : ""
                            }
                            <a href="${googleCalendarLink}" target="_blank" class="add-to-calendar">
                              Add to Google Calendar
                            </a>
                            ${
                              event.url
                                ? `<a href="${event.url}" target="_blank">Read more</a>`
                                : ""
                            }
                            ${
                              event.status === "cancelled"
                                ? `<div class="event-cancelled-mark">Cancelled</div>`
                                : ""
                            }
                        </div>
                    `;

          upcomingEventsContainer.appendChild(eventElement);
          upcomingEventsContainer.appendChild(
            document.createElement("hr")
          ).style.width = "75%";
        });

      currentYear = null;

      // Eventi passati (recent events)
events
.filter((event) => event.date < today)
.sort((a, b) => new Date(b.date) - new Date(a.date))
.forEach((event) => {
  const eventYear = new Date(event.date).getFullYear();
  if (eventYear !== currentYear) {
    const yearDivider = document.createElement("h2");
    yearDivider.className = "year-divider";
    yearDivider.textContent = eventYear;
    concludedEventsContainer.appendChild(yearDivider);
    currentYear = eventYear;
  }

  const eventElement = document.createElement("div");
  eventElement.className = "concluded-event";

  eventElement.innerHTML = `
    <div class="event-info-wrapper">
        <div class="event-info">
            <p class="date-event">${new Date(
              event.date
            ).getDate()} ${
    [
      "JAN.",
      "FEB.",
      "MAR.",
      "APR.",
      "MAY.",
      "JUNE",
      "JULY",
      "AUG.",
      "SEPT.",
      "OCT.",
      "NOV.",
      "DEC.",
    ][new Date(event.date).getMonth()]
  }</p>
            ${
              event.time
                ? `<p class="time-event">${event.time}</p>`
                : ""
            }
            ${
              event.location
                ? `<p class="place-event">${event.location}</p>`
                : ""
            }
        </div>
    </div>
    <div class="event-content">
        <h2>${event.title}</h2>
        ${
          event.description
            ? `<p>${event.description}</p>`
            : ""
        }
    </div>
  `;

  concludedEventsContainer.appendChild(eventElement);
  concludedEventsContainer.appendChild(
    document.createElement("hr")
  ).style.width = "75%";
});

    });
});
