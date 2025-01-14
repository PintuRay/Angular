import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogVisibilitySubject = new BehaviorSubject<boolean>(false);
  dialogVisibility$ = this.dialogVisibilitySubject.asObservable();
  showDialog() {
    this.dialogVisibilitySubject.next(true);
  }
  hideDialog() {
    this.dialogVisibilitySubject.next(false);
  }
}   