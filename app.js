const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const TodoTask = require("./models/todoModel");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.set("useFindAndModify", false);
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log("Connected to mongodb");
    app.listen(port, () => console.log(`Listening on port ${port}`));
  }
);

// display all todos
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo", { todoTasks: tasks });
  });
});

// create a new todo
app.post("/", async (req, res) => {
  const todo = new TodoTask({
    content: req.body.content,
  });
  try {
    await todo.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

// update a todo
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

// delete a todo
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
