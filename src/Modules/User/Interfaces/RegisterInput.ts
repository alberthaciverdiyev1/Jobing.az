/** What the service needs in order to create an account. */
export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}
