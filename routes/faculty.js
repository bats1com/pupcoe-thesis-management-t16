var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Group = require('./../models/group');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    res.render('faculty/home', { layout: 'faculty' });
  } else {
    res.redirect('/')
  }
});

router.get('/classes', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.listByFacultyId(req.user.id)
      .then((classes) => {
        console.log('classes', classes)
        res.render('faculty/classes', { layout: 'faculty', classes: classes });
      })
  } else {
    res.redirect('/')
  }
});

router.get('/class/:classId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.getById(req.params.classId)
      .then((classData) => {
        console.log('class', classData)
        Class.getStudentsByClassId(req.params.classId).then((classStudents)=> {
          res.render('faculty/class_detail', { layout: 'faculty', classData: classData, classStudents: classStudents });
        })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/groups', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Group.listByFacultyId(req.user.id)
      .then((groups) => {
        console.log('groups', groups)
        res.render('faculty/groups', { layout: 'faculty', groups: groups });
      })
  } else {
    res.redirect('/')
  }
}); // done

router.get('/group/:groupId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Group.getById(req.params.groupId)
      .then((groupData) => {
        User.noGroupList('student')
          .then((allStudents) => {
            Group.getStudentsByGroupId(req.params.groupId)
              .then((group_members) => {
                res.render('faculty/group_detail', { layout: 'faculty', allStudents: allStudents, groupData: groupData, group_members: group_members });
              })
          })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/group-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    res.render('faculty/group-create', {layout: 'faculty',  adviserId: req.user.id});
  } else {
    res.redirect('/')
  }
});

router.post('/group-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('create group', req.body);
    Group.create(req.body).then((createdGroup) => {
      res.redirect('/faculty/groups')
    });
  } else {
    res.redirect('/')
  }
});

router.post('/group/:groupId/remove-student/:studentId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('params', req.params);
    console.log('studentId', req.params.studentId);
    console.log('groupId', req.params.groupId);
    Group.deleteMember(req.params.studentId).then(() => {
      res.redirect('/faculty/group/'+req.params.groupId+'')
    });
  } else {
    res.redirect('/')
  }
});


module.exports = router;
