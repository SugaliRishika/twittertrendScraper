

# **Selenium Twitter Scraper**

## **Description**
This project is a web scraper for trending topics on Twitter, built using **Selenium**, **Express.js**, and **MongoDB**. It extracts the latest trending topics and saves them into a database for further analysis.

---

## **Key Features**
- Automated login to Twitter using Selenium.
- Extracts trending topics from the Twitter explore page.
- Saves scraped data into MongoDB with a unique ID and timestamp.
- A web interface to display and query the trending topics using Express.js.

---

## **Project Structure**
```
selenium-twitter-scraper/  
├── app.js                 # Main server script  
├── views/                 # EJS template files for rendering  
│   ├── index.ejs          # Landing page
|
├── .env                   # Stores Twitter account credentials
├── package.json           # Project dependencies and scripts  
└── README.md              # Project documentation  
```

---

## **Getting Started**

### **Prerequisites**
Ensure you have the following installed:
1. **Node.js** (v14 or higher)
2. **MongoDB**
3. **Google Chrome** (latest version)
4. **ChromeDriver** (compatible with your Chrome version)

---

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/JohnMichael0311/twittertrendScraper.git  
   cd twittertrendScraper  
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Ensure MongoDB is running locally.
   - Update the `mongoURL` and database name in `app.js` if necessary.

---

### **Configuration**

#### 1. **Twitter Login Credentials**
- Create a `.env` file at the root of the project directory.
- Add the following entries:
   ```env
   TWITTER_USERNAME=your_twitter_username
   TWITTER_PASSWORD=your_twitter_password
   ```

---

### **Running the Project**
1. Start the server:
   ```bash
   node app.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Use the `/run-script` endpoint to trigger the scraping process.

---

## **Endpoints**

| **Route**        | **Description**                                   |
|-------------------|---------------------------------------------------|
| `/`              | Displays the landing page.                        |
| `/run-script`    | Runs the scraper and displays trending topics.    |
| `/get-json/:id`  | Fetches a JSON object of a specific record by ID. |

---

## **Technologies Used**
- **Node.js** - Backend server.
- **Express.js** - Web application framework.
- **Selenium** - For automated browser interactions.
- **MongoDB** - Database for storing results.
- **EJS** - Templating engine for the frontend.

---

## **Known Issues**

1. **Captchas or Login Restrictions:**
   - If Twitter detects scraping activity, a CAPTCHA may block login attempts. This may require manual intervention.

2. **DOM Structure Changes:**
   - Twitter updates its web page frequently. Ensure the element selectors in `app.js` are up-to-date.

---

## **Future Enhancements**
1. Add support for multiple scraping accounts.
2. Enhance CAPTCHA-solving with external tools or services.
3. Implement IP rotation with dynamic proxy servers.
4. Export scraped data to CSV/Excel files.

---

## **License**
This project is open-source and available under the [MIT License](LICENSE).

---

## **Author**
Developed by [John Michael](https://github.com/JohnMichael0311).

Feel free to contribute or raise issues for improvement!

---

Let me know if you'd like any edits or additional features for your README!
