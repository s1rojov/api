const express = require("express");
require("dotenv").config();
const app = express();
let cors = require('cors')

app.use(express.json());
app.use(cors())

//Initial route
app.use("/api", require("./routes/index"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
