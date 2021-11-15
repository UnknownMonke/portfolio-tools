import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/services/app-title.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title: string = ""; 

  constructor(
    private appTitleService: AppTitleService,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) {}

  ngOnInit(): void {
    this.observeNavigation();
  }

  //subscribe à la navigation pour mettre à jour le titre du header
  observeNavigation(): void {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(() => {
          console.log(this.activatedRoute);
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
      ).subscribe((data: any) => {
        console.log(data)
        if(data) {
          this.title = data.title;
        }
      }
    );
  }
}
