import express, { Request, Response, NextFunction } from "express";
import { parseCSV } from "./parseCSV";

//express web server for api
const app = express();

// custom middleware function to parse request body as plane text
// (Buffer to string)
app.use((req, res, next) => {
  var data = "";
  req.setEncoding("utf8");
  req.on("data", function (chunk) {
    data += chunk;
  });
  req.on("end", function () {
    req.body = data;
    next();
  });
});

// landing page info (webpage)
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send(`
    <h1>Welcome to CSV App!</h1>
    <p>pass body to GET '/parse' to recieve data formatted</p>
  `);
});

// csv parse GET api
app.get("/parse", (req: Request, res: Response, next: NextFunction) => {
  
  //GET request body 
  const { body } = req;
  if (typeof body === "undefined") {
    res.status(400).send("Error, body undefined");
    next();
    return;
  }

  //send parse data to user
  parseCSV(body)
    .catch((err) => {
      res.status(400).send(err);
    })
    .then((data) => {
      res.send(data);
    });
});


app.listen(10000);