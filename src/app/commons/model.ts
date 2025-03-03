export interface Range {
    min: number;
    max: number;
    value: number;
    pin: boolean;
}


export interface User {
    username: string; 
    name: string; 
    dob: string; 
    _id: string; 
}

export interface Message {
    message: string;
    receiver: string;
    sender: string;
    timestamp: string;
    _id: string; 

}

export interface UserProfile {
    name: string;
    dob: string; // Date of Birth (string or Date type can be used based on preference)
    gender: string;
    location: string;
    interests: string[]; // Array of interests
    about: {
      race?: string;
      bodyType?: string;
      sexualOrientation?: string;
      height?: string;
    }; // Optional about details
    images: string[]; // Array of image URLs
  }
  