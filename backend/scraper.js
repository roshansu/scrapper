const puppeteer = require("puppeteer");
const Event = require("./models/event");

async function scrapeEvents() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://www.eventbrite.com.au/d/australia--sydney/events/", {
    waitUntil: "networkidle2",
  });

  const events = await page.evaluate(() => {
    const eventNodes = document.querySelectorAll(".discover-vertical-event-card");
    const extracted = [];
    console.log("hello")

    eventNodes.forEach((el) => {
      const title = el.querySelector("h3")?.innerText.trim();
      const date = el.querySelector(":scope > p")?.innerText.trim();
      const link = el.querySelector("a")?.href;
      const img = el.querySelector("img")?.src;
      if (title && link) {
        extracted.push({ title, date, url: link, img});
      }
    });

    return extracted;
  });


  await Event.deleteMany({});
  await Event.insertMany(events);

  await browser.close();
}


module.exports = scrapeEvents;