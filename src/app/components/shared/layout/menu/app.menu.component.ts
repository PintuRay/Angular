import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Dashboard 1',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    }
                ]
            },
            {
                label: 'Devloper',
                icon: 'pi pi-th-large',
                items: [
                    {
                        label: 'Devloper',
                        
                        icon: 'fa-brands fa-connectdevelop',
                        items: [
                            {
                                label: 'Branch',
                                icon: 'fa-solid fa-code-branch',
                                routerLink: ['/branch/list-branch']
                            },
                            {
                              
                                label: 'Financial Year',
                                icon: 'fa-solid fa-calendar',
                                routerLink: ['/apps/blog/detail']
                            },
                            {
                               
                                label: 'Branch Financial Year',
                                icon: 'fa-solid fa-house-laptop',
                                routerLink: ['/apps/blog/edit']
                            }
                        ]
                    },
                ]
            },
          
        ];
    }
}
