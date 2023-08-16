import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastService, toastState } from '../shared/services/toast.service';
import { Router } from '@angular/router';
import { CreateRetroService } from '../shared/services/create-retro.service';
import { CookieService } from 'ngx-cookie-service';
import { StorageService } from '../shared/services/storage.service';
import { CreateRetroResponse } from '../shared/model/retroId';
import { User, defaultsUser } from '../shared/model/user';
import { UserFormComponent } from '../user-form/user-form.component';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  public user: User = defaultsUser;
  constructor(
    public userDialog: MatDialog,
    private toast: ToastService,
    private router: Router,
    private createRetroService: CreateRetroService,
    private cookieService: CookieService,
    private storageService: StorageService
  ) {}

  public createRetro(): void {
    this.createRetroService.createRetro().subscribe(
      (response: CreateRetroResponse): void => {
        const retro_id: string = response.retro_id;
        this.router.navigate([`/retro/${retro_id}`]);
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

      userDialogRef
        .afterClosed()
        .subscribe(
          (result: {
            projectName: string;
            sprintNumber: number | string;
          }): void => {
            if (result.projectName) {
              this.user.userId = uuidv4();
              this.user.projectName = result.projectName;
              this.user.sprintNumber = result.sprintNumber;
              this.storageService.storeUserInCookies(this.user);
              this.storageService.userDetails = this.user;
              this.createRetro();
            }
          }
        );
    } else this.createRetro();
  }
}

