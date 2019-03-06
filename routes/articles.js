const express = require('express');
const router = express.Router();



let Article = require('../models/articles')
let User = require('../models/user')

router.get('/add', ensureAuthenticated , (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is Required').notEmpty();
    //req.checkBody('author', 'Author is Required').notEmpty();
    req.checkBody('description', 'Description is Required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        })
    } else {

        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.description = req.body.description;
        article.map = req.body.map;
        article.time = req.body.time;
        article.fees = req.body.fees;

        article.save((err) => {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }
})

router.get('/edit/:id', ensureAuthenticated,(req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if(article.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/')
        }
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        })
    })
})

router.post('/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.description = req.body.description;
    article.map = req.body.map;
    article.time = req.body.time;
    article.fees = req.body.fees;
    

    let query = { _id: req.params.id }

    Article.update(query, article, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Updated')
            res.redirect('/');
        }
    });
})

router.delete('/:id', (req, res) => {
    if(!req.user._id){
        res.status(500).send();
    }
    
    let query = { _id: req.params.id }

    Article.findById(req.params.id, (err, article)=>{
        if(article.author != req.user._id){
            res.status(500).send();
        }else{
            Article.deleteOne(query, (err) => {

                if (err) {
                    console.log(err);
                }
                req.flash('warning', 'Article Deleted')
                res.send('success');
            })
        }
    })
})

router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, articles) => {
        User.findById(articles.author, (err, user)=>{
            res.render('articles', {
                articles: articles,
                author: user.name
            })  
        })
    })
})

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;