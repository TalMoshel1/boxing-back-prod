import {User} from '../models/user.js'
import {hashPassword} from '../functions/password.js'


export async function findUser(phone) {
    const user = User.findone({phone})
    if (!user) return res.status(400).json({ message: 'User not found' });


}

export async function updateUser() {
    
}

export async function createUser(username, password, phone, role, email) {

    try {
        const hashedPassword = await hashPassword(password); 
        const newUser = new User({
            username,
            password: hashedPassword, 
            phone,
            role,
            email
        });

        const savedUser = await newUser.save();
        const userWithoutPassword = savedUser.toObject();
        delete userWithoutPassword.hashedPassword; 
        return userWithoutPassword; 

    } catch (error) {

        console.error('Error creating user:', error);
        throw new Error('Could not create user');

    }
}