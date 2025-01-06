import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../api/service/account/authentication/authentication.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authSvcs =inject(AuthenticationService);
  const router = inject(Router);
  if(authSvcs.isUserLogedIn()){
    return true;
  }
     // Redirect to the login page
     return router.parseUrl('/auth/login');
};