import express from 'express';
import userController from '../Controllers/UserController.js';
import companyController from '../Controllers/CompanyController.js';
import categoryController from '../Controllers/CategoryController.js';
import jobDataController from '../Controllers/JobDataController.js';
import siteController from '../Controllers/SiteController.js';
import scrapeController from '../Controllers/ScrapeController.js';
import viewController from "../Controllers/ViewController.js";
import cityController from '../Controllers/CityController.js';

import validator from '../Validators/Main.js'
const router = express.Router();

router.post('/api/users', validator.registerValidator, userController.createUser);         // CREATE
router.get('/api/users', userController.getUsers);                                         // READ ALL
router.get('/api/users/:id', userController.getUserById);                                  // READ ONE
router.put('/api/users/:id', userController.updateUser);                                   // UPDATE
router.delete('/api/users/:id', userController.deleteUser);                                // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/api/jobs', jobDataController.create);                                        // CREATE
router.get('/api/jobs', jobDataController.getAll);                                        // READ ALL
router.get('/api/jobs/:id', jobDataController.getSiteById);                                // READ ONE
router.put('/api/jobs/:id', jobDataController.updateSite);                                 // UPDATE
router.delete('/api/jobs/:id', jobDataController.deleteSite);                              // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/api/site', validator.siteValidator, siteController.create);                  // CREATE
router.get('/api/site', siteController.getAll);                                            // READ ALL
router.get('/api/site/:id', siteController.findById);                                      // READ ONE
router.put('/api/site/:id', validator.siteValidator, siteController.update);               // UPDATE
router.delete('/api/site/:id', siteController.delete);                                     // DELETE

// CRUD operations for companies
router.post('/api/companies',validator.companyValidator, companyController.create);        // CREATE
router.get('/api/companies', companyController.getAll);                                    // READ ALL
router.get('/api/companies/:id', companyController.findById);                              // READ ONE
router.put('/api/companies/:id',validator.companyValidator, companyController.update);     // UPDATE
router.delete('/api/companies/:id', companyController.delete);                             // DELETE

// CRUD operations for categories
router.post('/api/categories', categoryController.create);        // CREATE
router.get('/api/categories', categoryController.getAll);                                    // READ ALL
// router.get('/categories/:id', categoryController.findById);                              // READ ONE
// router.put('/categories/:id',validator.companyValidator, categoryController.update);     // UPDATE
// router.delete('/categories/:id', categoryController.delete);                             // DELETE


// CRUD operations for Cities
router.post('/api/cities', cityController.create);                                           // CREATE
router.get('/api/cities', cityController.getAll);                                           // READ ALL
// router.get('/categories/:id', categoryController.findById);                              // READ ONE
// router.put('/categories/:id',validator.companyValidator, categoryController.update);     // UPDATE
// router.delete('/categories/:id', categoryController.delete);                             // DELETE

// CRUD operations for scrape
router.get('/api/scrape', scrapeController.getData);                                    // READ ALL


//Load Views
router.get('/',viewController.home);
router.get('/auth',viewController.auth);
router.get('/jobs',viewController.jobs);
//Enums
router.get('/education',viewController.education);


export default router;
