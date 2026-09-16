import { CompanyRepository } from './CompanyRepository.js';

/** The shared instance. Import this rather than constructing the repository. */
export const companyRepository = new CompanyRepository();
