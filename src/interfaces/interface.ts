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

export interface Expert {
  message?: string;
  id?: string;              
  name?: string;
  email?: string;
  mobile?: number;
  expertImage?: string;
  service?: string;
  password?: string;
  accountStatus?: string;   
  isVerified?: string;      
  verificationDetails?: {
    govIdType?: string;
    govIdNumber?: string;
    document?: string;
  };
  status?: string;
  earnings?: Earning[];
  totalEarning?: number;
  createdAt?: Date;        
  updatedAt?: Date;
}

interface Earning {
  jobId: string;
  earning: number;
  type: string;
}