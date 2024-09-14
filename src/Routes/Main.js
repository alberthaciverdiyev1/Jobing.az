import express from 'express';
import userController from '../Controllers/UserController.js';
import companyController from '../Controllers/CompanyController.js';
import categoryController from '../Controllers/CategoryController.js';
import jobDataController from '../Controllers/JobDataController.js';
import siteController from '../Controllers/siteController.js';
import scrapeController from '../Controllers/scrapeController.js';

import validator from '../Validators/Main.js'
import category from "../Models/Category.js";
const router = express.Router();

router.post('/users', validator.registerValidator, userController.createUser);         // CREATE
router.get('/users', userController.getUsers);                                         // READ ALL
router.get('/users/:id', userController.getUserById);                                  // READ ONE
router.put('/users/:id', userController.updateUser);                                   // UPDATE
router.delete('/users/:id', userController.deleteUser);                                // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/jobs', jobDataController.create);                                    // CREATE
router.get('/jobs', jobDataController.getSites);                                       // READ ALL
router.get('/jobs/:id', jobDataController.getSiteById);                                // READ ONE
router.put('/jobs/:id', jobDataController.updateSite);                                 // UPDATE
router.delete('/jobs/:id', jobDataController.deleteSite);                              // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/site', validator.siteValidator, siteController.create);                  // CREATE
router.get('/site', siteController.getAll);                                            // READ ALL
router.get('/site/:id', siteController.findById);                                      // READ ONE
router.put('/site/:id', validator.siteValidator, siteController.update);               // UPDATE
router.delete('/site/:id', siteController.delete);                                     // DELETE

// CRUD operations for companies
router.post('/companies',validator.companyValidator, companyController.create);        // CREATE
router.get('/companies', companyController.getAll);                                    // READ ALL
router.get('/companies/:id', companyController.findById);                              // READ ONE
router.put('/companies/:id',validator.companyValidator, companyController.update);     // UPDATE
router.delete('/companies/:id', companyController.delete);                             // DELETE

// CRUD operations for categories
router.post('/categories', categoryController.create);        // CREATE
router.get('/categories', categoryController.getAll);                                    // READ ALL
// router.get('/categories/:id', categoryController.findById);                              // READ ONE
// router.put('/categories/:id',validator.companyValidator, categoryController.update);     // UPDATE
// router.delete('/categories/:id', categoryController.delete);                             // DELETE


// CRUD operations for scrape
router.get('/scrape', scrapeController.getData);                                    // READ ALL


export default router;
