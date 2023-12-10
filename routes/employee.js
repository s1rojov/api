const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

// get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await pool.query("select e.id, e.fname,e.sname,e.birthday, e.email, e.phone,j.name from employee e inner join job j on  e.job_id = j.id");
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

// update employee
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, sname, birthday, email, phone, job_id } = req.body;
    const oldEmployee = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
    const updatedEmployee = await pool.query(
      `
        UPDATE employee SET fname = $1, sname = $2, birthday = $3, email = $4, phone = $5, job_id = $6 WHERE id = $7 RETURNING *
      `,
      [
        fname || oldEmployee.rows[0].fname,
        sname || oldEmployee.rows[0].sname,
        birthday || oldEmployee.rows[0].birthday,
        email || oldEmployee.rows[0].email,
        phone || oldEmployee.rows[0].phone,
        job_id || oldEmployee.rows[0].job_id,
        id
      ]
    );

    res.status(200).json(updatedEmployee.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('delete from employee where id = $1', [req.params.id])
    res.status(200).json('Deleted successfully')
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


module.exports = router;
