import JobSeekerService from '../Services/JobSeekerService.js';

const JobSeekerController = {
    // GET /is-axtaranlar
    list: async (req, res, next) => {
        try {
            const viewModel = await JobSeekerService.getListViewModel(req.query);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    // GET /is-axtaranlar/:id/details
    details: async (req, res, next) => {
        try {
            const locale = res.locals.locale || req.locale || 'az';
            const viewer = req.user ? {
                userId: req.user.id,
                userName: `${req.user.name} ${req.user.surname || ''}`.trim(),
                companyName: req.user.companyName || ''
            } : null;

            const viewModel = await JobSeekerService.getDetailsViewModel(req.params.id, locale, viewer);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    // GET /is-axtaranlar/elave-et
    addPage: (req, res) => {
        res.render('Main', {
            title: 'Elan Əlavə Et',
            body: 'JobSeeker/Add.ejs',
            js: 'AddJobSeeker.js',
            currentPage: 'add-job-seeker'
        });
    },

    // POST /is-axtaranlar/elave-et
    addPost: async (req, res, next) => {
        try {
            const userId = req.user ? req.user.id : null;
            await JobSeekerService.createJobSeeker(req.body, userId, req.file);
            res.redirect('/is-axtaranlar?success=true');
        } catch (error) {
            next(error);
        }
    },

    // POST /is-axtaranlar/:id/delete
    deletePost: async (req, res, next) => {
        try {
            await JobSeekerService.deleteJobSeeker(req.params.id, req.user.id);
            res.redirect('/profil/ilanlarim');
        } catch (error) {
            next(error);
        }
    }
};

export default JobSeekerController;
