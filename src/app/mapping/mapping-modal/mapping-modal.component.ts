import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapping-modal',
  templateUrl: './mapping-modal.component.html',
  styleUrls: ['./mapping-modal.component.scss']
})
export class MappingModalComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {

  }

}

@NgModule({
  declarations: [MappingModalComponent],
  exports: [MappingModalComponent],
  imports: []
})
export class MappingModalModule {}
