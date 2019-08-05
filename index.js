const puppeteer = require("puppeteer");
const URL = "http://app.toronto.ca/lobbyistsearch/searchInput.do";

const lobbyistRegistrarScraper = async function() {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const browserPage = await browser.newPage();
    await browserPage.goto(URL);
    const element = await browserPage.$(
      '[href="/lobbyistsearch/searchInput.do"'
    );
    await element.click();
    await browserPage.waitForNavigation();
    await browserPage.click('input[name="freeSearchSM"][value="Active"]');
    await browserPage.select('select[name="fromMonth"]', "06");
    await browserPage.select('select[name="toMonth"]', "06");
    //   this executes the doFreeTextSearch method on the widow 🤯
    await browserPage.evaluate(() => {
      doFreeTextSearch();
      return false;
    });
    await browserPage.waitForNavigation();
    const firstPageElements = await browserPage.$$(".detailedPageText > a");
    await Promise.all(
      firstPageElements.map(async lobbyistDetailsPage => {
        await lobbyistDetailsPage.click();
        await browserPage.waitForSelector("td[width='632']");
        await browserPage.goBack();
        return false;
      })
    );
  } catch (e) {
    console.error(e);
  }
  browser.close();
};

lobbyistRegistrarScraper()
  .then(() => {})
  .catch(err => {
    console.error(err);
  });
