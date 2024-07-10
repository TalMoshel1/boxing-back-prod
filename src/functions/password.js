import bcrypt from 'bcrypt'

export async function hashPassword(password) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
    }
  };
  
  export async function comparePassword(plainPassword, hashedPassword){
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      return match;
    } catch (err) {
      console.error('Error comparing password:', err);
      throw err;
    }
  };