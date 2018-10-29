var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Group = require('./../models/group');
const Committee = require('./../models/committee');
const Thesis = require('./../models/thesis');
const Defense = require('./../models/defense');

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

router.get('/thesis', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    var is_Committee = false;
    Committee.checkIfCommittee(req.user.id)
      .then(function(isCommittee) {
        console.log('isCOM',isCommittee)
        if (isCommittee) {
          is_Committee = true;
        }
        console.log('iscom', is_Committee)
      Thesis.list()
        .then(function(thesis) {
          console.log('thesis data', thesis);
          res.render('faculty/thesis', {
            layout: 'faculty',
            thesis: thesis,
            is_Committee: is_Committee
          });
        });

      });

  } else {
    res.redirect('/')
  }
});

router.get('/thesis/adviser-approval', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    Thesis.listByAdviserId(req.user.id)
      .then(function(adviser_approval) {
        console.log('thesis data', adviser_approval);
        res.render('faculty/adviser_approval', {
          layout: 'faculty',
          adviser_approval: adviser_approval
        });
      });
  } else {
    res.redirect('/')
  }
});
// POST rote for approve and reject

router.post('/thesis/adviser-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserApproved(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/faculty/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/adviser-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserRejected(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/faculty/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.get('/thesis/committee-approval', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    // create function for showing only theses that has not been judged yet by the specific faculty
    Thesis.listForCommitteeApproval(req.user.id)
      .then(function(committee_approval) {
        console.log('thesis data', committee_approval);
        res.render('faculty/committee_approval', {
          layout: 'faculty',
          committee_approval: committee_approval
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeApproved(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
        Thesis.checkCommitteeApprovalCount(req.body.thesisId)
          .then(function(memberCount) {
            console.log('memberCount', memberCount);
            var memCount = memberCount[0].member_approval;
            if (memCount > 4) {   // 5 members approval needed for committee approval
              Thesis.committeeApprovedComplete(req.body.thesisId)
            }
            console.log('committee approved:', committee_approval);
            res.redirect('/faculty/thesis/committee-approval')
          })
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeReject(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
        console.log('committee approved:', committee_approval);
        res.redirect('/faculty/thesis/committee-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.get('/mor', function(req, res, next) { //change
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Thesis.listMor()
      .then(function (mor) {
        res.render('faculty/mor', {
          layout: 'faculty',
          mor: mor
        });
      });
  } else {
    res.redirect('/')
  }
});

module.exports = router;
