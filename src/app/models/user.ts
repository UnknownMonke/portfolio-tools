/**
 * Reflects the DTO sent by the server upon login.
 * Does not correspond to the DAO as the password is not returned.
 *
 * An UserInfos contains the User and its token.
 */
export interface User {
  id: string;
  username: string,
  email: string,
  settings: {
    theme: string
  }
}

export interface UserInfos {
  user: User,
  token: string
}
