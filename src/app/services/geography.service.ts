import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  uri: string = 'http://localhost:4000/api/geography';

  constructor(
    private httpClient: HttpClient
  ) {}

  addGeography(name: string): void {

    const body = {
      name: name
    };

    this.httpClient.post(`{{this.uri}}/add`, body)
      .subscribe(response => console.log(response));
  }
}
