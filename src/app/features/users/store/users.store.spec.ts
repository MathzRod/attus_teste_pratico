import { TestBed } from '@angular/core/testing';

import { UsersStore } from './users.store';
import { User } from '../../../core/models/user.model';

describe('UsersStore', () => {
  let store: UsersStore;

  const usersMock: User[] = [
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
      email: 'carlos.almeida@attornatus.com.br',
      cpf: '987.654.321-00',
      phone: '(11) 98888-8888',
      phoneType: 'work',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(UsersStore);
    store.clear();
  });

  it('should create the store', () => {
    expect(store).toBeTruthy();
  });

  it('should set users', () => {
    store.setUsers(usersMock);

    expect(store.users()).toEqual(usersMock);
  });

  it('should filter users by search term', () => {
    store.setUsers(usersMock);
    store.setSearchTerm('giana');

    expect(store.filteredUsers()).toEqual([usersMock[0]]);
  });

  it('should return all users when search term is empty', () => {
    store.setUsers(usersMock);
    store.setSearchTerm('');

    expect(store.filteredUsers()).toEqual(usersMock);
  });

  it('should add a new user', () => {
    store.setUsers([usersMock[0]]);
    store.addUser(usersMock[1]);

    expect(store.users()).toEqual(usersMock);
  });

  it('should update an existing user', () => {
    store.setUsers(usersMock);

    const updatedUser: User = {
      ...usersMock[0],
      name: 'Giana Atualizada',
    };

    store.updateUser(updatedUser);

    expect(store.users()[0].name).toBe('Giana Atualizada');
  });

  it('should clear users and search term', () => {
    store.setUsers(usersMock);
    store.setSearchTerm('giana');

    store.clear();

    expect(store.users()).toEqual([]);
    expect(store.searchTerm()).toBe('');
  });
});