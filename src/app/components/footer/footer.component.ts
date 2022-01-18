import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Tag footer contenant la version de l'application.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentVersion = environment.VERSION;

  constructor() {}

  ngOnInit(): void {}
}
