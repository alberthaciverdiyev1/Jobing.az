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
import visitorLogger from "../Middlewares/Visitors.js";
const router = express.Router();

router.post('/api/users', validator.registerValidator, userController.createUser);         // CREATE
router.get('/api/users', userController.getUsers);                                         // READ ALL
router.get('/api/users/:id', userController.getUserById);                                  // READ ONE
router.put('/api/users/:id', userController.updateUser);                                   // UPDATE
router.delete('/api/users/:id', userController.deleteUser);                                // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/api/jobs', jobDataController.create);                                        // CREATE
router.get('/api/jobs', jobDataController.getAll);                                         // READ ALL
router.get('/api/jobs/:id', jobDataController.getSiteById);                                // READ ONE
router.put('/api/jobs/:id', jobDataController.updateSite);                                 // UPDATE
router.delete('/api/jobs/:id', jobDataController.deleteSite);                              // DELETE
router.post('/api/jobs/remove-duplicates', jobDataController.removeDuplicates);            // DELETE

// CRUD operations for job sites (JobDataController)
router.post('/api/site', validator.siteValidator, siteController.create);                  // CREATE
router.get('/api/site', siteController.getAll);                                            // READ ALL
router.get('/api/site/:id', siteController.findById);                                      // READ ONE
router.put('/api/site/:id', validator.siteValidator, siteController.update);               // UPDATE
router.delete('/api/site/:id', siteController.delete);                                     // DELETE

// CRUD operations for companies
router.post('/api/companies', companyController.create);                                    // CREATE
router.get('/api/companies', companyController.getAll);                                    // READ ALL
router.get('/api/companies/:id', companyController.findById);                              // READ ONE
router.put('/api/companies/:id', validator.companyValidator, companyController.update);    // UPDATE
router.delete('/api/companies/:id', companyController.delete);                             // DELETE
router.post('/api/companies/remove-duplicates', companyController.removeDuplicates);          // DELETE

// CRUD operations for categories
router.post('/api/foreign-categories', categoryController.addForeignCategories);           // CREATE
router.get('/api/foreign-categories', categoryController.getForeignCategories);            // READ ALL
router.get('/api/categories', categoryController.getLocalCategories);                      // READ ALL
// router.get('/categories/:id', categoryController.findById);                             // READ ONE
// router.put('/categories/:id',validator.companyValidator, categoryController.update);    // UPDATE
// router.delete('/categories/:id', categoryController.delete);                            // DELETE


// CRUD operations for Cities
router.post('/api/cities', cityController.create);                                           // CREATE
router.get('/api/cities', cityController.getAll);                                           // READ ALL


// CRUD operations for scrape
router.get('/api/scrape', scrapeController.getData);                                    // READ ALL


//Load Views
router.get('/', viewController.home);
router.get('/auth', viewController.auth);
router.get('/jobs',visitorLogger, viewController.jobs);
router.get('/about-us',visitorLogger, viewController.aboutUs);
router.get('/contact',visitorLogger, viewController.contactUs);
router.get('/statistics',viewController.statistics)
//Enums
router.get('/education', viewController.education);
router.get('/experience', viewController.experience);

//Change language
router.post('/set-lang', (req, res) => {
    const { language } = req.body;
    if (i18n.getLocales().includes(language)) {
        res.cookie('lang', language);  // Set language in cookie
        res.send({ message: 'Language updated successfully' });
    } else {
        res.status(400).send({ error: 'Invalid language' });
    }
});

//Admin Panel 

router.get('/admin', viewController.adminIndex);
router.get('/admin/categories', viewController.adminCategoryView);

//Send Mail
router.post('/send-mail', validator.mailValidator, viewController.sendMail);         // CREATE


router.use((req, res) => {
    res.render('Partials/Error.ejs');
    // res.status(404).render('error', { message: 'Page Not Found' });
});

router.use((err, req, res, next) => {
    res.render('Partials/Error.ejs');
});

export default router;
