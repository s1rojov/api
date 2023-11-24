const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

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
    res.status(201).json('Created successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
