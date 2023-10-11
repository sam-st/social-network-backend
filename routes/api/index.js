const router = require('express').Router();
const userRoutes = require('./userRoutes'); // Import user routes
const thoughtRoutes = require('./thoughtRoutes'); // Import thought routes

router.use('/users', userRoutes); // Use user routes at /api/users
router.use('/thoughts', thoughtRoutes); // Use thought routes at /api/thoughts

router.use((req, res) => res.status(404).send('Wrong route!'));

module.exports = router;