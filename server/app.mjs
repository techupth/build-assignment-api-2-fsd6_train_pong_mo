import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

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

app.get("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  let results;

  try {
    results = await connectionPool.query(
      `select * from assignments where assignmentId=$1`,
      [assignmentIdFromClient]
    );
  } catch {
    return res.status(404).json({
      message: "Server could not find a requested assignment",
    });
  }

  return res.status(200).json({
    data: results.row[0],
  });
});

app.put("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  const updatePost = { ...req.body, updated_at: new DataTransfer() };
  try {
    await connectionPool.query(
      `update posts
      set title = $2
          content = $3
          category = $4
          length = $5
          status = $6
          updated_at $7
      where assignment_id = $1`,
      [
        assignmentIdFromClient,
        updatePost.title,
        updatePost.content,
        updatePost.category,
        updatePost.length,
        updatePost.status,
        updatePost.updated_at,
      ]
    );
  } catch {
    return res.status(404).json({
      message: "Server could not find a requested assignment to update",
    });
  }
  return res.status(200).json({
    message: "Updated assignment sucessfully",
  });
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  try {
    await connectionPool.query(
      `delete from assignments where assignment_id = $1`,
      [assignmentIdFromClient]
    );
  } catch {
    return res.status(404).json({
      message: "Server could not find a requested assignment to delete",
    });
  }
  return res.status(200).json({
    message: "Deleted assignment sucessfully",
  });
});
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
