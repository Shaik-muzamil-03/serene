export interface UserInterface {
    id?: number;
    name: string;
    email: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    loggedIn?: boolean
}