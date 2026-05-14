import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, debounceTime, distinctUntilChanged, finalize, of } from 'rxjs';

import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../store/users.store';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly usersStore = inject(UsersStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly users = this.usersStore.filteredUsers;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
    this.listenSearch();
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
