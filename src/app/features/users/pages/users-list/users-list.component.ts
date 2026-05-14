import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, of, switchMap } from 'rxjs';

import {
  UserFormDialogComponent,
  UserFormDialogData,
  UserFormDialogResult,
} from '../../components/user-form-dialog/user-form-dialog.component';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../store/users.store';
import { CreateUserPayload, User, UpdateUserPayload } from '../../../../core/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly usersStore = inject(UsersStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly users = this.usersStore.filteredUsers;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
    this.listenSearch();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open<
      UserFormDialogComponent,
      UserFormDialogData,
      UserFormDialogResult | undefined
    >(UserFormDialogComponent, {
      width: '720px',
      maxWidth: 'calc(100vw - 48px)',
      panelClass: 'user-dialog-panel',
      data: {},
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result): result is CreateUserPayload => {
          return result !== undefined && !('id' in result);
        }),
        switchMap((payload) => this.usersService.createUser(payload)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((createdUser) => {
        this.usersStore.addUser(createdUser);
      });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open<
      UserFormDialogComponent,
      UserFormDialogData,
      UserFormDialogResult | undefined
    >(UserFormDialogComponent, {
      width: '720px',
      maxWidth: 'calc(100vw - 48px)',
      panelClass: 'user-dialog-panel',
      data: { user },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result): result is UpdateUserPayload => {
          return result !== undefined && 'id' in result;
        }),
        switchMap((payload) => this.usersService.updateUser(payload)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((updatedUser) => {
        this.usersStore.updateUser(updatedUser);
      });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usersService
      .getUsers()
      .pipe(
        catchError(() => {
          this.error.set('Nao foi possivel carregar os usuarios.');
          return of([]);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((users) => {
        this.usersStore.setUsers(users);
      });
  }

  private listenSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm) => {
        this.usersStore.setSearchTerm(searchTerm);
      });
  }
}
