const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

router.get('/', async (req, res) => {
    try {
        const departmentStatistic = await pool.query('SELECT d.name AS department_name, COUNT(e.id) AS employee_count FROM department d INNER JOIN employee e ON d.id = e.department_id GROUP BY d.id')
        const jobStatistic = await pool.query('SELECT j.name AS job_name,COUNT(e.id) AS employee_count FROM job j INNER JOIN employee e ON j.id = e.job_id GROUP BY j.id')


        let departmentNames = []
        let departmentCount = []
        departmentStatistic.rows.forEach(el => {
            departmentNames.push(el.department_name)
            departmentCount.push(el.employee_count)
        });
        let jobNames = []
        let jobCount = []
        jobStatistic.rows.forEach(el => {
            jobNames.push(el.job_name)
            jobCount.push(el.employee_count)
        });
        const result = [
            {
                name: departmentNames,
                count: departmentCount
            },
            {
                name: jobNames,
                count: jobCount
            }
        ]
        res.status(200).json(result)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = router