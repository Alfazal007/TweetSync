import bcrypt, { hash } from "bcrypt";
const generateHashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};

const comparePassword = async (password: string, oldPassword: string) => {
    const passwordCorrect = await bcrypt.compare(password, oldPassword);
    return passwordCorrect;
};

export { generateHashPassword, comparePassword };
