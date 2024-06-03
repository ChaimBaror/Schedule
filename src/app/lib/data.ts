import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { User } from './definitions';


export async function getUser(email: string) {
    try {
        const user = await sql`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0] as User;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}


export async function insertUser(id: string, username: string, email: string, hashedPassword: string) {

    try {
        await sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${id}, ${username}, ${email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    } catch (error) {
        console.log(error);
    }
}
