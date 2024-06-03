import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { signIn } from '@/auth';
import bcrypt from 'bcrypt';
import { getUser, insertUser } from './data';

const UserSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
});


export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
  

    try {
        console.log("formData authenticate", formData);
    } catch (error) {
        if (error) {
            throw new Error('Invalid email or password');
        }
        throw error;
    }
}


export async function createUser(
    state: void | undefined,
    formData: FormData
) {
    const { username, email, password } = UserSchema.parse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    console.log("formData createUser", formData);


    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }

        if (!email.includes('@')) {
            throw new Error('Invalid email');
        }

        const user = await getUser(email);
        if (user) {
            throw new Error('User already exists');
        }

        await insertUser(id, username, email, hashedPassword);
        revalidatePath('/');
        redirect('/');
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
    }
}