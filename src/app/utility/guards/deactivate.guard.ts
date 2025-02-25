import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}
  
  export const deactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
      // If component implements canDeactivate method, use that
      if (component && component.canDeactivate) {
          const result = component.canDeactivate();
          if (result instanceof Promise) {
              return result;
          }
          return result;
      }
      // No unsaved changes by default
      return true;
  };
