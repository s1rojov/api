const { Router } = require("express");
const pool = require("../config/db");
const router = Router();


//get all departments
router.get("/", async (req, res) => {
    try {
        const departments = await pool.query("select * from department");
        res.status(200).json(departments.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//add new deparmtent
router.post("/", async (req, res) => {
    try {
        const { name, code } = req.body
        const newJob = await pool.query(
            `insert into department (name, code) values ($1, $2) returning *`,
            [name, code]
        );
        res.status(201).json('Created successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//update department
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, code } = req.body
        const oldDepartment = await pool.query(`select * from department where id = $1`, [id]);
        const updatedDepartment = await pool.query(`update department set name = $1, code= $2 where id = $3 returning *`,
            [
                name || oldDepartment.rows[0].name,
                code || oldDepartment.rows[0].code,
                id
            ]);
        res.status(200).json(updatedDepartment.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// delete department
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('delete from department where id = $1', [req.params.id])
        res.status(200).json('Deleted successfully')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router