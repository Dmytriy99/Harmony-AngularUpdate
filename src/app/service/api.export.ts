import { HttpHeaders } from '@angular/common/http';

export const token: string = localStorage.getItem('token')!;

// export const urlUser: string = 'http://localhost:3000/api/user';
// export const urlPost: string = 'http://localhost:3000/api/post';
// export const urlAuth: string = 'http://localhost:3000/api';
export const urlPost: string = 'https://harmony-4uc7.onrender.com/api/post';
export const urlUser: string = 'https://harmony-4uc7.onrender.com/api/user';
export const urlAuth: string = 'https://harmony-4uc7.onrender.com/api';

const headers = new HttpHeaders({
  Authorization: token,
});

export const httpOption = { headers: headers };
