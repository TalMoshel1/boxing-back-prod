import jwt from 'jsonwebtoken';
import {User} from '../models/user.js';
import { comparePassword } from '../functions/password.js';

export async function serviceSignIn(email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await comparePassword(password, user.password); 
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = getToken(user);
        return {token,user};
    } catch (error) {
        console.error('Error in service SignIn:', error.message);
        throw new Error('Authentication failed');
    }
}

function getToken(user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_Secret_Key, { expiresIn: '1w' });
    return token;
}
