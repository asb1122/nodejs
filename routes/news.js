var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/mentoring_program');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

let NewsSchema = new Schema({
    title: {type: String, required: true},
    text : {type: String, required: true}
});

var NewsModel = mongoose.model('News', NewsSchema);


const newsArray = [{
        title: 'Investors’ Cash Dash Adds to Stock Market’s Vulnerability',
        text: 'Investors are increasing their cash holdings at the fastest pace in a decade, highlighting doubts about the durability of the stock market’s rebound in the first weeks of this year.'
    },
    {
        title: 'Numbers Game: For the Bank of Japan, 80 Trillion Means About 20 Trillion',
        text: 'TOKYO—How much is about 80? The Bank of Japan’s answers include 79, 38, and, lately, about 20.'
    },
    {
        title: 'Apple’s Guidance on Its Services Revenue Left Analysts With More Questions',
        text: 'Apple Inc. this month sparked confusion and frustration among analysts and investors trying to decipher the performance of the company’s services business, fanning lingering concerns about transparency at one of the world’s most closely watched companies.\n.'
    }]

router.get('/', function(req, res) {
    res.json(newsArray);
});

router.post('/', function(req, res) {
    var newsToSave = new NewsModel({
        title: req.body.title,
        text: req.body.text
    });

    newsToSave.save(function (err) {
        if (!err) {
            console.log("News created");
            return res.send({ status: 'OK', article : newsToSave });
        } else {
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            console.log('Error occured (%d): %s',res.statusCode,err.message);
        }
    });
});

router.put('/:id', function (req, res){
    return NewsModel.findById(req.params.id, function (err, news) {
        if(!news) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        news.title = req.body.title;
        news.text = req.body.text;
        return news.save(function (err) {
            if (!err) {
                console.log("news updated");
                return res.send({ status: 'OK', news : news });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                console.log('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

router.get('/:id', function(req, res) {
    return NewsModel.findById(req.params.id, function (err, news) {
        if(!news) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', news: news });
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.delete('/:id', function (req, res){
    return NewsModel.findById(req.params.id, function (err, news) {
        if(!news) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return news.remove(function (err) {
            if (!err) {
                console.log("article removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});



module.exports = router;
