var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Group = require('./../models/group');
const Committee = require('./../models/committee');
const Thesis = require('./../models/thesis');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/home', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});

router.get('/faculties', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('faculty')
        .then(function(users) {
          console.log('users', users)
          res.render('admin/faculties', { layout: 'admin', users: users });
        })
  } else {
    res.redirect('/')
  }
}); 

router.get('/faculty-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/faculty_create', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});

router.post('/faculty-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create', req.body);
    User.create(req.body)
        .then(function(user) {
          res.redirect('/admin/faculties');
        });
  } else {
    res.redirect('/')
  }
})

router.get('/students', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('student')
        .then(function(users) {
          res.render('admin/students', { layout: 'admin', users: users });
        })
  } else {
    res.redirect('/')
  }
});

router.get('/student-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/student_create', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});
router.post('/student-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create', req.body);
    User.create(req.body)
        .then(function(user) {
          res.redirect('/admin/students');
        });
  } else {
    res.redirect('/')
  }
})


router.get('/classes', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Class.list()
      .then((classes) => {
        console.log('classes', classes)
        res.render('admin/classes', { layout: 'admin', classes: classes });
      })
  } else {
    res.redirect('/')
  }
});
router.get('/class/:classId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Class.getById(req.params.classId)
      .then((classData) => {
        console.log('class', classData)
        User.noClassList('student')
          .then((allStudents) => {
            Class.getStudentsByClassId(req.params.classId).then((classStudents)=> {
              res.render('admin/class_detail', { layout: 'admin', classData: classData, allStudents: allStudents, classStudents: classStudents });
            })
          })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/class-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('faculty')
      .then((users) => {
        res.render('admin/class_create', { layout: 'admin', faculties: users });
      })
  } else {
    res.redirect('/')
  }
});

router.post('/class-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create class', req.body);
    Class.create(req.body).then((createdClass) => {
      res.redirect('/admin/classes')
    });
  } else {
    res.redirect('/')
  }
}),

router.get('/committee', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.listCommittee('committee')
      .then((committee_members) => {
        User.notCommitteeList('faculty')
         .then((allFaculty) => {
        console.log('commmiteeData', committee_members)
            res.render('admin/committee', {
              layout: 'admin',
              allFaculty: allFaculty,
              committee_members:committee_members
            });
          })
      })
  } else {
    res.redirect('/')
  }
}); 

router.post('/committee/remove-member/:facultyId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('params', req.params);
    console.log('facultyId', req.params.facultyId);
    Committee.deleteMember(req.params.facultyId).then(() => {
      res.redirect('/admin/committee');
    });
  } else {
    res.redirect('/')
  }
});

// Thesis proposals routes

router.get('/thesis', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
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
            layout: 'admin',
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
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    Thesis.listByAdviserId(req.user.id)
      .then(function(adviser_approval) {
        console.log('thesis data', adviser_approval);
        res.render('faculty/adviser_approval', {
          layout: 'admin',
          adviser_approval: adviser_approval
        });
      });
  } else {
    res.redirect('/')
  }
});
// POST rote for approve and reject

router.post('/thesis/adviser-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserApproved(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/admin/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/adviser-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserRejected(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/admin/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.get('/thesis/committee-approval', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    // create function for showing only theses that has not been judged yet by the specific faculty
    Thesis.listForCommitteeApproval(req.user.id)
      .then(function(committee_approval) {
        console.log('thesis data', committee_approval);
        res.render('faculty/committee_approval', {
          layout: 'admin',
          committee_approval: committee_approval
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeApproved(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
    // Create function to check if approval count reached more than 70%
        Thesis.checkCommitteeApprovalCount(req.body.thesisId)
          .then(function(memberCount) {
            console.log('memberCount', memberCount);
            var memCount = memberCount[0].member_approval;
            if (memCount > 4) {                          // 5 members approval needed for committee approval
              Thesis.committeeApprovedComplete(req.body.thesisId)
            }
            console.log('committee approved:', committee_approval);
            res.redirect('/admin/thesis/committee-approval')
          })
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeReject(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
        console.log('committee approved:', committee_approval);
        // Insert function that will check if committee count for approval is reached
        res.redirect('/admin/thesis/committee-approval')
      });
  } else {
    res.redirect('/')
  }
});

// Thesis proposal routes end

module.exports = router;
