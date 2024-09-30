export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserData {
  user: string;
  userId: string;
  image: string;
  loggedIn: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  mobile: string;
  image: File | null;
  password: string;
  confirmPassword: string;
  service: string;
}

export type Service = {
  _id: string;
  name: string;
  price: number;
  serviceImage: string;
  description: string;
};