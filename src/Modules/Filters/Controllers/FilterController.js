import FilterRepository from '../Repositories/FilterRepository.js';
import FilterOptionRepository from '../Repositories/FilterOptionRepository.js';
import FilterOption from '../Entities/FilterOption.js';

const filterController = {
    getAll: async (req, res, next) => {
        try {
            const filters = await FilterRepository.getFiltersWithOptions();
            res.json(filters);
        } catch (err) {
            next(err);
        }
    },

    getAllActive: async (req, res, next) => {
        try {
            const filters = await FilterRepository.findAll({
                where: { isActive: true },
                include: ['options'] // using association alias
            });
            res.json(filters);
        } catch (err) {
            next(err);
        }
    },

    // Admin: returns all filters with ALL options (active + inactive)
    getAllWithAllOptions: async (req, res, next) => {
        try {
            const filters = await FilterRepository.findAll({
                include: [{ model: FilterOption, as: 'options', required: false }],
                order: [
                    ['sortOrder', 'ASC'],
                    [{ model: FilterOption, as: 'options' }, 'sortOrder', 'ASC']
                ]
            });
            res.json(filters);
        } catch (err) {
            next(err);
        }
    },

    getById: async (req, res, next) => {
        try {
            const filter = await FilterRepository.findById(req.params.id, { include: ['options'] });
            if (!filter) return res.status(404).json({ message: 'Filter not found' });
            res.json(filter);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { key, name, sortOrder, isActive } = req.body;
            const filter = await FilterRepository.create({ key, name, sortOrder, isActive });
            res.status(201).json(filter);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const { key, name, sortOrder, isActive } = req.body;
            const filter = await FilterRepository.update(req.params.id, { key, name, sortOrder, isActive });
            if (!filter) return res.status(404).json({ message: 'Filter not found' });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            const success = await FilterRepository.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Filter not found' });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    // --- FilterOption Endpoints ---

    getOptionById: async (req, res, next) => {
        try {
            const option = await FilterOptionRepository.findById(req.params.id);
            if (!option) return res.status(404).json({ message: 'Option not found' });
            res.json(option);
        } catch (err) {
            next(err);
        }
    },

    addOption: async (req, res, next) => {
        try {
            const { value, name, sortOrder, isActive } = req.body;
            const filterId = req.params.filterId;
            const option = await FilterOptionRepository.create({ filterId, value, name, sortOrder, isActive });
            res.status(201).json(option);
        } catch (err) {
            next(err);
        }
    },

    updateOption: async (req, res, next) => {
        try {
            const { value, name, sortOrder, isActive } = req.body;
            const option = await FilterOptionRepository.update(req.params.id, { value, name, sortOrder, isActive });
            if (!option) return res.status(404).json({ message: 'Option not found' });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    deleteOption: async (req, res, next) => {
        try {
            const success = await FilterOptionRepository.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Option not found' });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
};

export default filterController;
