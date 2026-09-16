import { UserRepository } from './UserRepository.js';

/** The shared instance. Import this rather than constructing the repository. */
export const userRepository = new UserRepository();
