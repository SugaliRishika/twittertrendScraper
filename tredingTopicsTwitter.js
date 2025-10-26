const { Builder, By, Key, until } = require('selenium-webdriver');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// MongoDB schema and model setup
mongoose.connect('mongodb://localhost:27017/trendsonTwitter', { useNewUrlParser: true, useUnifiedTopology: true });
const trendSchema = new mongoose.Schema({
    uniqueId: String,
    trends: [String],
    dateTime: Date,
    ipAddress: String
});
const Trend = mongoose.model('Trend', trendSchema);

// ProxyMesh credentials
const PROXY_URL = 'http://JohnMichael@03:johnnani120704@us-ca.proxymesh.com:31280';

// Helper function to extract the IP address from the Proxy URL
const extractProxyIP = (proxyURL) => {
    const ipPort = proxyURL.split('@')[1].split(':')[0];
    return ipPort;
};
const ipAddress = extractProxyIP(PROXY_URL); 

async function loginToTwitter(driver, username, emailOrPhone, password) {
    console.log("Phase 1: Opening the Twitter login page...");
    await driver.get('https://twitter.com/login');

    console.log("Phase 2: Waiting for the username/email field...");
    const usernameField = await driver.wait(until.elementLocated(By.name('text')), 10000);

    console.log("Phase 3: Inputting the username/email...");
    await usernameField.sendKeys(username, Key.RETURN);

    console.log("Phase 4: Checking for phone/email verification step...");
    try {
        const phoneOrEmailField = await driver.wait(
            until.elementLocated(By.css('input[data-testid="ocfEnterTextTextInput"]')),
            5000
        );
        console.log("Phase 5: Entering phone/email...");
        await phoneOrEmailField.sendKeys(emailOrPhone, Key.RETURN);
    } catch (e) {
        console.log("Phone/email verification step skipped.");
    }

    console.log("Phase 6: Waiting for the password field...");
    const passwordField = await driver.wait(until.elementLocated(By.name('password')), 10000);

    console.log("Phase 7: Inputting the password...");
    await passwordField.sendKeys(password, Key.RETURN);

    console.log("Phase 8: Allowing time for the home page to load...");
    await driver.wait(until.titleContains('Home'), 10000);

    console.log("Phase 9: Successfully signed in!");
}

async function fetchTrendingTopics() {
    const uniqueId = uuidv4();
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions({
            proxy: {
                proxyType: 'manual',
                httpProxy: PROXY_URL,
                sslProxy: PROXY_URL,
            },
        })
        .build();

    try {
        // Login credentials
        const username = process.env.TWITTER_USERNAME;
        const emailOrPhone = process.env.TWITTER_EMAIL_OR_PHONE;
        const password = process.env.TWITTER_PASSWORD;

        // Login to Twitter
        await loginToTwitter(driver, username, emailOrPhone, password);

        console.log("Phase 10: Going to the 'Trending' section...");
        await driver.get('https://twitter.com/explore/tabs/trending');

        console.log("Phase 11: Waiting for the trends section to load...");
        // Waiting for an element indicating that trends have loaded
        await driver.wait(until.elementLocated(By.css('div[aria-label="Timeline: Explore"]')), 20000);

        console.log("Phase 12: Retrieving the top 5 trending topics...");
        // Attempt to grab the trend elements in a different way: check for valid trends by grabbing the list and filter
        const trendElements = await driver.findElements(By.css('div.css-175oi2r span'));

        const top5Trends = [];
        let trendCount = 0;

        for (let i = 0; i < trendElements.length; i++) {
            const trendText = await trendElements[i].getText();

            // Perform an additional check for empty spaces and hashtags
            if (trendText.trim() && trendText.startsWith('#') && trendCount < 5) {
                top5Trends.push(trendText);
                trendCount++;
            }

            if (trendCount >= 5) break;  // Exit once top 5 trends are fetched
        }

        if (top5Trends.length === 0) {
            console.log("No trending topics found. Consider reviewing the selectors or Twitter layout.");
        } else {
            console.log("Top trends successfully retrieved.");
        }

        console.log("Phase 13: Storing the results in the database...");
        const newTrend = new Trend({
            uniqueId,
            trends: top5Trends,
            dateTime: new Date(),
            ipAddress // Store the extracted proxy IP
        });
        await newTrend.save();

        console.log("Data successfully stored.");
        return { uniqueId, top5Trends, ipAddress };

    } catch (error) {
        console.error("An error occurred during the process:", error);
    } finally {
        console.log("Phase 14: Closing the browser...");
        await driver.quit();
    }
}

module.exports = fetchTrendingTopics;
