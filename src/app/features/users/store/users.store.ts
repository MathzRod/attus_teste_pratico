import { computed, Injectable, signal } from '@angular/core';

import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersStore {
  private readonly usersSignal = signal<User[]>([]);
  private readonly searchTermSignal = signal('');

  readonly users = this.usersSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();

  readonly filteredUsers = computed(() => {
    const searchTerm = this.searchTermSignal().toLowerCase().trim();

    if (!searchTerm) {
      return this.usersSignal();
    }

    return this.usersSignal().filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
  });

  setUsers(users: User[]): void {
    this.usersSignal.set(users);
  }

  setSearchTerm(searchTerm: string): void {
    this.searchTermSignal.set(searchTerm);
  }

  addUser(user: User): void {
    this.usersSignal.update((users) => [...users, user]);
  }

  updateUser(updatedUser: User): void {
    this.usersSignal.update((users) =>
      users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  }

  clear(): void {
    this.usersSignal.set([]);
    this.searchTermSignal.set('');
  }
}