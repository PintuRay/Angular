import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';
import { AppSidebarComponent } from '../sidebar/app.sidebar.component';
import { TopBarService } from '../../service/topbar.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent implements OnInit{
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('searchinput') searchInput!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    valSwitch: boolean = false;
    constructor(
        public layoutService: LayoutService,
        private topBarService: TopBarService,
        private authSvcs:AuthenticationService,
        public el: ElementRef) { }
        ngOnInit(){
            this.valSwitch = this.authSvcs.isTwoFactorEnabled();
        }
    async onToggle2FA() {
        try {
           const uid = this.authSvcs.getUserDetails().id;
            this.authSvcs.sendTwoFactorToken(uid).subscribe({
                next: (response) => {
                    if(response.responseCode === 200){
                        this.topBarService.showVerifyTwFactorDialog();
                    }
                },
                error: (response) => {
                    console.log(response);

                },
                complete: () => {
             
                },
            });
            // Call your API here
            // If API call is successful, update localStorage
            //localStorage.setItem('2fa', this.valSwitch.toString());
            // You might want to show a success message
            // Add your success handling here
        } catch (error) {
            // If API call fails, revert the switch
            //this.valSwitch = !this.valSwitch;
            // Add your error handling here
        }
    }
    async logout(){
        try{

        }
        catch (error) {
          
        }
    }
    openChangePassword() {
        this.topBarService.showChangePasswordDialog();
      }
    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }  
    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }
  
}