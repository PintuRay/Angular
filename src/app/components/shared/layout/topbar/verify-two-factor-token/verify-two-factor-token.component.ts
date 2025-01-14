import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopBarService } from '../../../service/topbar.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';

@Component({
  selector: 'app-verify-two-factor-token',
  templateUrl: './verify-two-factor-token.component.html',
})
export class VerifyTwoFactorTokenComponent {
  visible: boolean = false;
  isLoading = false;
   private subscription!: Subscription;
     constructor(
       private topBarService: TopBarService,
       private authSvcs: AuthenticationService,
   
     ) { }
     ngOnInit() {
       this.subscription = this.topBarService.veriyTwoFactordialogVisibility$.subscribe(
         isVisible => {
           this.visible = isVisible;
         }
       );
     }
     ngOnDestroy() {
       if (this.subscription) {
         this.subscription.unsubscribe();
       }
     }
     hideDialog() {
       this.topBarService.hideVerifyTwFactorDialog();
     }
}
