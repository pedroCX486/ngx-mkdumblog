import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HelperService {
  constructor(private httpClient: HttpClient) { }

  getConfigs(): Observable<any> {
    return this.httpClient.get('./assets/settings.json');
  }

  getJSON(arg: string): Observable<any> {
    return this.httpClient.get(arg);
  }
}
