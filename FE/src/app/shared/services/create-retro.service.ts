import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRetroResponse } from '../model/retroId';
import { retrospectiveUrls } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class CreateRetroService {
  constructor(private http: HttpClient) {}

  public createRetro() : Observable<CreateRetroResponse> {
    return this.http.post<any>(retrospectiveUrls.createRetroUrl, {});
  }
}
