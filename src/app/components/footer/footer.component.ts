import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Footer tag containing current app version.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentVersion = environment.VERSION; //TODO dynamic version

  constructor() {}

  ngOnInit(): void {}
}
