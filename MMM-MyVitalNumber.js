Module.register("MMM-MyVitalNumber", {
    defaults: {
        occupancy: "loading...",
        updateInterval: 5*60*1000,
    },

    occupancyText: "loading...",

    start: function() {
        console.log("Starting module: " + this.name);
        this.sendSocketNotification("CONFIG", this.config);
        this.sendSocketNotification("GET_OCCUPANCY", {});
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification == "OCCUPANCY_RESULT") {
            this.occupancyText = payload;
            this.updateDom();
        }
    },
    updateColor(value) {
      var color;
      if (value < 100) {
        color = "#00ff00";
      } else if (value >= 100 && value < 150) {
        color = "#ffff00";
      } else if (value >= 150 && value < 200) {
        color = "#ff9900";
      } else if (value >= 200 && value < 260) {
        color = "#ff0000";
      } else if (value >= 260) {
        color = "#660066";
      }
      return color;
    },
    getDom: function() {
        var wrapper = document.createElement("div");
        var currentOccupancy = parseInt(this.occupancyText, 10);
        var color = this.updateColor(currentOccupancy);
        wrapper.innerHTML = "Vital: " + this.occupancyText;
        wrapper.style.color = color;
        return wrapper;
    }
});