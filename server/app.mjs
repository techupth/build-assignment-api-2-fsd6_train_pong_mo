import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", async (req, res) => {
  // Access ข้อมูลใน body จาก req ด้วย req.body
  const newAssignment = { ...req.body };

  // เขียน query เพื่อ insert ข้อมูล assignment ด้วย connectionPool
  try {
    await connectionPool.query(
      `insert into assignments (title, content, category)
      values ($1, $2, $3)`,
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
    message: "Created assignment sucessfully",
  });
});

app.get("/assignments", async (req, res) => {
  // เขียน query เพื่ออ่านข้อมูล assignment ด้วย cennectionPool
  let results;
  try {
    results = await connectionPool.query(`select * from assignments`);
  } catch {
    return res.status(500).json({
      message: "Server could not create assignment because database connection",
    });
  }
  return res.status(200).json({ data: results.rows });
});

app.get("/assignments/:assignmentId", async (req, res) => {
  // access endpoint parameter ด้วย req.params
  const assignmentIdFromClient = req.params.assignmentId;

  let results;
  //  เขียน query เพื่ออ่านข้อมูล assignment ด้วย connectionPool
  try {
    results = await connectionPool.query(
      `select * from assignments where assignment_id=$1`,
      [assignmentIdFromClient]
    );
    // console.log(results);
    if (!results.rows[0]) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested assignment" });
    }
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }

  // return res กลับไปหา client
  return res.status(200).json({ data: results.rows[0] });
});

app.put("/assignments/:assignmentId", async (req, res) => {
  // access endpoint paramenter ด้วย req.params
  // และข้อมูลจาก assignment ที่ client ส่งมาแก้ไขจาก body ของ request
  const assignmentIdFromClient = req.params.assignmentId;
  const updatedAssignments = { ...req.body, updated_at: new Date() };
  let results;
  // console.log(updatedAssignments);
  // เขียน query เพื่อแก้ไขข้อมูล assignment ด้วย connectionPool
  try {
    results = await connectionPool.query(
      `
      update assignments
      set title = $2,
      content = $3,
      category = $4
      where assignment_id = $1
      `,
      [
        assignmentIdFromClient,
        updatedAssignments.title,
        updatedAssignments.content,
        updatedAssignments.category,
      ]
    );
    // console.log(results);
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested assignment" });
    }
  } catch {
    // console.log(error.message);
    res.status(500).json({
      message: "Server could not update assignment because database connection",
    });
  }
  return res.status(200).json({ message: "Updated assignment sucessfully" });
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  let results;
  try {
    results = await connectionPool.query(
      `delete from assignments
      where assignment_id = $1`,
      [assignmentIdFromClient]
    );
    console.log(results);
    if (results.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to delete",
      });
    }
  } catch {
    res.status(500).json({
      message: "Server could not delete assignment because database connection",
    });
  }
  return res.status(200).json({ message: "Deleted assignment sucessfully" });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
