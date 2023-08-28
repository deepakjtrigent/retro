import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  public userForm: FormGroup = new FormGroup({
    projectName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    sprintNumber: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),

    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public prepopulatedData: any
  ) {
    this.userForm = new FormGroup({
      projectName: new FormControl(this.prepopulatedData.projectName, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      sprintNumber: new FormControl(this.prepopulatedData.sprintNumber, [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
      ]),
      displayName: new FormControl(this.prepopulatedData.displayName, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
    });
  }

  public getProjectNameErrorMessage(): string {
    if (
      this.userForm.get('projectName')?.hasError('required') ||
      this.userForm.get('projectName')?.hasError('minlength')
    ) {
      return 'Project name should have at least three characters.';
    }

    return this.userForm.get('projectName')?.hasError('maxlength')
      ? 'Project name should not be greater than 15 characters'
      : '';
  }

  public getSprintErrorMessage(): string {
    if (this.userForm.get('sprintNumber')?.hasError('required')) {
      return 'Sprint number is required.';
    }

    return this.userForm.get('sprintNumber')?.hasError('min')
      ? 'Sprint number should be at least 1'
      : this.userForm.get('sprintNumber')?.hasError('max')
      ? 'Sprint number should be at most 10'
      : '';
  }
  public getDisplayNameErrorMessage(): string {
    if (
      this.userForm.get('displayName')?.hasError('required') ||
      this.userForm.get('displayName')?.hasError('minlength')
    ) {
      return 'displayName should have at least three characters.';
    }

    return this.userForm.get('displayName')?.hasError('maxlength')
      ? 'displayNam should not be greater than 15 characters'
      : '';
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}