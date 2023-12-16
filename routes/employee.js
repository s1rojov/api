const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

// get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await pool.query("SELECT employee.id AS id,employee.fname AS fname,employee.sname AS sname,employee.birthday AS birthday,employee.email AS email,employee.phone AS phone,job.name AS job_name,department.name AS department_name FROM employee JOIN job ON employee.job_id = job.id JOIN department ON employee.department_id = department.id");
    res.status(200).json(employees.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new employee
router.post("/", async (req, res) => {
  try {
    const { fname, sname, birthday, email, phone, job_id, department_id } = req.body;
    const newEmployee = pool.query(
      `
        insert into employee (fname, sname, birthday, email, phone, job_id, department_id) values ($1, $2, $3, $4, $5, $6, $7) returning *
    `,
      [fname, sname, birthday, email, phone, job_id, department_id]
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
    const { fname, sname, birthday, email, phone, job_id, department_id } = req.body;
    const oldEmployee = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
    const updatedEmployee = await pool.query(
      `
        UPDATE employee SET fname = $1, sname = $2, birthday = $3, email = $4, phone = $5, job_id = $6, department_id=$7 WHERE id = $8 RETURNING *
      `,
      [
        fname || oldEmployee.rows[0].fname,
        sname || oldEmployee.rows[0].sname,
        birthday || oldEmployee.rows[0].birthday,
        email || oldEmployee.rows[0].email,
        phone || oldEmployee.rows[0].phone,
        job_id || oldEmployee.rows[0].job_id,
        department_id || oldEmployee.rows[0].department_id,
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
