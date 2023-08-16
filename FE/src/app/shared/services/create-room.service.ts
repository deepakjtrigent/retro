import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRoomResponse } from '../model/roomId';
import { scrumPokerUrls } from '../url';

@Injectable({
  providedIn: 'root',
})
export class CreateRoomService {
  constructor(private http: HttpClient) {}

  public createRoom() : Observable<CreateRoomResponse> {
    return this.http.post<any>(scrumPokerUrls.createRoomUrl, {});
  }
}
