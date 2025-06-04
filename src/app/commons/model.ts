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
    with: string;
    distance: number;
  }
  
  export interface User {
    _id?: string;
    name: string;
    dob: string;
    age: number;
    gender: string;
    location?: Location;
    profilePic: string;
    images: string[];
    phoneNumber: string;
    username: string;
    ethnicity: string;
    bodyType: string;
    height: string;
    interests: string[];
    bio: string;
    settings: {
      deviceId: string,
      banned: boolean,
      verified: boolean
    },
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

export interface ImageBlob {
  img: any,
  filename: string;
} 

export interface OTP {
    phoneNumber: string;
    otp: string;
    otpExpiresAt: string;
    
}

export interface NotFound {
  icon: string;
  title: string;
  body: string;
}
