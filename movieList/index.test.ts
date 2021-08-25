import { afterAll, beforeAll, test, expect } from "@jest/globals";
import { Builder, Capabilities, By } from "selenium-webdriver";

const chromedriver = require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeAll(async () => {
    await driver.get("http://localhost:5500/movieList/index.html")
});

afterAll(async () => {
    await driver.quit()
});

beforeEach(async () => {

    let newMovieField = await driver.findElement(By.xpath('//form/input'))
    let newMovieSubmit = await driver.findElement(By.xpath('//button'))

    const addMovie = async (title) => {
        await newMovieField.sendKeys(`${title}`);
        await newMovieSubmit.click();
        await driver.sleep(1000)
    }

    await addMovie("Saving Private Ryan")
    await addMovie("Inception")
    await addMovie("The Sandlot")
})

test("I can delete a movie and verify the onscreen message", async () => {

    const deleteMovie = async (index) => {
        const targetMovieKillBtn = await driver.findElement(By.xpath(`//li[${index}]/button`));
        const targetMovieKill = await driver.findElement(By.xpath(`//li[${index}]/span`)).getText();
        // const targetMovieKillTitle = await targetMovieKill.getText();
        await targetMovieKillBtn.click()
        const asideText = await driver.findElement(By.xpath('//aside')).getText()
        await driver.sleep(1000)
        await expect(asideText).toBe(`${targetMovieKill} deleted!`)

        await driver.sleep(1000)
    }

    await deleteMovie(1)
    await deleteMovie(2)
    await deleteMovie(1)

    await driver.sleep(1000)s
    
});

test("I can cross off a movie and verify the onscreen message", async () => {
    const crossoutMovie = async (index) => {
        const targetMovieCrossout = await driver.findElement(By.xpath(`//li[${index}]/span`));
        await targetMovieCrossout.click();
        const asideText = await driver.findElement(By.xpath('//aside')).getText()
        const targetClass = await targetMovieCrossout.getAttribute('class')
        if (targetClass === 'checked') {
            expect(asideText).toBe(`${await targetMovieCrossout.getText()} watched!`)
        } else {
            expect(asideText).toBe(`${await targetMovieCrossout.getText()} added back!`)
        }
        
        await driver.sleep(1000);
    }

    await crossoutMovie(3);
    await crossoutMovie(3);
    await crossoutMovie(2);
    await crossoutMovie(2);
    await crossoutMovie(1);
    await crossoutMovie(1);
})

