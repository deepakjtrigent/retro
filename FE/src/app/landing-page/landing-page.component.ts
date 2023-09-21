import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastService, toastState } from '../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateRetroService } from '../shared/services/create-retro.service';
import { CookieService } from 'ngx-cookie-service';
import { StorageService } from '../shared/services/storage.service';
import { CreateRetroResponse } from '../shared/model/retroId';
import { UserFormComponent } from '../user-form/user-form.component';
import { v4 as uuidv4 } from 'uuid';
import { User, defaultUser } from '../shared/model/user';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  public user: User = defaultUser;
  public retro_id!: any;

  constructor(
    public userDialog: MatDialog,
    private toast: ToastService,
    private router: Router,
    private createRetroService: CreateRetroService,
    private cookieService: CookieService,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    const storedData = sessionStorage.getItem('retro_id');
    if (storedData) {
      this.retro_id = storedData;
    }
    this.retro_id;
  }

  public createRetro(value?: any): void {
    this.createRetroService.createRetro(value).subscribe(
      (response: CreateRetroResponse): void => {
        const retro_id: string = response.retro_id;
        this.retro_id = retro_id;
        this.router.navigate([`/retro/${retro_id}`]);
      },
      (error) => {
        this.toast.showToast('Something went Bad', toastState.danger);
      }
    );
  }

  public openUserDialog(): void {
    const checkUserInCookies = this.cookieService.get('userDetails');

    const prepopulatedData = {
      projectName: '',
      sprintNumber: '',
      displayName: '',
    };

    if (checkUserInCookies) {
      const decodedUserDetails = JSON.parse(atob(checkUserInCookies));
      console.log(decodedUserDetails);

      prepopulatedData.displayName = decodedUserDetails.displayName;
      console.log(prepopulatedData.displayName);
    }

    const userDialogRef: MatDialogRef<UserFormComponent> = this.userDialog.open(
      UserFormComponent,
      {
        width: '400px',
        data: prepopulatedData,
      }
    );

    userDialogRef
      .afterClosed()
      .subscribe((result: { displayName: string }): void => {
        if (result) {
          this.user.userId = uuidv4();
          this.user.displayName = result.displayName;
          this.storageService.storeUserInCookies(this.user);
          this.storageService.userDetails = this.user;
          this.createRetro(result);
        }
      });
  }
}