import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { UsersListComponent } from './users-list.component';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../store/users.store';

import {
  CreateUserPayload,
  User,
} from '../../../../core/models/user.model';

describe('UsersListComponent', () => {
  let fixture: ComponentFixture<UsersListComponent>;
  let component: UsersListComponent;
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

  const createdUser: User = {
    id: 3,
    name: 'Novo Usuário',
    email: 'novo@attornatus.com.br',
    cpf: '111.222.333-44',
    phone: '(11) 97777-7777',
    phoneType: 'mobile',
  };

  const updatedUser: User = {
    ...usersMock[0],
    name: 'Giana Atualizada',
  };

  const usersServiceMock = {
    getUsers: vi.fn(() => of(usersMock)),
    createUser: vi.fn(() => of(createdUser)),
    updateUser: vi.fn(() => of(updatedUser)),
  };

  const dialogMock = {
    open: vi.fn(),
  };

  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  beforeEach(async () => {
    usersServiceMock.getUsers.mockClear();
    usersServiceMock.createUser.mockClear();
    usersServiceMock.updateUser.mockClear();
    dialogMock.open.mockClear();

    TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: MatDialog,
          useValue: dialogMock,
        },
      ],
    });

    TestBed.overrideProvider(MatDialog, {
      useValue: dialogMock,
    });

    await TestBed.compileComponents();

    store = TestBed.inject(UsersStore);
    store.clear();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    fixture.detectChanges();

    expect(usersServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users()).toEqual(usersMock);
  });

  it('should filter users by search term with debounce', async () => {
    fixture.detectChanges();

    component.searchControl.setValue('giana');

    await wait(350);

    expect(component.users()).toEqual([usersMock[0]]);
  });

  it('should show all users when search term is cleared', async () => {
    fixture.detectChanges();

    component.searchControl.setValue('giana');
    await wait(350);

    component.searchControl.setValue('');
    await wait(350);

    expect(component.users()).toEqual(usersMock);
  });

  it('should open create dialog and add user when dialog returns data', () => {
    const createPayload: CreateUserPayload = {
      name: 'Novo Usuário',
      email: 'novo@attornatus.com.br',
      cpf: '111.222.333-44',
      phone: '(11) 97777-7777',
      phoneType: 'mobile',
    };

    dialogMock.open.mockReturnValue({
      afterClosed: () => of(createPayload),
    });

    fixture.detectChanges();

    component.openCreateDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(usersServiceMock.createUser).toHaveBeenCalledWith(createPayload);
    expect(component.users()).toContainEqual(createdUser);
  });

  it('should not create user when dialog is closed without result', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(undefined),
    });

    fixture.detectChanges();

    component.openCreateDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(usersServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('should open edit dialog and update user when dialog returns data', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(updatedUser),
    });

    fixture.detectChanges();

    component.openEditDialog(usersMock[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(usersServiceMock.updateUser).toHaveBeenCalledWith(updatedUser);
    expect(component.users()[0].name).toBe('Giana Atualizada');
  });

  it('should not update user when edit dialog is closed without result', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(undefined),
    });

    fixture.detectChanges();

    component.openEditDialog(usersMock[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(usersServiceMock.updateUser).not.toHaveBeenCalled();
  });
});
