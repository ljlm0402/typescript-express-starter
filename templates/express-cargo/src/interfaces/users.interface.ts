/**
 * @deprecated Use User entity class from @entities/user.entity instead
 * This interface is kept for backward compatibility only
 */
export interface User {
  id?: string | number; // uuid or number-string
  email: string;
  password: string;
}
