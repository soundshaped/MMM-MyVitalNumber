var NodeHelper = require("node_helper");
const puppeteer = require('puppeteer');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting module helper: " + this.name);
        console.error("testing error log" + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification == "CONFIG") {
            this.config = payload;
            // this.fetchCurrentOccupancy();
            this.scheduleUpdate();
        }
        if (notification == "GET_OCCUPANCY") {
            this.fetchCurrentOccupancy();
        }
    },

    scheduleUpdate: function() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.fetchCurrentOccupancy();
        }, this.config.updateInterval);
    },

    fetchCurrentOccupancy: async function() {
        const url = "https://www.vitalclimbinggym.com/brooklyn";
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--verbose'
                ], 
                executablePath: "/usr/bin/chromium-browser",
                dumpio: true
            });
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
            const occupancyText = await page.$eval('#currocc', el => el.textContent.trim() || "unknownnnn");

            console.log("Occupancy Text: ", occupancyText);
            this.sendSocketNotification("OCCUPANCY_RESULT", occupancyText);

        } catch (error) {
            console.error('Failed to fetch occupancy data: ');
            console.error('Error: '+this.name, error);
            console.error('Stack: '+this.name, error.stack);
            console.log("error message: " + this.name, error.message);
            console.log("error stack: "+this.name, error.stack);
            this.sendSocketNotification("OCCUPANCY_RESULT", ":( unknown");
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
})