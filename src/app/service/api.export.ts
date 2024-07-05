import { HttpHeaders } from '@angular/common/http';

export const token: string = localStorage.getItem('token')!;

const headers = new HttpHeaders({
  Authorization: `Bearer ${token}`,
});
export const httpOption = { headers: headers };

// export const urlUser: string = 'http://localhost:3000/api/user';
// export const urlPost: string = 'http://localhost:3000/api/post';
// export const urlAuth: string = 'http://localhost:3000/api';
// export const urlPost: string = 'https://epichub.onrender.com/api/post';
// export const urlUser: string = 'https://epichub.onrender.com/api/user';
// export const urlAuth: string = 'https://epichub.onrender.com/api';
export const urlPost: string = 'https://harmony-4uc7.onrender.com/api/post';
export const urlUser: string = 'https://harmony-4uc7.onrender.com/api/user';
export const urlAuth: string = 'https://harmony-4uc7.onrender.com/api';

const headers2 = new HttpHeaders({
  Authorization: token,
});

export const httpOption2 = { headers: headers2 };
