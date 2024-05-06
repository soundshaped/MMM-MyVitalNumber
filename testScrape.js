import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

async function testFetch() {
    const url = "https://www.vitalclimbinggym.com/brooklyn";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        console.log(html);
        const root = parse(html);
        const occupancyElement = root.querySelector('#currocc');
        const occupancyText = occupancyElement ? occupancyElement.text : "Element not found";

        console.log("Occupancy Text: ", occupancyText);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

testFetch();
