import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return users', async () => {
    const users = await firstValueFrom(service.getUsers());

    expect(users.length).toBeGreaterThan(0);
    expect(users[0].name).toBeTruthy();
    expect(users[0].email).toBeTruthy();
  });

  it('should create a new user', async () => {
    const createdUser = await firstValueFrom(
      service.createUser({
        name: 'Novo Usuario',
        email: 'novo.usuario@attornatus.com.br',
        cpf: '111.222.333-44',
        phone: '(11) 97777-7777',
        phoneType: 'mobile',
      })
    );

    expect(createdUser.id).toBeDefined();
    expect(createdUser.name).toBe('Novo Usuario');
    expect(createdUser.email).toBe('novo.usuario@attornatus.com.br');
  });

  it('should update an existing user', async () => {
    const users = await firstValueFrom(service.getUsers());
    const userToUpdate = users[0];

    const updatedUser = await firstValueFrom(
      service.updateUser({
        ...userToUpdate,
        name: 'Usuario Atualizado',
      })
    );

    expect(updatedUser.id).toBe(userToUpdate.id);
    expect(updatedUser.name).toBe('Usuario Atualizado');
  });

  it('should return an error when getUsersWithError is called', async () => {
    try {
      await firstValueFrom(service.getUsersWithError());
      throw new Error('Expected an error, but got success');
    } catch (error) {
      expect(error).toBeTruthy();
      expect((error as Error).message).toBe('Erro ao carregar usuarios.');
    }
  });
});
