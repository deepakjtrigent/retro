import { Injectable } from '@angular/core';
import { ToastService, toastState } from './toast.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private readonly socketUrl: string = 'ws://localhost:8000/room';
  public connected: boolean = false;

  constructor(private toast: ToastService, private http: HttpClient) {}

  public connect(roomId: string): void {
    this.socket = new WebSocket(`${this.socketUrl}/${roomId}`);
    this.socket.onopen = (event: Event): void => {
      this.connected = true;
    };

    this.socket.onmessage = (event: MessageEvent<string>): void => {
      const message: string = event.data;
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
