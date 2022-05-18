export class LoginProcess {
  async resolveLoginLock(user) {
    const lastLogin = user.latestLogin.getTime();
    const currentTime = new Date().getTime();

    if (user.isLock && currentTime >= lastLogin + 10000) {
      const result = { success: true, currentTime };
      return result;
    }
    return { success: false, currentTime };
  }
}

/*
 const lastLogin = user.latestLogin.getTime();
      const currentTime = new Date().getTime();

      if (user.isLock && currentTime >= lastLogin + 10000) {
        await this.userRepository.changeIsLock(user.no, user.isLock);
      }
*/
