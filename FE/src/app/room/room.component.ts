import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateRetroService } from '../shared/services/create-retro.service';
import { StoreRetroInterface } from '../shared/model/retroId';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../shared/services/websocket.service';
import { ToastService, toastState } from '../shared/services/toast.service';
import { JoinRoomFormComponent } from './join-room-form/join-room-form.component';
import { JoinUser } from '../shared/model/user';
import { CookieService } from 'ngx-cookie-service';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../shared/services/storage.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  @ViewChild('content', { static: false }) el!: ElementRef;
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
  public startLabelArray: any[] = [];
  public stopLabelArray: any[] = [];
  public countinueLabelArray: any[] = [];
  public startDoingMessage: string = '';
  public stopDoingMessage: string = '';
  public continueDoingMessage: string = '';
  public timerLeft: string = '00:00';
  public timerRunning: boolean = false;
  public timerActive: boolean = true;
  public projectName: string = '';
  public sprintNumber: string = '';

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
    this.websocketservice.recievedMessage.subscribe(
      (response: string): void => {
        if (response) {
          const message = JSON.parse(response);
          if (message.actionType == 'START_DOING') {
            this.startLabelArray.push(message);
          } else if (message.actionType == 'STOP_DOING') {
            this.stopLabelArray.push(message);
          } else if (message.actionType == 'CONTINUE_DOING') {
            this.countinueLabelArray.push(message);
          } else if (message.actionType == 'timer_left') {
            this.timerLeft = message.timeleft;
          }
          isFinite(message);
        }
      }
    );
    // this.getRetroData();
    this.openJoinUserDialog();
  }

  public makePdf() {
    let pdf = new jsPDF('p', 'pt', 'a1');
    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.save('Retro_Data.pdf');
      },
    });
  }

  public getRetroData(): void {
    this.apiservice.getRetro().subscribe((response: any) => {
      this.myRecords = response;

      if (this.myRecords.projectName && this.myRecords.sprintNumber) {
        this.projectName = this.myRecords.projectName;
        this.sprintNumber = this.myRecords.sprintNumber;
      }

      if (this.startLabelArray) {
        this.startLabelArray = this.myRecords.START_DOING;
        console.log(this.startLabelArray);

        this.startcount = this.startLabelArray.length;
        console.log(this.startcount);
      }

      if (this.stopLabelArray) {
        this.stopLabelArray = this.myRecords.STOP_DOING;
        this.stopcount = this.stopLabelArray.length;
      }
      if (this.countinueLabelArray) {
        this.countinueLabelArray = this.myRecords.CONTINUE_DOING;
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
          this.websocketservice.connect(this.snap, this.joinUser.userId);
          this.router.navigate([`retro/${this.snap}`]);
        }
      });
    } else {
      const userDetails = JSON.parse(userDetailsInCookies);
      this.joinRetroFunc(userDetails);
      this.websocketservice.connect(this.snap, userDetails.userId);
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
    let noteMessage: string = '';
    if (this.actionType === 'START_DOING') {
      noteMessage = this.startDoingMessage;
    } else if (this.actionType === 'STOP_DOING') {
      noteMessage = this.stopDoingMessage;
    } else if (this.actionType === 'CONTINUE_DOING') {
      noteMessage = this.continueDoingMessage;
    }

    this.joinUser = {
      noteId: '',
      note: noteMessage,
      userId: userDetails.userId,
      displayName: userDetails.displayName,
      actionType: this.actionType,
    };

    this.apiservice.storeRetro(this.snap, this.joinUser).subscribe(
      (response: StoreRetroInterface): void => {},
      (error) => {
        this.toast.showToast('Something went Bad', toastState.danger);
      }
    );
  }

  public toggleTimer(): void {
    if (this.timerActive) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }
  public startTimer(): void {
    this.websocketservice.startTimer(this.snap).subscribe(
      (response: any) => {
        this.timerActive = true;
        this.toast.showToast('Timer started', toastState.success);
      },
      (error: any) => {
        this.toast.showToast('Timer error', toastState.danger);
      }
    );
  }

  public stopTimer(): void {
    this.websocketservice.stopTimer(this.snap).subscribe(
      (response: any) => {
        this.timerActive = false;
        this.toast.showToast('Timer stopped', toastState.success);
      },
      (error: any) => {
        this.toast.showToast('Timer error', toastState.danger);
      }
    );
  }
}
