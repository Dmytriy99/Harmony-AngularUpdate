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
  date: string;
}

export class AddPostDto {
  title!: string;
  post!: string;
  search!: string;
}
export class UserDto {
  name!: string;
  email!: string;
  password!: string;
  gender!: string;
  age!: string;
  description!: string;
  address!: string;
  image: any;
  search!: string;
}
export class CommentDto {
  content!: string;
}
