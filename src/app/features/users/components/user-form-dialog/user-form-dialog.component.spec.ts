import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  UserFormDialogComponent,
  UserFormDialogData,
} from './user-form-dialog.component';
import { User } from '../../../../core/models/user.model';

describe('UserFormDialogComponent', () => {
  let component: UserFormDialogComponent;
  let fixture: ComponentFixture<UserFormDialogComponent>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  async function setup(data: UserFormDialogData = {}) {
    dialogRefMock.close.mockClear();

    await TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create the component', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should start with invalid form when creating user', async () => {
    await setup();

    expect(component.form.invalid).toBe(true);
    expect(component.isEditing).toBe(false);
    expect(component.title).toBe('Adicionar novo usuario');
  });

  it('should validate form when valid data is provided', async () => {
    await setup();

    component.form.setValue({
      email: 'teste@attornatus.com.br',
      name: 'Usuario Teste',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      phoneType: 'mobile',
    });

    expect(component.form.valid).toBe(true);
  });

  it('should close dialog with form data when creating user', async () => {
    await setup();

    const formData = {
      email: 'novo@attornatus.com.br',
      name: 'Novo Usuario',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      phoneType: 'mobile' as const,
    };

    component.form.setValue(formData);
    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith(formData);
  });

  it('should fill form automatically when editing user', async () => {
    const user: User = {
      id: 1,
      email: 'giana@attornatus.com.br',
      name: 'Giana Sandrini',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      phoneType: 'mobile',
    };

    await setup({ user });

    expect(component.isEditing).toBe(true);
    expect(component.title).toBe('Editar usuario');
    expect(component.form.getRawValue()).toEqual({
      email: user.email,
      name: user.name,
      cpf: user.cpf,
      phone: user.phone,
      phoneType: user.phoneType,
    });
  });

  it('should close dialog with updated user when editing', async () => {
    const user: User = {
      id: 1,
      email: 'giana@attornatus.com.br',
      name: 'Giana Sandrini',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      phoneType: 'mobile',
    };

    await setup({ user });

    component.form.patchValue({
      name: 'Giana Atualizada',
    });

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      ...user,
      name: 'Giana Atualizada',
    });
  });

  it('should mark all fields as touched when form is invalid on submit', async () => {
    await setup();

    component.onSubmit();

    expect(component.form.touched).toBe(true);
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
