import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { catchError, debounceTime, distinctUntilChanged, finalize, of } from 'rxjs';

import { UserFormDialogComponent, UserFormDialogData } from '../../components/user-form-dialog/user-form-dialog.component';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../store/users.store';
import { User } from '../../../../core/models/user.model';

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
    this.dialog.open<UserFormDialogComponent, UserFormDialogData>(
      UserFormDialogComponent,
      {
        width: '720px',
        maxWidth: 'calc(100vw - 48px)',
        panelClass: 'user-dialog-panel',
        data: {},
      }
    );
  }

  openEditDialog(user: User): void {
    this.dialog.open<UserFormDialogComponent, UserFormDialogData>(
      UserFormDialogComponent,
      {
        width: '720px',
        maxWidth: 'calc(100vw - 48px)',
        panelClass: 'user-dialog-panel',
        data: { user },
      }
    );
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
