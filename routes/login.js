const { Router } = require("express");
const pool = require("../config/db");
const router = Router();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
// accessTokens
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}
// refreshTokens
let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20m" })
    refreshTokens.push(refreshToken)
    return refreshToken
}

router.post("/", async (req, res) => {
    const users = await pool.query('select * from users')
    const { name, password } = req.body
    const user = users.rows.find((el) => el.name == name)
    if (user == null) {
        res.status(404).send('User does not exist')
    }
    else if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken({ user: name })
        const refreshToken = generateRefreshToken({ user: name })
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
    }
    else {
        res.status(401).send("Password Incorrect!")
    }
})


router.post('/refreshToken', (req, res) => {
    const { token, name } = req.body
    if (!refreshTokens.includes(req.body.token)) {
        res.status(400).send("Refresh Token Invalid")
    }
    else {
        refreshTokens = refreshTokens.filter((c) => c != req.body.token)
        const accessToken = generateAccessToken({ name: name })
        const refreshToken = generateRefreshToken({ name: name })
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
    }
})
router.delete('/logout', (req, res) => {
    // refreshTokens = refreshTokens.filter((c) => c != req.body.token)
    res.status(204).json("Logged out!")
})


module.exports = router