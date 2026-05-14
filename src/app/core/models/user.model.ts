export type PhoneType = 'mobile' | 'home' | 'work';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: PhoneType;
}

export type CreateUserPayload = Omit<User, 'id'>;

export type UpdateUserPayload = User;