import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../api/service/account/authentication/authentication.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data['roles'] as string[];
  const authSvcs = inject(AuthenticationService);
  const userRole = authSvcs.getUserDetails().role;
  const router = inject(Router);
  if (!authSvcs.isUserLogedIn()) {
    router.navigate(['']);
    return false;
  } else if (roles.some((role) => userRole?.includes(role))) {
    return true;
  } else {
    return false;
  }
};