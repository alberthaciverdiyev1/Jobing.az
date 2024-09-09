import express from 'express';
import userController from '../Controllers/UserController.js';
import siteController from '../Controllers/siteController.js';

const router = express.Router();

// CRUD operations for users
router.post('/users', userController.createUser);        // CREATE
router.get('/users', userController.getUsers);           // READ ALL
router.get('/users/:id', userController.getUserById);    // READ ONE
router.put('/users/:id', userController.updateUser);     // UPDATE
router.delete('/users/:id', userController.deleteUser);  // DELETE

router.post('/sites', siteController.createSite);        // CREATE
router.get('/sites', siteController.getSites);           // READ ALL
router.get('/sites/:id', siteController.getSiteById);    // READ ONE
router.put('/sites/:id', siteController.updateSite);     // UPDATE
router.delete('/sites/:id', siteController.deleteSite);  // DELETE


export default router;
