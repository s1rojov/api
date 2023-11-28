const { Router } = require("express");
const pool = require("../config/db");
const router = Router();


// get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await pool.query("select * from job");
    res.status(200).json(jobs.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add new job
router.post("/", async (req, res) => {
  try {
    const newJob = await pool.query(
      `insert into job (name) values ($1) returning *`,
      [req.body.name]
    );
    res.status(201).json(newJob.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update jobs
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const oldJob = await pool.query(`select * from job where id = $1`, [id]);
    const updatedJob = await pool.query(`update job set name = $1 where id = $2 returning *`,
      [
        name || oldJob.rows[0].name,
        id
      ]);
    res.status(200).json(updatedJob.rows[0])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// delete jobs
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM job WHERE id = $1 RETURNING *`, [id]);

    if (result.rowCount > 0) {
      res.status(200).json('Deleted successfully');
    } else {
      res.status(404).json({ message: 'No job found with that id' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
