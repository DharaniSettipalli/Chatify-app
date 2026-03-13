import jwt from 'jsonwebtoken'

export const generateToken = async (userId, res) => {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured')
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    console.log('token from generate token: ', token);
    

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000 ,//in milli
        httpOnly: true, //prevent XSS attacks
        sameSite: 'Strict', //CSRF attacks
        secure: process.env.NODE_ENV === 'development' ? false: true
    })
    console.log('cookies: ',res.cookie);
    //console.log(token);
    
    return token
}