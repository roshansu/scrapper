const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("./models/event");

async function scrapeEvents() {
  try {
    const { data: html } = await axios.get("https://www.eventbrite.com.au/d/australia--sydney/events/");
    const $ = cheerio.load(html);

    const events = [];

    $(".discover-vertical-event-card").each((_, el) => {
      const title = $(el).find("h3").text().trim();
      const date = $(el).children("p").first().text().trim(); 
      const link = $(el).find("a").attr("href");
      const img = $(el).find("img").attr("src");

      if (title && link) {
        events.push({ title, date, url: link, img });
      }
    });

    await Event.deleteMany({});
    await Event.insertMany(events);

    console.log("Events scraped and stored.");
  } catch (err) {
    console.error("Scraping failed:", err.message);
  }
}

module.exports = scrapeEvents;
