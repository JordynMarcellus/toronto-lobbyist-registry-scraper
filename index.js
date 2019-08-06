const puppeteer = require("puppeteer");
const parseAccursedString = require("./parseAccursedString");
const URL = "http://app.toronto.ca/lobbyistsearch/searchInput.do";
const WAIT_OPTIONS = { waitUntil: "networkidle2" };
const IS_HEADLESS = false;
const htmlSelectors = require("./selectors");

const lobbyistRegistrarScraper = async function() {
  const browser = await puppeteer.launch({ headless: IS_HEADLESS });
  try {
    const browserPage = await browser.newPage();
    await browserPage.goto(URL);
    const element = await browserPage.$(
      '[href="/lobbyistsearch/searchInput.do"'
    );
    await element.click();
    await browserPage.waitForNavigation(WAIT_OPTIONS);
    await browserPage.click('input[name="freeSearchSM"][value="Active"]');
    await browserPage.select('select[name="fromMonth"]', "06");
    await browserPage.select('select[name="toMonth"]', "06");
    //   this executes the doFreeTextSearch method on the widow 🤯
    await browserPage.evaluate(() => {
      doFreeTextSearch();
      return false;
    });
    await browserPage.waitForNavigation(WAIT_OPTIONS);
    let links = [];
    const compareText = await browserPage.$eval(".tx-compare", div => {
      return div.innerText;
    });
    // this works as we expect it to!!!
    // const maxPages = parseAccursedString(compareText);

    const maxPages = 2;

    // we start at two because we start at page two!
    for (let currentPage = 2; currentPage <= maxPages; currentPage += 1) {
      const pageHrefs = await browserPage.$$eval(
        ".detailedPageText > a",
        elements => {
          const mappedArray = elements.map(element => element.href);
          return mappedArray;
        }
      );
      links = links.concat(pageHrefs);
      await browserPage.evaluate(pageIndex => {
        nextPage(`${pageIndex}`, null);
      }, currentPage);
      await browserPage.waitForNavigation(WAIT_OPTIONS);
    }

    const jsArrayOfDoSubmits = links.map(link => {
      const [stringifiedDoSubmit] = link.match(/\((.*?)\)/g);
      const parsedString = stringifiedDoSubmit
        .replace("('", "")
        .replace("')", "");
      return parsedString;
    });
    const arrayOfData = [];

    for (let pageNumber of jsArrayOfDoSubmits) {
      await browserPage.evaluate(pageNo => {
        doSubmit(pageNo);
      }, pageNumber);
      await browserPage.waitForNavigation(WAIT_OPTIONS);
      const jsonData = await browserPage.evaluate(selectors => {
        const browserMemoryObject = {};

        for (let selector in selectors) {
          browserMemoryObject[selector] = document.querySelector(
            selectors[selector]
          ).innerText;
        }

        return browserMemoryObject;
      }, htmlSelectors);
      arrayOfData.push(jsonData);
      await browserPage.goBack(WAIT_OPTIONS);
      console.log(arrayOfData);
    }
  } catch (e) {
    console.error(e);
  } finally {
    browser.close();
  }
};

lobbyistRegistrarScraper()
  .then(() => {})
  .catch(err => {
    console.error(err);
  });
