/**
 * Reflects the DTO sent by the server upon login.
 * Does not correspond to the MongoDB document as the password is not returned.
 */
export interface User {
  id: string;
  username: string,
  email: string,
  settings: {
    theme: string
  }
}

/**
 * Contains the User and its token.
 */
export interface UserInfos {
  user: User,
  token: string
}
