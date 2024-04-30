const {Builder, until, Browser} = require("selenium-webdriver")

async function checkCatalogPage(){
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  try{
    await driver.get('http://localhost:4200');
    await driver.wait(until.titleIs('Online Bookstore'), 10000)
  } finally{
    await driver.quit()
  }
}

checkCatalogPage()
