export type RegisterRequest = {
    name: string,
    email: string,
    password: string
}

export type LoginRequest = {
    email: string,
    password: string
}

export type User = {
  email: string;
  userName: string | null;
};