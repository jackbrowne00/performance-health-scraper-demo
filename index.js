const puppeteer = require("puppeteer");
const fs = require("fs/promises");

console.log("running index.js");

const url =
  "https://www.performancehealth.co.uk/days-100-series-lightweight-rollators#sin=126269";

function waitFor(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function start() {
  const data = {};
  console.log("launching browser");
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  });

  console.log("creating page");
  const page = await browser.newPage();

  await page.setViewport({
    width: 1400,
    height: 800,
    deviceScaleFactor: 1,
  });

  console.log("going to url");
  await page.goto(url);

  console.log("waiting for 2000 miliseconds");
  await waitFor(6000);

  console.log("getting the title");
  data.title = await page.$eval(
    "#maincontent > div.columns > div > div.product-info-main > div.page-title-wrapper.product > h1 > span",
    (el) => {
      return el.textContent.toLowerCase().replaceAll(" ", "-");
    }
  );
  console.log("data.title", data.title);

  console.log("making directory for images");
  await fs.mkdir(`./${data.title}/images`, { recursive: true });
  console.log("before");

  const imageSelectors = await page.$$(
    "#maincontent > div.columns > div > div.product.media > div.gallery-placeholder > div.fotorama-item.fotorama.fotorama1669327804492 > div.fotorama__wrap.fotorama__wrap--css3.fotorama__wrap--slide.fotorama__wrap--toggle-arrows.fotorama__wrap--no-controls > div.fotorama__nav-wrap.fotorama__nav-wrap--horizontal > div > div.fotorama__nav__shaft > div.fotorama__nav__frame.fotorama__nav__frame--thumb.fotorama__active"
  );

  console.log(imageSelectors);

  // click the thumbnail

  // extract the src for the main image
  // store the src in an array
  console.log("past");
  //   imageSelectors.forEach(await saveImage());

  console.log("extracting main image");
  const mainImageSrc = await page.$eval("#magnifier-item-0", (el) => {
    return el.src;
  });

  async function saveImage(i) {
    await page.click(imageSelectors[i]);
    console.log("going to image page");
    const mainImagePage = await page.goto(mainImageSrc);

    console.log("saving the image locally");
    const filePath = `${data.title}/images/main-image.jpg`;
    await fs.writeFile(filePath, await mainImagePage.buffer());
  }

  //   #magnifier-item-0
  //   #magnifier-item-0
}

start();
