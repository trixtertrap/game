const express = require('express');
const router = express.Router();



let Members = require('../models/members')


router.get('/addmembers',(req, res) => {
    res.render('add_member', {
        title: 'Add Members'
    })
})

router.post('/addmembers', (req, res) => {
    req.checkBody('name1', 'Name is Required').notEmpty();
    req.checkBody('name2', 'Name is Required').notEmpty();
    req.checkBody('name3', 'Name is Required').notEmpty();
    req.checkBody('name4', 'Name is Required').notEmpty();

    

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_member', {
            title: 'Add Members',
            errors: errors
        })
    } else {

        let members = new Members();
        members.name1 = req.body.name1;
        members.name2 = req.body.name2;
        members.name3 = req.body.name3;
        members.name4 = req.body.name4;

        members.save((err) => {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Members Registered');
                res.redirect('/');
            }
        });
    }
})

module.exports = router
