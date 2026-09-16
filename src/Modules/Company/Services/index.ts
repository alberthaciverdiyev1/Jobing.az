import { companyRepository } from '../Repositories/index.js';
import { CompanyService } from './CompanyService.js';

/** The shared instance. Controllers import this, never the class directly. */
export const companyService: CompanyService = new CompanyService(companyRepository);

export { CompanyService };
