const express = require('express');
const router = express.Router();
const Student = require('../models/student.model'); // Ensure the correct path to your model


/** 
 * Get route for listing students
 */
router.get('/', (req, res) => {
    res.render('student/addOrEdit', {
        viewTitle: 'Insert Student'
    });
});


/** 
 * Route for creating a new student
 */
router.post('/', (req, res) => {
    if (req.body._id == "") {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
});

/**
 * Route for listing all students
 */
router.get('/list', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('student/list', { list: students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});


/** 
 * Get a student by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        res.render('student/addOrEdit', { student });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Delete a student by ID
 */
router.get('/delete/:id', (req, res) => {
    Student.findByIdAndRemove(req.params.id)
    .then(doc => {
        res.redirect('/student/list');
    })
    .catch(err => {
        console.log('Error during insert:', err);
        res.status(500).send('Internal Server Error');
    });
});



/** Repository Functions */
function insertRecord(req, res) {
    var student = new Student();
    student.fullName = req.body.fullName;
    student.email = req.body.email;
    student.mobile = req.body.mobile;
    student.city = req.body.city;

    student.save()
        .then(doc => {
            res.redirect('student/list');
        })
        .catch(err => {
            console.log('Error during insert:', err);
            res.status(500).send('Internal Server Error');
        });

}
function updateRecord(req, res) {
    Student.findByIdAndUpdate(
        { _id: req.body._id }, // Correct the spelling from req.bdy._id to req.body._id
        req.body,
        { new: true }
    )
    .then(doc => {
        res.redirect('student/list');
    })
    .catch(err => {
        console.log('Error during insert:', err);
        res.status(500).send('Internal Server Error');
    });
}

module.exports = router;
