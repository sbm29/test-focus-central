const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), userController.getUsers);
router.get('/invites', protect, authorize('admin'), userController.getPendingInvites);
router.post('/invite', protect, authorize('admin'), userController.inviteUser);
router.put('/invites/:id/resend', protect, authorize('admin'), userController.resendInvite);
router.get('/:id', protect, userController.getUserById);
router.put('/:id/role', protect, authorize('admin'), userController.updateUserRole);
router.put('/:id', protect, authorize('admin'), userController.updateUser);

module.exports = router;
