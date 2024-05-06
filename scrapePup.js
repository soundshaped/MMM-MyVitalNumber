import puppeteer from 'puppeteer';

async function scrapeData() {
    console.log("launching browser")
    const url = "https://www.vitalclimbinggym.com/brooklyn";
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true, // running headless
            executablePath: '/usr/bin/chromium-browser', // path to chromium browser
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // these improve security and performance in certain environments
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' }); // wait until no new network connections are made

        const number_of_people = await page.$eval('#currocc', el => el.textContent.trim());
        console.log("Number of people: ", number_of_people);

        const datetime = new Date();
        const new_row = {
            date: datetime.toISOString().split('T')[0],
            time: datetime.toTimeString().split(' ')[0],
            day: datetime.toLocaleString('en-US', { weekday: 'long' }),
            ppl: number_of_people,
            datetime: datetime.toISOString()
        };

        console.log(new_row);
        return new_row;
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

scrapeData();
