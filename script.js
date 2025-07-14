// Countdown Timer App JavaScript
class CountdownTimer {
  constructor() {
    this.events = this.loadEventsFromStorage();
    this.activeIntervals = new Map();
    this.init();
  }

  init() {
    this.bindEventListeners();
    this.renderCountdowns();
    this.setMinDate();
  }

  bindEventListeners() {
    const form = document.getElementById("eventForm");
    form.addEventListener("submit", (e) => this.handleFormSubmit(e));
  }

  setMinDate() {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("eventDate").setAttribute("min", today);
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const eventName = formData.get("eventName").trim();
    const eventDate = formData.get("eventDate");
    const eventTime = formData.get("eventTime") || "00:00";

    // Clear previous warning
    this.hideWarning();

    // Validate inputs
    if (!this.validateInputs(eventName, eventDate, eventTime)) {
      return;
    }

    // Create event object
    const event = {
      id: this.generateId(),
      name: eventName,
      date: eventDate,
      time: eventTime,
      targetDateTime: new Date(`${eventDate}T${eventTime}`),
      createdAt: new Date(),
    };

    // Add event and save to storage
    this.events.push(event);
    this.saveEventsToStorage();

    // Reset form and render countdowns
    e.target.reset();
    this.renderCountdowns();

    // Show success message briefly
    this.showSuccessMessage(`"${eventName}" countdown started!`);
  }

  validateInputs(name, date, time) {
    // Check if name is empty
    if (!name) {
      this.showWarning("Please enter an event name.");
      return false;
    }

    // Check if date is empty
    if (!date) {
      this.showWarning("Please select an event date.");
      return false;
    }

    // Create target date
    const targetDate = new Date(`${date}T${time}`);
    const now = new Date();

    // Check if date is valid
    if (isNaN(targetDate.getTime())) {
      this.showWarning("Please enter a valid date and time.");
      return false;
    }

    // Check if date is in the past
    if (targetDate <= now) {
      this.showWarning("Please select a future date and time.");
      return false;
    }

    // Check if the countdown would overflow precision (more than 999 days)
    const timeDiff = targetDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff > 999) {
      this.showWarning(
        "Event date is too far in the future (maximum 999 days)."
      );
      return false;
    }

    return true;
  }

  showWarning(message) {
    const warningElement = document.getElementById("warningMessage");
    warningElement.textContent = message;
    warningElement.classList.remove("hidden");
  }

  hideWarning() {
    const warningElement = document.getElementById("warningMessage");
    warningElement.classList.add("hidden");
  }

  showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    successDiv.style.cssText = `
      background: #c6f6d5;
      color: #22543d;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 15px;
      border-left: 4px solid #38a169;
      font-weight: 500;
    `;

    const form = document.getElementById("eventForm");
    form.appendChild(successDiv);

    // Remove after 3 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 3000);
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  renderCountdowns() {
    const container = document.getElementById("countdownsContainer");

    // Clear existing intervals
    this.activeIntervals.forEach((interval) => clearInterval(interval));
    this.activeIntervals.clear();

    if (this.events.length === 0) {
      container.innerHTML = `
        <div class="no-events">
          <p>No active countdowns. Create your first event above!</p>
        </div>
      `;
      return;
    }

    // Sort events by target date
    const sortedEvents = [...this.events].sort(
      (a, b) => new Date(a.targetDateTime) - new Date(b.targetDateTime)
    );

    container.innerHTML = sortedEvents
      .map((event) => this.createCountdownCard(event))
      .join("");

    // Start intervals for each countdown
    sortedEvents.forEach((event) => {
      this.startCountdown(event);
    });
  }

  createCountdownCard(event) {
    const isCompleted = new Date() >= new Date(event.targetDateTime);
    const formattedDate = this.formatEventDate(event.date, event.time);

    return `
      <div class="countdown-card ${
        isCompleted ? "completed" : ""
      }" data-event-id="${event.id}">
        <div class="countdown-header">
          <div>
            <div class="event-name">${this.escapeHtml(event.name)}</div>
            <div class="event-date">${formattedDate}</div>
          </div>
          <button class="delete-btn" onclick="countdownTimer.deleteEvent('${
            event.id
          }')">
            Delete
          </button>
        </div>
        
        ${
          isCompleted
            ? '<div class="completed-message">🎉 Event has arrived!</div>'
            : ""
        }
        
        <div class="countdown-display" id="countdown-${event.id}">
          <div class="time-unit">
            <span class="time-value" id="days-${event.id}">0</span>
            <div class="time-label">Days</div>
          </div>
          <div class="time-unit">
            <span class="time-value" id="hours-${event.id}">0</span>
            <div class="time-label">Hours</div>
          </div>
          <div class="time-unit">
            <span class="time-value" id="minutes-${event.id}">0</span>
            <div class="time-label">Minutes</div>
          </div>
          <div class="time-unit">
            <span class="time-value" id="seconds-${event.id}">0</span>
            <div class="time-label">Seconds</div>
          </div>
        </div>
      </div>
    `;
  }

  formatEventDate(date, time) {
    const eventDate = new Date(`${date}T${time}`);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return eventDate.toLocaleDateString("en-US", options);
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  startCountdown(event) {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(event.targetDateTime).getTime();
      const timeDiff = target - now;

      if (timeDiff <= 0) {
        // Event has arrived
        this.handleEventComplete(event);
        return;
      }

      // Calculate time units
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // Update display with animation
      this.updateTimeDisplay(event.id, "days", days);
      this.updateTimeDisplay(event.id, "hours", hours);
      this.updateTimeDisplay(event.id, "minutes", minutes);
      this.updateTimeDisplay(event.id, "seconds", seconds);
    };

    // Update immediately
    updateCountdown();

    // Set interval for updates
    const interval = setInterval(updateCountdown, 1000);
    this.activeIntervals.set(event.id, interval);
  }

  updateTimeDisplay(eventId, unit, value) {
    const element = document.getElementById(`${unit}-${eventId}`);
    if (element) {
      const currentValue = parseInt(element.textContent);
      if (currentValue !== value) {
        element.textContent = value.toString().padStart(2, "0");

        // Add animation class
        element.classList.add("updated");
        setTimeout(() => element.classList.remove("updated"), 300);
      }
    }
  }

  handleEventComplete(event) {
    // Clear the interval
    const interval = this.activeIntervals.get(event.id);
    if (interval) {
      clearInterval(interval);
      this.activeIntervals.delete(event.id);
    }

    // Update the card to completed state
    const card = document.querySelector(`[data-event-id="${event.id}"]`);
    if (card) {
      card.classList.add("completed");

      // Add completed message if not already present
      if (!card.querySelector(".completed-message")) {
        const header = card.querySelector(".countdown-header");
        const completedMsg = document.createElement("div");
        completedMsg.className = "completed-message";
        completedMsg.innerHTML = "🎉 Event has arrived!";
        header.insertAdjacentElement("afterend", completedMsg);
      }

      // Set all time values to 00
      ["days", "hours", "minutes", "seconds"].forEach((unit) => {
        this.updateTimeDisplay(event.id, unit, 0);
      });
    }

    // Show notification
    this.showEventNotification(event);

    // Play notification sound
    this.playNotificationSound();
  }

  showEventNotification(event) {
    // Browser notification (if permission granted)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Event: ${event.name}`, {
        body: "Your countdown has reached zero!",
        icon: "🎉",
      });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      // Request permission
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(`Event: ${event.name}`, {
            body: "Your countdown has reached zero!",
            icon: "🎉",
          });
        }
      });
    }

    // Fallback alert
    setTimeout(() => {
      alert(`🎉 Event "${event.name}" has arrived!`);
    }, 500);
  }

  playNotificationSound() {
    const audio = document.getElementById("notificationSound");
    if (audio) {
      audio.play().catch((e) => {
        // Ignore audio play errors (browser restrictions)
        console.log("Could not play notification sound:", e);
      });
    }
  }

  deleteEvent(eventId) {
    if (confirm("Are you sure you want to delete this countdown?")) {
      // Clear interval if active
      const interval = this.activeIntervals.get(eventId);
      if (interval) {
        clearInterval(interval);
        this.activeIntervals.delete(eventId);
      }

      // Remove from events array
      this.events = this.events.filter((event) => event.id !== eventId);

      // Save to storage and re-render
      this.saveEventsToStorage();
      this.renderCountdowns();
    }
  }

  loadEventsFromStorage() {
    try {
      const stored = localStorage.getItem("countdownEvents");
      if (stored) {
        const events = JSON.parse(stored);
        // Convert date strings back to Date objects
        return events.map((event) => ({
          ...event,
          targetDateTime: new Date(event.targetDateTime),
          createdAt: new Date(event.createdAt),
        }));
      }
    } catch (error) {
      console.error("Error loading events from storage:", error);
    }
    return [];
  }

  saveEventsToStorage() {
    try {
      localStorage.setItem("countdownEvents", JSON.stringify(this.events));
    } catch (error) {
      console.error("Error saving events to storage:", error);
    }
  }

  // Public method to clear all events (for testing/demo)
  clearAllEvents() {
    if (confirm("Are you sure you want to delete all countdowns?")) {
      // Clear all intervals
      this.activeIntervals.forEach((interval) => clearInterval(interval));
      this.activeIntervals.clear();

      // Clear events
      this.events = [];
      this.saveEventsToStorage();
      this.renderCountdowns();
    }
  }
}

// Initialize the countdown timer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.countdownTimer = new CountdownTimer();

  // Request notification permission on load
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
});

// Handle page visibility change to keep countdowns accurate
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && window.countdownTimer) {
    // Re-render countdowns when page becomes visible
    // This ensures accuracy if the page was hidden for a while
    window.countdownTimer.renderCountdowns();
  }
});
