import { Component } from '@angular/core';
import { ToastService } from '../shared/services/toast.service';
import { Router } from '@angular/router';
import { CreateRoomService } from '../shared/services/create-room.service';
import { CreateRoomResponse } from '../shared/model/roomId';
import { toastState } from '../shared/services/toast.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { v4 as uuidv4 } from 'uuid';
import { User, defaultsUser } from '../shared/model/user';
import { StorageService } from '../shared/services/storage.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  public user: User = defaultsUser

  constructor(
    private toast: ToastService,
    private router: Router,
    private createRoomService: CreateRoomService,
    private cookieService: CookieService,
    public userDialog: MatDialog,
    private storageService: StorageService
  ) {}

  public createRoom(): void {
    this.createRoomService.createRoom().subscribe(
      (response: CreateRoomResponse): void => {
        const roomId: string = response.room_id;
        this.router.navigate([`/room/${roomId}`]);
      },
      (error) => {
        this.toast.showToast('Something went Bad', toastState.danger);
      }
    );
  }

  public openUserDialog(): void {
    const checkUserInCookies = this.cookieService.get('userDetails');
    if (!checkUserInCookies) {
      const userDialogRef: MatDialogRef<UserFormComponent> =
        this.userDialog.open(UserFormComponent, {
          width: '400px',
        });

      userDialogRef.afterClosed().subscribe((userDisplayName: string): void => {
        if (userDisplayName) {
          this.user.userId = uuidv4();
          this.user.displayName = userDisplayName;
          this.storageService.storeUserInCookies(this.user);
          this.storageService.userDetails = this.user;
          this.createRoom();
        }
      });
    } else this.createRoom();
  }
}
