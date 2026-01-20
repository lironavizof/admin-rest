const express = require('express');
const router = express.Router();


// GET /api/about
// Returns a JSON array of the team members (first_name + last_name only).
router.get('/about', (req, res) => {
    try {

        const team = [
            { first_name: 'Liron', last_name: 'Avizof' },
            { first_name: 'Maayan', last_name: 'Halifa' },
        ];

        return res.status(200).json(team);
    } catch (err) {
        res.locals.error = { id: 500, message:  err.message };
        return res.status(500).json({ error: res.locals.error.message });
    }
});

module.exports = router;