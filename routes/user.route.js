const express = require('express');
const router = express.Router();
const User = require('../models/user.model');


// GET all users
router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.post('/', async (req, res) => {
    const users = req.body;

    try {
        const createdUsers = [];
        for (const user of users) {
            const { Name, Email, PhoneNo } = user;

            /* const existingUser = await User.findOne({ Email });
            if (existingUser) {
                return res.status(400).json({ message: `User with email ${Email} already exists` });
            } */

            const newUser = new User({ Name, Email, PhoneNo });
            await newUser.save();
            createdUsers.push(newUser);
        }

        return res.status(201).json({ message: 'Users created successfully', users: createdUsers });
    } catch (error) {
        console.error('Error creating users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



// Example search single search
router.get('/search/email', async (req, res) => {
    const { email } = req.query;
    console.log(`Searching for email: ${email}`);

    try {

        const user = await User.find({ Email: email });
        console.log(user);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//compound index
router.post('/search/name', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Both Name and Email are required.' });
    }

    try {

        const users = await User.find({
            Name: { $regex: new RegExp(name, 'i') },
            Email: { $regex: new RegExp(email, 'i') }
        });


        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create multikey index

// Example search
router.get('/search/multikey', async (req, res) => {
    const { name } = req.query;
    try {
        const users = await User.find({ Name: name });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create geospatial index

// Example search
router.get('/search/location', async (req, res) => {
    const { lng, lat } = req.query;

    if (!lng || !lat || isNaN(lng) || isNaN(lat)) {
        return res.status(400).json({ message: 'Invalid or missing longitude/latitude values.' });
    }

    try {
        const users = await User.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[parseFloat(lng), parseFloat(lat)], 1]
                }
            }
        });
        res.json(users);
    } catch (err) {
        console.error('Error fetching users by location:', err);
        res.status(500).json({ message: err.message });
    }
});


// Create text index

// Example search
router.get('/search/text', async (req, res) => {
    const { text } = req.query;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: 'Invalid search query' });
    }

    try {

        const users = await User.find({ $text: { $search: text } }).sort({ score: { $meta: "textScore" } });

        /* const users = await User.find({
            
            $or: [
                { Name: { $regex: text, $options: 'i' } },
                { description: { $regex: text, $options: 'i' } },
                { Email: text },
                { PhoneNo: text }
            ]
        }); */

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Create hashed index

// Example search
router.get('/search/hashed', async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await User.find({ userId });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Performance test route
router.get('/test-performance', async (req, res) => {
    const { indexType, value } = req.query;
    const start = Date.now();

    let users;
    try {
        switch (indexType) {
            case "email":
                users = await User.find({ Email: value });
                break;
            case "name":
                users = await User.find({ Name: value });
                break;
            default:
                return res.status(400).json({ message: 'Invalid index type' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    const end = Date.now();
    console.log(`Execution time for ${indexType}: ${end - start} ms`);

    res.json({ message: `Performance test completed for ${indexType}`, users });
});

// Vertical Scaling 

router.get('/test', async (req, res) => {
    const start = Date.now();
    
    try {
        const results = await User.aggregate([
            { $group: { _id: "$Name", userCount: { $sum: 1 } } },
            { $project: { Name: "$_id", userCount: 1, _id: 0 } }
        ]);
        
        const end = Date.now();
        res.json({
            message: 'Query executed successfully',
            executionTime: `${end - start} ms`,
            data: results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Vertical Scaling 

router.get('/test', async (req, res) => {
    const start = Date.now();
    
    try {
        const results = await User.aggregate([
            { $group: { _id: "$Name", userCount: { $sum: 1 } } },
            { $project: { Name: "$_id", userCount: 1, _id: 0 } }
        ]);
        
        const end = Date.now();
        res.json({
            message: 'Query executed successfully',
            executionTime: `${end - start} ms`,
            data: results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;


/* Index Type
  -single field index
  - compound index
  - multikey index
  - Geospatial index
  - text index
  - hashed index
  - clistered index
  - Profile index configurations
  - Use Atlas Search
   
*/





