export interface Range {
    min: number;
    max: number;
    value: number;
    pin: boolean;
}

 

export interface Message {
    message: string;
    receiver: string;
    sender: string;
    timestamp: string;
    _id: string; 

}


export interface TempUser {
    username: string;
    password: string;
    phoneNumber?: string;
    verified: boolean;
    type?: string
}

export interface Location {
    name: string;
    lat: number;
    lng: number;
  }
  
  export interface Preferences {
    ethnicity: string[];
    age: {
      lower: number;
      upper: number;
    };
    want: string[];
    with: string[];
    distance: number;
  }
  
  export interface User {
    _id?: string;
    name: string;
    dob: string;
    age: number;
    gender: string;
    location?: Location;
    images?: string[];
    phoneNumber: string;
    username: string;
    password: string;
    ethnicity: string;
    bodyType: string;
    sexualOrientation: string;
    interests: string[];
    preferences: Preferences;
  }
  
  export interface Country {
    dialCode: string,
    flag: string,
    name: string
    code: string;
}

export interface Flags {
    flags: string,
    country: string;
    code: string;
}

export interface OTP {
    phoneNumber: string;
    otp: string;
    otpExpiresAt: string;
    
}
export enum ACCOUNT_TYPE {
    PhoneNumber = 'PhoneNumber',
    Email = 'Email',
  }