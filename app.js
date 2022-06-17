const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");

//setting pug for frontend
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
//get the existing note
app.get("/", (req, res) => {
  fs.readFile("./data/lesson.json", (err, data) => {
    if (err) throw err;

    const lessons = JSON.parse(data);

    res.render("home", { lessons: lessons });
  });
});
//add function for notes
app.post("/add", (req, res) => {
  const formData = req.body;

  if (formData.lesson.trim() == "") {
    fs.readFile("./data/lesson.json", (err, data) => {
      if (err) throw err;

      const lessons = JSON.parse(data);

      res.render("home", { error: true, lessons: lessons });
    });
  } else {
    fs.readFile("./data/lesson.json", (err, data) => {
      if (err) throw err;
      const lessons = JSON.parse(data);

      const lesson = {
        id: id(),
        description: formData.lesson,
        done: false,
      };

      lessons.push(lesson);

      fs.writeFile("./data/lesson.json", JSON.stringify(lessons), (err) => {
        if (err) throw err;

        fs.readFile("./data/lesson.json", (err, data) => {
          if (err) throw err;

          const lessons = JSON.parse(data);

          res.render("home", { success: true, lessons: lessons });
        });
      });
    });
  }
});
//delete button functions
app.get("/:id/delete", (req, res) => {
  //Saving the ID value
  const id = req.params.id;

  fs.readFile("./data/lesson.json", (err, data) => {
    if (err) throw err;

    const lessons = JSON.parse(data);

    const filteredlessons = lessons.filter((lesson) => lesson.id != id);

    fs.writeFile(
      "./data/lesson.json",
      JSON.stringify(filteredlessons),
      (err) => {
        if (err) throw err;

        res.render("home", { lessons: filteredlessons, delete: true });
      }
    );
  });
});
//updateing the existing note
app.get("/:id/update", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/lesson.json", (err, data) => {
    if (err) throw err;
    //Finding the lesson to be changed
    const lessons = JSON.parse(data);
    const lesson = lessons.filter((lesson) => lesson.id == id)[0];

    //Getting that lessons
    const lessonIdx = lessons.indexOf(lesson);
    const splicedlesson = lessons.splice(lessonIdx, 1)[0];

    //Changing their status
    splicedlesson.done = true;

    //Adding back those lessons
    lessons.push(splicedlesson);

    fs.writeFile("./data/lesson.json", JSON.stringify(lessons), (err) => {
      if (err) throw err;

      res.render(`home`, { lessons: lessons });
    });
  });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Running ${PORT}`);
});
//generate randomm id
function id() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
