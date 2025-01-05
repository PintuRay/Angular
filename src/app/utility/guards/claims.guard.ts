import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../api/service/account/authentication/authentication.service';
import { inject } from '@angular/core';

export const claimsGuard: CanActivateFn = (route, state) => {
  const claims = route.data['claims'] as string[];
  const authSvcs = inject(AuthenticationService);
  const userclaims = authSvcs.getUserDetails().permissions;
  const router = inject(Router);
  if (!authSvcs.isUserLogedIn()) {
    router.navigate(['']);
    return false;
  }
 else {
  const hasClaims = claims.every(claim => {
    // Check if the claim corresponds to a permission and if it's true
    return userclaims[claim as keyof typeof userclaims] === true;
  });

  return hasClaims;
  }
  return false;
};