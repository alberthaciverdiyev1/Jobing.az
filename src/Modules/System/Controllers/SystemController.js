import SystemService from '../Services/SystemService.js';
import PricingPlanRepository from '../../Vacancy/Repositories/PricingPlanRepository.js';

const SystemController = {
    index: async (req, res, next) => {
        try {
            const locale = res.locals.locale || req.locale || 'az';
            const viewModel = await SystemService.getHomeViewModel(locale);
            res.render('Main', viewModel);
        } catch (error) {
            next(error);
        }
    },

    about: (req, res) => {
        res.render('Main', {
            title: 'Haqqımızda',
            description: 'Jobing.az haqqında',
            body: "AboutUs/Index.ejs",
            js: null,
            currentPage: 'about'
        });
    },

    contact: (req, res) => {
        res.render('Main', {
            title: 'Əlaqə',
            description: 'Bizimlə əlaqə saxlayın',
            body: "ContactUs/Index.ejs",
            js: null,
            currentPage: 'contact'
        });
    },

    faq: (req, res) => {
        res.render('Main', {
            title: 'Tez-Tez Verilən Suallar',
            description: 'FAQ',
            body: "AboutUs/Faq.ejs",
            js: null,
            currentPage: 'faq'
        });
    },

    pricing: async (req, res, next) => {
        try {
            const plans = await PricingPlanRepository.findAll({ where: { isActive: true }, order: [['price', 'ASC']] });
            res.render('Main', {
                title: 'Qiymətlər',
                description: 'Xidmət qiymətlərimiz',
                body: "Pricing/Index.ejs",
                js: null,
                currentPage: 'pricing',
                plans,
                hasDaily: true,
                hasMonthly: true,
                // The view groups plans by type (promote/premium) and duration (daily/monthly)
                promoteDaily: plans.filter(p => p.type === 'promote' && p.duration === 'daily'),
                premiumDaily: plans.filter(p => p.type === 'premium' && p.duration === 'daily'),
                promoteMonthly: plans.filter(p => p.type === 'promote' && p.duration === 'monthly'),
                premiumMonthly: plans.filter(p => p.type === 'premium' && p.duration === 'monthly')
            });
        } catch (error) {
            next(error);
        }
    },

    sitemap: (req, res) => {
        res.header('Content-Type', 'application/xml');
        res.send(SystemService.getSitemapXml());
    },

    robots: (req, res) => {
        res.type('text/plain');
        res.send(`User-agent: *\nAllow: /\nSitemap: https://jobing.az/sitemap.xml`);
    }
};

export default SystemController;
