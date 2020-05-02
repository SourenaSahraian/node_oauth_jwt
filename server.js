const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const HttpStatus = require('http-status-codes')
const app = express()

app.use(express.json())

const users = [
    {
        'name': 'soorena',
        'ssn': '123456789'
    },
    {
        'name': 'Adam',
        'ssn': '45678901'
    },
    {
        'name': 'Terrece',
        'ssn': '34567890'
    },

    {
        'name': 'Mike',
        'ssn': '345612389'
    },
    {
        'name': 'Jordan',
        'ssn': '112345678'
    }

]

const validRefreshTokens = []

const authenticateToken = (req, res, next) => {
    const headers = req.headers['authorization']
    const token = headers && headers.split(' ')[1];
    if(!token) return res.sendStatus(HttpStatus.UNAUTHORIZED)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err,user) => {
        if (err) return res.sendStatus(HttpStatus.FORBIDDEN)
        req = req.user
        next()
    })

}

app.get('/users', authenticateToken, (req, res) => {
    res.json(users)
})

app.post('/login', (req, res) => {

    const userName = req.body.userName;
    const dob = req.body.dob
    const user = {
        userName,
        dob
    }
    const accessToken =  generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY)
    validRefreshTokens.push(refreshToken)
    res.json({ accessToken , refreshToken})
})

app.get('/refreshToken/:token', (req,res) => {
    const token = req.params.token
    if( !token || !validRefreshTokens.includes(token))  return res.sendStatus(HttpStatus.UNAUTHORIZED)
    jwt.verify(token,process.env.REFRESH_TOKEN_SECRET_KEY, (err,user) => {
        if(err) return res.sendStatus(UNAUTHORIZED.FORBIDDEN);
        const {userName,dob} = user; //the user has the issued data and additional info
        return res.json(generateAccessToken({userName, dob}))

    })

})


const generateAccessToken = (user) => {
   return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {'expiresIn':'15s'})
}

//const port = process.env.PORT || 8080;
app.listen(3000)

