import express from 'express';
import userController from '../Controllers/UserController.js';
import companyController from '../Controllers/CompanyController.js';
import jobDataController from '../Controllers/JobDataController.js';
import siteController from '../Controllers/siteController.js';

const router = express.Router();

// CRUD operations for users
router.post('/users', userController.createUser);        // CREATE
router.get('/users', userController.getUsers);           // READ ALL
router.get('/users/:id', userController.getUserById);    // READ ONE
router.put('/users/:id', userController.updateUser);     // UPDATE
router.delete('/users/:id', userController.deleteUser);  // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/jobs', jobDataController.createSite);        // CREATE
router.get('/jobs', jobDataController.getSites);           // READ ALL
router.get('/jobs/:id', jobDataController.getSiteById);    // READ ONE
router.put('/jobs/:id', jobDataController.updateSite);     // UPDATE
router.delete('/jobs/:id', jobDataController.deleteSite);  // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/jobs', siteController.create);        // CREATE
router.get('/jobs', siteController.getAll);           // READ ALL
router.get('/jobs/:id', siteController.findById);    // READ ONE
router.put('/jobs/:id', siteController.update);     // UPDATE
router.delete('/jobs/:id', siteController.delete);  // DELETE

// CRUD operations for companies
router.post('/companies', companyController.create);        // CREATE
router.get('/companies', companyController.getAll);         // READ ALL
router.get('/companies/:id', companyController.findById);   // READ ONE
router.put('/companies/:id', companyController.update);     // UPDATE
router.delete('/companies/:id', companyController.delete);  // DELETE

export default router;
