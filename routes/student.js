var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Group = require('./../models/group');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    Class.getByStudentId(req.user.id)
      .then(function(data) {
        Group.getMembersByStudentId(req.user.id)
          .then((group_members) => {
            console.log('data student', data);
            console.log('data group', group_members);
            if (group_members != '') {
              res.render('student/home', { 
                layout: 'student', 
                first_name: req.user.first_name, 
                last_name: req.user.last_name, 
                user: data, 
                group_members: group_members, 
                groupId: group_members[0].group_id, 
                groupName: group_members[0].name
              });
            } else {
              res.render('student/home', { 
                layout: 'student', 
                first_name: req.user.first_name, 
                last_name: req.user.last_name, 
                user: data,
              });
            }
        })
      })
  } else {
    res.redirect('/')
  }
});


module.exports = router;
