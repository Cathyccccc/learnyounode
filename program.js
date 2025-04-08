const fs = require("fs");
const path = require("path");
const http = require("http");
const net = require("net");
const { URL } = require("url");
const bl = require("bl");
const map = require("through2-map");
const readFileList = require("./utils");

// const buffer = fs.readFileSync(process.argv[2]);
// const str = buffer.toString();
// const arr = str.split("\n");
// console.log(arr.length - 1);

// fs.readFile(process.argv[2], "utf8", (err, data) => {
//   if (err) {
//   } else {
//     const lines = data.split("\n").length - 1;
//     console.log(lines);
//   }
// });

// fs.readdir(process.argv[2], (err, list) => {
//   if (err) {
//     console.log(err);
//   }
//   const extension = process.argv[3];
//   list = list.filter((item) => path.extname(item).slice(1) === extension);
//   list.forEach((item) => {
//     console.log(item);
//   });
// });

// readFileList(process.argv[2], process.argv[3], (err, data) => {
//   if (err) {
//     console.log(err);
//   }
//   data.forEach((item) => console.log(item));
// });

// http.get(process.argv[2], (response) => {
//   response.setEncoding("utf8"); // 将 Node Buffer 对象转为字符串
//   response.on("data", function (data) {
//     console.log(data);
//   });
//   response.on("error", function (err) {
//     console.log("err", err);
//   });
//   response.on("end", function () {
//     // console.log("end");
//   });
// });

// http.get(process.argv[2], (response) => {
//   response.setEncoding("utf8");
//   let str = "";
//   response.on("data", function (data) {
//     str += data;
//   });
//   response.on("error", function (err) {
//     console.log("err", err);
//   });
//   response.on("end", function () {
//     // console.log("end");
//     console.log(str.length);
//     console.log(str);
//   });
// });

// http.get(process.argv[2], (response) => {
//   response.pipe(
//     bl((err, data) => {
//       if (err) {
//         console.error(err);
//       } else {
//         data = data.toString();
//         console.log(data.length);
//         console.log(data);
//       }
//     })
//   );
// });

// const start = Date.now();
// let promises = [];
// for (let i = 2; i < process.argv.length; i++) {
//   promises.push(request(process.argv[i]));
// }
// Promise.allSettled(promises).then((res) => {
//   res.forEach((item) => console.log(item.value));
//   console.log(Date.now() - start);
// });

// function request(url) {
//   return new Promise((resolve, reject) => {
//     http.get(url, (response) => {
//       response.pipe(
//         bl((err, data) => {
//           if (err) {
//             reject(err);
//           } else {
//             data = data.toString();
//             resolve(data);
//           }
//         })
//       );
//     });
//   });
// }

// const server = net.createServer((socket) => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0");
//   const day = date.getDate().toString().padStart(2, "0");
//   const hour = date.getHours().toString().padStart(2, "0");
//   const minute = date.getMinutes().toString().padStart(2, "0");
//   socket.end(`${year}-${month}-${day} ${hour}:${minute}\n`);
// });
// server.listen(process.argv[2]);

// HTTP 文件服务器
// const httpServer = http.createServer((request, response) => {
//   response.writeHead(200, { "content-type": "text/plain" });
//   const readable = fs.createReadStream(process.argv[3]);
//   readable.pipe(response);
// });
// httpServer.listen(Number(process.argv[2]));

// HTTP 大写转换器
// const httpServer = http.createServer((request, response) => {
//   if (request.method !== "POST") {
//     return response.end("send me a POST\n");
//   }
//   request
//     .pipe(
//       map(function (chunk) {
//         return chunk.toString().toUpperCase();
//       })
//     )
//     .pipe(response);
// });
// httpServer.listen(process.argv[2]);

// HTTP JSON API 服务器
const httpServer = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === "GET") {
    response.writeHead(200, { "content-type": "application/json" });
    if (url.pathname === "/api/parsetime") {
      const date = new Date(url.searchParams.get("iso"));
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      response.end(
        JSON.stringify({
          hour,
          minute,
          second,
        })
      );
    } else if (url.pathname === "/api/unixtime") {
      const unixtime = Date.parse(url.searchParams.get("iso"));
      response.end(
        JSON.stringify({
          unixtime,
        })
      );
    }
  } else {
    response.writeHead(404);
    response.end();
  }
});

httpServer.listen(process.argv[2]);

// 参考答案：
// ("use strict");
// const http = require("http");

// function parsetime(time) {
//   return {
//     hour: time.getHours(),
//     minute: time.getMinutes(),
//     second: time.getSeconds(),
//   };
// }

// function unixtime(time) {
//   return { unixtime: time.getTime() };
// }

// const server = http.createServer(function (req, res) {
//   const parsedUrl = new URL(req.url, "http://example.com");
//   const time = new Date(parsedUrl.searchParams.get("iso"));
//   let result;

//   if (/^\/api\/parsetime/.test(req.url)) {
//     result = parsetime(time);
//   } else if (/^\/api\/unixtime/.test(req.url)) {
//     result = unixtime(time);
//   }

//   if (result) {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify(result));
//   } else {
//     res.writeHead(404);
//     res.end();
//   }
// });
// server.listen(Number(process.argv[2]));
