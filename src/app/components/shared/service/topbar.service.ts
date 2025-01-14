import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopBarService {
  /*-------------------Change Password------------------*/
  private changePasswordDialogVisibilitySubject = new BehaviorSubject<boolean>(false);
  changePassworddialogVisibility$ = this.changePasswordDialogVisibilitySubject.asObservable();
  showChangePasswordDialog() {
    this.changePasswordDialogVisibilitySubject.next(true);
  }
  hideChangePasswordDialog() {
    this.changePasswordDialogVisibilitySubject.next(false);
  }
    /*-------------------2FA------------------*/
    private veriyTwoFactorDialogVisibilitySubject = new BehaviorSubject<boolean>(false);
    veriyTwoFactordialogVisibility$ = this.veriyTwoFactorDialogVisibilitySubject.asObservable();
    showVerifyTwFactorDialog() {
      this.veriyTwoFactorDialogVisibilitySubject.next(true);
    }
    hideVerifyTwFactorDialog() {
      this.veriyTwoFactorDialogVisibilitySubject.next(false);
    }
}   