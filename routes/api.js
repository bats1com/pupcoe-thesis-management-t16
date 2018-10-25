var express = require('express');
var router = express.Router();
const Class = require('./../models/class');
const Group = require('./../models/group');

/* GET home page. */
router.post('/class/:classId/student', function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('param', req.params.classId, req.body);
    var data = JSON.parse(req.body.data);
    console.log('data', data);
    Class.addStudents(req.params.classId, data.student_ids).then(function(students) {
      console.log('api students', students);
      res.json({
        students: students
      });
    })
  } else {
    res.redirect('/login');
  }
});

router.post('/group/:groupId/student', function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('param', req.params.groupId, req.body);
    var data = JSON.parse(req.body.data);
    console.log('data', data);
    Group.addStudents(req.params.groupId, data.student_ids).then(function(students) {
      console.log('api students', students);
      res.json({
        students: students
      });
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login')
});
module.exports = router;
