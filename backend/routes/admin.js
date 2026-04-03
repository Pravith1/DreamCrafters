const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  getAllContent,
  deleteContent,
  getAllWebinars,
  deleteWebinar,
  getAllMentorSessions,
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect, restrictTo('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);

// Content management
router.get('/content', getAllContent);
router.delete('/content/:id', deleteContent);

// Webinar management
router.get('/webinars', getAllWebinars);
router.delete('/webinars/:id', deleteWebinar);

// Mentorship management
router.get('/mentorships', getAllMentorSessions);

module.exports = router;
