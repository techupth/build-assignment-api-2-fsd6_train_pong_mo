import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

/** GET user Start */
app.get("/users", async (req, res) => {
  try {
    const Obama = await connectionPool.query(`select * from users`);
    console.log(Obama.rows);
  } catch {
    return res.status(500).json({
      message: "maidai Ja",
    });
  }
  return res.status(200).json({
    message: "success kub",
  });
});
/** GET users End */

/** POST Assignment Start */
app.post("/assignments", async (req, res) => {
  const newAssignment = {
    ...req.body,
    update_at: new Date(),
  };
  console.log(newAssignment);
  try {
    await connectionPool.query(
      `insert into assignments (title, content, category)
      values ($1,$2,$3)`,
      [newAssignment.title, newAssignment.content, newAssignment.category]
    );
  } catch {
    if (
      !newAssignment.title ||
      !newAssignment.content ||
      !newAssignment.category
    ) {
      return res.status(400).json({
        message:
          "Server could not create assignment because there are missing data from client",
      });
    } else {
      return res.status(500).json({
        message:
          "Server could not create assignment because database connection",
      });
    }
  }
  return res.status(201).json({
    message: "Created assignment successfully",
  });
});
/** Post Assignment End */

/** GET Assignment Start */
app.get("/assignments", async (req, res) => {
  let results;
  try {
    results = await connectionPool.query(`select * from assignments`);
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  return res.status(200).json({
    data: results.rows,
  });
});
/** GET Assignment End */

/** GET One Assignment Start */
app.get("/assignments/:assignmentId", async (req, res) => {
  let results;
  const assignmentIdFromClient = req.params.assignmentId;
  console.log(assignmentIdFromClient);
  try {
    results = await connectionPool.query(
      `
      select * from assignments 
      where assignment_id = $1`,
      [assignmentIdFromClient]
    );
    console.log(results.rows);
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  if (!results.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested assignment",
    });
  }
  return res.status(200).json({
    data: results.rows[0],
  });
});
/** GET One Assignment End */

/** PUT One Assignment Start */
app.put("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  const updatedAssignment = { ...req.body, update_at: new Date() };
  let results;
  try {
    results = await connectionPool.query(
      `
      select * from assignments 
      where assignment_id = $1`,
      [assignmentIdFromClient]
    );
    if (!results.rows[0]) {
      return res.status(500).json({
        message: "Server could not find a requested assignment to update",
      });
    }
    await connectionPool.query(
      `update assignments 
      set title = $2,
      content = $3,
      category = $4
      where assignment_id = $1`,
      [
        assignmentIdFromClient,
        updatedAssignment.title,
        updatedAssignment.content,
        updatedAssignment.category,
      ]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  return res.status(200).json({
    message: "Updated assignment sucessfully",
  });
});
/**PUT One Assignment End */

app.delete("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  let results;
  try {
    results = await connectionPool.query(
      `
      select * from assignments 
      where assignment_id = $1`,
      [assignmentIdFromClient]
    );
    if (!results.rows[0]) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to delete",
      });
    }
    await connectionPool.query(
      `delete from assignments where assignment_id = $1`,
      [assignmentIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not delete assignment because database connection",
    });
  }
  return res.status(200).json({
    message: "Deleted assignment sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
