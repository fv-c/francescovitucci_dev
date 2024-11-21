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
                                ${
                                  event.type
                                    ? `<p class="type-event">${event.type}</p>`
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
                                ${
                                  event.type
                                    ? `<p class="type-event">${event.type}</p>`
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
                            ${
                              event.url
                                ? `<a href="${event.url}" target="_blank">Read more</a>`
                                : ""
                            }
                        </div>
                    `;

          concludedEventsContainer.appendChild(eventElement);
          concludedEventsContainer.appendChild(
            document.createElement("hr")
          ).style.width = "75%";
        });
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      upcomingEventsContainer.innerHTML =
        "<p class='no-events'>No upcoming events available.</p>";
      concludedEventsContainer.innerHTML =
        "<p class='no-events'>No recent events available.</p>";
    });
});
