import { Injectable } from '@angular/core';
import { ToastService, toastState } from './toast.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private readonly socketUrl: string = 'ws://localhost:8000/retro';
  public connected: boolean = false;
  public recievedMessage: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private toast: ToastService) {}

  public connect(retro_id: string): void {
    this.socket = new WebSocket(`${this.socketUrl}/${retro_id}`);
    console.log('Websocket connection established!');

    this.socket.onopen = (event: Event): void => {
      this.connected = true;
    };

    this.socket.onmessage = (event: MessageEvent<any>): void => {
      const message: any = event.data;
      this.recievedMessage.next(message);      
      this.toast.showToast(message, toastState.success);
    };

    this.socket.onclose = (event: Event): void => {
      console.log('WebSocket connection closed:', event);
      this.connected = false;
    };

    this.socket.onerror = (): void => {
      this.toast.showToast('Something went Bad', toastState.danger);
      this.connected = false;
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.connected = false;
    }
  }
}
