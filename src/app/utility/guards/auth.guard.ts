import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../api/service/account/authentication/authentication.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authSvcs =inject(AuthenticationService);
  if(authSvcs.isUserLogedIn()){
    return true;
  }
  else{
    inject(Router).navigate(['']);
    return false;
  }
};