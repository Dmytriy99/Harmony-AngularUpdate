export interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
  age: string;
  status: string;
  description: string;
  address: string;
  image: any;
}

export interface Comment {
  content: string;
  email: string;
  id: number;
  name: string;
  post_id: number;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  likes: number;
}

export class AddUser {
  constructor(
    public email: string,
    public name: string,
    public gender: string,
    public status: string
  ) {}
}
export interface commentProva {
  content: string;
}
