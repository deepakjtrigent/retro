import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateRetroService } from '../shared/services/create-retro.service';
import { StoreRetroInterface } from '../shared/model/retroId';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../shared/services/websocket.service';
import { ToastService, toastState } from '../shared/services/toast.service';
import { JoinRoomFormComponent } from './join-room-form/join-room-form.component';
import { JoinUser} from '../shared/model/user';
import { CookieService } from 'ngx-cookie-service';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  public joinUser: JoinUser = {
    userId: '',
    displayName: '',
    noteId: '',
    note: '',
    actionType: '',
  };

  public userDialog: any;
  public storeMsg: any = [];
  public clickMessage: string = '';
  public retro_id!: string;
  public start_doing_Input: boolean = false;
  public stop_doing_Input: boolean = false;
  public continue_doing_Input: boolean = false;
  public snap: string;
  public myRecords: any = [];
  public actionType: string = '';
  public startcount: number = 0;
  public stopcount: number = 0;
  public continuecount: number = 0;

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private storageService: StorageService,
    private createretroservice: CreateRetroService,
    private cookieService: CookieService,
    private websocketservice: WebsocketService,
    private apiservice: CreateRetroService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.snap = this.route.snapshot.params['retro_id'];
  }

  public ngOnInit(): void {
    this.websocketservice.recievedMessage.subscribe((message: string): void => {
      if (message) {
        // this.myRecords.unshift(JSON.parse(message).note);
      }
    });
    this.getRetroData();
    this.openJoinUserDialog();
  }

  
  startLabelArray:any[]=[];
  stopLabelArray:any[]=[];
  countinueLabelArray:any[]=[];
  
  public getRetroData(): void {
    this.apiservice.getRetro().subscribe((response: any) => {
      this.myRecords = response;
      
      if(this.startLabelArray){
        this.startLabelArray=this.myRecords.START_DOING;
        this.startcount = this.startLabelArray.length;
      }
      
      if(this.stopLabelArray){
        this.stopLabelArray=this.myRecords.STOP_DOING;
        this.stopcount = this.stopLabelArray.length;
      }
      if(this.countinueLabelArray){
        this.countinueLabelArray=this.myRecords.CONTINUE_DOING;
        this.continuecount = this.countinueLabelArray.length;
      }
    });
  }

  public joinRetroFunc(joinUser: JoinUser): void {
    this.createretroservice.joinRetro(this.snap, joinUser).subscribe(
      (response: any) => {
        this.toast.showToast('User Joined', toastState.success);
      },
      (error) => {
        this.toast.showToast('Joining error', toastState.danger);
      }
    );
  }

  public openJoinUserDialog(): void {
    const userDetailsInCookies: string = atob(
      this.cookieService.get('userDetails')
    );

    if (!userDetailsInCookies) {
      const userDialogRef: MatDialogRef<JoinRoomFormComponent> =
        this.dialog.open(JoinRoomFormComponent, {
          width: '400px',
        });
      userDialogRef.afterClosed().subscribe((userDisplayName: string): void => {
        if (userDisplayName) {
          this.joinUser.userId = uuidv4();
          this.joinUser.displayName = userDisplayName;
          this.storageService.storeUserInCookies(this.joinUser);
          this.joinRetroFunc(this.joinUser);
          this.websocketservice.connect(this.snap);
          this.router.navigate([`retro/${this.snap}`]);
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this.websocketservice.disconnect();
  }

  public formData: StoreRetroInterface = {
    data: '',
  };

  public addnote(): void {
    let userDetails = JSON.parse(atob(this.cookieService.get('userDetails')));
    this.storeMsg = [];
    this.joinUser = {
      noteId: '',
      note: this.clickMessage,
      userId: userDetails.userId,
      displayName: userDetails.displayName,
      actionType: this.actionType,
    };

    this.apiservice.storeRetro(this.snap, this.joinUser).subscribe(
      (response: StoreRetroInterface): void => {
        this.getRetroData();
      },
      (error) => {
        this.toast.showToast('Something went Bad', toastState.danger);
      }
    );
  }
}
