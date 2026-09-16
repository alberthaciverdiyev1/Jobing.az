import { userRepository } from '../Repositories/index.js';
import { UserService } from './UserService.js';

/** The shared instance. Controllers import this, never the class directly. */
export const userService: UserService = new UserService(userRepository);

export { UserService };
