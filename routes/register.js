const { Router } = require("express");
const pool = require("../config/db");
const router = Router();
const bcrypt = require('bcrypt')
const users = []

router.post("/", async (req, res) => {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    // users.push({ name: name, password: hashedPassword, email: email })
    const newUser = await pool.query(
        `insert into users (name, email, password) values ($1, $2, $3) returning *`, [name, email, hashedPassword]
    )
    res.status(201).send(newUser.rows[0])
})




module.exports = router;