import { HttpHeaders } from '@angular/common/http';

export const token: string = localStorage.getItem('token')!;

//link per provare l'applicazione in locale

// export const urlUser: string = 'http://localhost:3000/api/user';
// export const urlPost: string = 'http://localhost:3000/api/post';
// export const urlCommunity: string = 'http://localhost:3000/api/community';
// export const urlAuth: string = 'http://localhost:3000/api';

// link al server Deployato

export const urlPost: string = 'https://harmony-1.onrender.com/api/post';
export const urlUser: string = 'https://harmony-1.onrender.com/api/user';
 export const urlCommunity: string = 'https://harmony-1.onrender.com/api/community';
export const urlAuth: string = 'https://harmony-1.onrender.com/api';

const headers = new HttpHeaders({
  Authorization: token,
});

export const httpOption = { headers: headers };
