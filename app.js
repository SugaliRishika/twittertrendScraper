require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const fetchTrendingTopics = require('./tredingTopicsTwitter');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();
const port = 3000;

// MongoDB connection 
mongoose.connect('mongodb://localhost:27017/trendsonTwitter', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const trendSchema = new mongoose.Schema({
    uniqueId: String,
    trends: [String],
    dateTime: Date,
    ipAddress: String
});

const Trend = mongoose.models.Trend || mongoose.model('Trend', trendSchema);


app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index'); 
});


app.post('/run-script', async (req, res) => {
    try {
        
        const { top5Trends } = await fetchTrendingTopics();

        
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

       
        const newTrend = new Trend({
            uniqueId: uuidv4(),  
            trends: top5Trends,
            dateTime: new Date(),
            ipAddress
        });

        await newTrend.save();

        const currentDateTime = new Date().toLocaleString();
        res.json({
            uniqueId: newTrend.uniqueId,
            top5Trends,
            ipAddress,
            dateTime: currentDateTime,
            mongoRecord: newTrend
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error running the script');
    }
});


app.listen(port, () => {
    console.log(`Server is up and running at http://localhost:${port}`);
});
