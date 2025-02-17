import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { environment } from 'src/app/utility/environment/environment';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { Subject, takeUntil } from 'rxjs';
import { GenericMessageService } from 'src/app/api/service/generic-message.Service';
@Component({
  selector: 'app-resend-confirm-mail',
  templateUrl: './resend-confirm-mail.component.html',
})
export class ResendConfirmMailComponent {
  
  //#region Property Declaration
  private readonly destroy$ = new Subject<void>();
  isLoading = false;
  RouteUrl: string = environment.EmailConfirmation;
  message: string = '';
  mail: string = '';
  //#endregion

  //#region Constructor
  constructor(
    private authSvcs: AuthenticationService,
    private messageService: GenericMessageService,
    public layoutSvcs: LayoutService,
  ) { }
  //#endregion

  //#region Lifecycle Hooks
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Server Side Operations
  public submit() {
    this.isLoading = true;
    this.authSvcs.resendConfirmEmail(this.mail, this.RouteUrl).pipe(takeUntil(this.destroy$)).subscribe({
      next: async (response) => {
        if (response.responseCode === 200)
          this.messageService.success(response.message);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }
  //#endregion
}
