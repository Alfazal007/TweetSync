import jwt from "jsonwebtoken";

interface AccessTokenData {
    userId: String;
    username: String;
    email: String;
}
const generateAccessToken = (tokenData: AccessTokenData) => {
    const token = jwt.sign(tokenData, process.env.ACCESSTOKENSECRET || "", {
        expiresIn: process.env.ACCESSTOKENEXPIRY,
    });
    return token;
};

const generateRefreshToken = (id: String) => {
    const token = jwt.sign({ id }, process.env.REFRESHTOKENSECRET || "", {
        expiresIn: process.env.REFRESHTOKENEXPIRY,
    });
    return token;
};

export { generateAccessToken, generateRefreshToken };
