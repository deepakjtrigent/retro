import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRetroResponse, StoreRetroInterface } from '../model/retroId';
import { retrospectiveUrls } from '../urls';
import { JoinUser } from '../model/user';

@Injectable({
  providedIn: 'root',
})

export class CreateRetroService {
  constructor(private http: HttpClient) {}

    private httpOptions = {
    withCredentials: true, // Ensure cookies are sent
  };
  
  public getRetro(): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8000/getalldata`);
  }
  
  public createRetro(value:any): Observable<CreateRetroResponse> {
    return this.http.post<any>(retrospectiveUrls.createRetroUrl, value);
  }

  public joinRetro(retro_id: string, userDetails: JoinUser): Observable<CreateRetroResponse> {
    return this.http.post<CreateRetroResponse>(
      `${retrospectiveUrls.retroUrls}/${retro_id}/join`,
      userDetails
    );
  }

  public storeRetro(retro_id: string, data: JoinUser): Observable<StoreRetroInterface> {
    return this.http.post<StoreRetroInterface>(
      `${retrospectiveUrls.storeRetroUrls}/${retro_id}/store`,
      data
    );
  }


}
