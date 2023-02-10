const http = require("http");

const thispage = (headingContent) => {
  return `<h1>${headingContent}</h1>`;
};

http
  .createServer((req, res) => {
    const { url, method } = req; // deconstructing request object to use response body in the echo
    const chunks = []; //array where the chunks will be stored.
    req
      .on("error", (error) => {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(error));
        res.end();
      })

      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", () => {
        console.log(chunks);
        const body = Buffer.concat(chunks).toString(); // when stream ends we will decode the buffer here.
        const responseBody = {
          url,
          method,
          body,
        };
        switch (url) {
          case "/":
            console.log("reached /");
            res.setHeader("Content-Type", "text/html");
            res.write(thispage("Hello There, Miami."));
            res.end();
            break;
          case "/about": //sends json info
            const data = {
              name: "Alejandro",
              city: "Miami",
            };
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(data)); //must parse the JSON
            res.end();
            break;
          case "/echo":
            //sending information through echo to client
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(responseBody));
            res.end();
            break;
          default:
            //404 not found
            res.setHeader("Content-Type", "text/html");
            res.write(thispage("404 Not Found."));
            res.end();
        }

        res.end();
      });
  })
  .listen(3000, () => console.log("Server listening at port 3000..."));
