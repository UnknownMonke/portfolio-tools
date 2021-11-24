import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title: string = "";
  items: MenuItem[] = [];


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.observeNavigation();

    // Menu de management
    this.items = [
      {
        label: 'Edit Geographies',
        routerLink: ['/edit/geography']
      },
      {
        label: 'Edit Sectors',
        routerLink: ['/edit/sector']
      }
    ]
  }

  // Subscribe à la navigation pour mettre à jour le titre du header
  observeNavigation(): void {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while(child) {
            if(child.firstChild) {
              child = child.firstChild;
            } else if(child.snapshot.data && child.snapshot.data['title']) {
              return child.snapshot.data['title'];
            } else {
              return null;
            }
          }
          return null;
        })
      ).subscribe((data: any) => { // Analog to jQuery ".on()"
        if(data) {
          this.title = data;
        }
      }
    );
  }
}
