import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import {CreateUserPayload, PhoneType, User} from '../../../../core/models/user.model';

export interface UserFormDialogData {
  user?: User;
}

export type UserFormDialogResult = CreateUserPayload | User;

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormDialogComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);

  readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA);
  readonly isEditing = Boolean(this.data?.user);

  readonly form = this.formBuilder.group({
    email: [
      this.data?.user?.email ?? '',
      [Validators.required, Validators.email],
    ],
    name: [
      this.data?.user?.name ?? '',
      [Validators.required],
    ],
    cpf: [
      this.data?.user?.cpf ?? '',
      [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      ],
    ],
    phone: [
      this.data?.user?.phone ?? '',
      [
        Validators.required,
        Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/),
      ],
    ],
    phoneType: [
      (this.data?.user?.phoneType ?? 'mobile') as PhoneType,
      [Validators.required],
    ],
  });

  get title(): string {
    return this.isEditing ? 'Editar usuário' : 'Adicionar novo usuário';
  }

  get email() {
    return this.form.controls.email;
  }

  get name() {
    return this.form.controls.name;
  }

  get cpf() {
    return this.form.controls.cpf;
  }

  get phone() {
    return this.form.controls.phone;
  }

  get phoneType() {
    return this.form.controls.phoneType;
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();

    if (this.isEditing && this.data.user) {
      this.dialogRef.close({
        ...this.data.user,
        ...formData,
      });

      return;
    }

    this.dialogRef.close(formData);
  }
}