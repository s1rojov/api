const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

// get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await pool.query("select * from employee");
    res.status(200).json(employees.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new employee
router.post("/", async (req, res) => {
  try {
    const { fname, sname, birthday, email, phone, job_id } = req.body;
    const newEmployee = pool.query(
      `
        insert into employee (fname, sname, birthday, email, phone, job_id) values ($1, $2, $3, $4, $5, $6) returning *
    `,
      [fname, sname, birthday, email, phone, job_id]
    );

    res.status(201).json('Created successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
