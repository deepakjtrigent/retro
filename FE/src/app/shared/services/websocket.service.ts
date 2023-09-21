import { Injectable } from '@angular/core';
import { ToastService, toastState } from './toast.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private readonly socketUrl: string = 'ws://localhost:8000/retro';
  public connected: boolean = false;
  public recievedMessage: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private toast: ToastService, private http: HttpClient) {}

  public connect(retro_id: string, userId: string): void {
    this.socket = new WebSocket(`${this.socketUrl}/${retro_id}`);
    console.log('Websocket connection established!');

    this.socket.onopen = (event: Event): void => {
      this.connected = true;
      console.log(userId)
      this.socket.send(JSON.stringify({ userId: userId }));
    };

    this.socket.onmessage = (event: MessageEvent<any>): void => {
      this.recievedMessage.next(event.data);

      this.socket.onclose = (event: Event): void => {
        console.log('WebSocket connection closed:', event);
        this.connected = false;
      };

      this.socket.onerror = (): void => {
        this.toast.showToast('Something went Bad', toastState.danger);
        this.connected = false;
      };
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.connected = false;
    }
  }

  public startTimer(retroId: string): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/start_timer/${retroId}`, {});
  }

  public stopTimer(retroId: string): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/stop_timer/${retroId}`, {});
  }
}
