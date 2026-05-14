import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

import {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Giana Sandrini',
      email: 'giana@attornatus.com.br',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      phoneType: 'mobile',
    },
    {
      id: 2,
      name: 'Carlos Almeida',
      email: 'carlos.almeida@email.com.br',
      cpf: '987.654.321-00',
      phone: '(11) 98888-8888',
      phoneType: 'work',
    },
    {
      id: 3,
      name: 'Marina Souza',
      email: 'marina.souza@email.com.br',
      cpf: '456.789.123-00',
      phone: '(11) 3777-8888',
      phoneType: 'home',
    },
  ];

  getUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(800));
  }

  createUser(payload: CreateUserPayload): Observable<User> {
    const newUser: User = {
      id: Date.now(),
      ...payload,
    };

    this.users = [...this.users, newUser];

    return of(newUser).pipe(delay(400));
  }

  updateUser(payload: UpdateUserPayload): Observable<User> {
    this.users = this.users.map((user) =>
      user.id === payload.id ? payload : user
    );

    return of(payload).pipe(delay(400));
  }

  getUsersWithError(): Observable<never> {
    return throwError(() => new Error('Erro ao carregar usuários.'));
  }
}