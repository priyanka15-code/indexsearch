const express = require('express');

const User = require('../models/user.model')
const Materialized = require('../models/Materialized.model')
const router = express.Router();

async function refreshMaterialized() {
    try {
        //aggregate user count group
        const results = await User.aggregate([
            {
                $group: {
                    _id: "$Name", userCount: { $sum: 1 },
                }
            },
            {
                $project:
                {
                    Name: "$_id", userCount: 1, _id: 0
                }
            }
        ]);

        await Materialized.deleteMany({});
        await Materialized.insertMany(results);
        console.log('Materialized refreshed successfull')
    } catch (error) {
        console.log('Error Materialized refreshing', error)
    }
}
async function getTagStatistics() {
    const statistics = await Materialized.find({});
    console.log("Tag statistics:", statistics);
    return statistics;
}

// Endpoint to refresh materialized view
router.post('/refresh', async (req, res) => {
    try {
        await refreshMaterialized();
        const statistics = await getTagStatistics();
        res.json({
            message: 'Materialized view refreshed successfully',
            statistics: statistics
        });
    } catch (error) {
        res.status(500).json({ message: 'Error refreshing materialized view', error: error.message || 'Unknown error', });
    }
});
module.exports = router;