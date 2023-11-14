const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
// Venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");
const AllMatcgObj = require("./allMatch");

const fs = require("fs");
const path = require("path");

const iplPath = path.join(__dirname, "ipl");

//directory creator function
dirCreater(iplPath);

// home page
request(url, cb);
function cb(err, response, html) {
  if (err) {
    // console.log("error in cb 1", err);
  } else {
    // console.log(html);
    extractLink(html);
  }
}
function extractLink(html) {
  let $ = cheerio.load(html);
  console.log("getting link 1=> ");
  // let anchorElem = $("a[data-hover='View All Results']");
  let anchorElem = $("a[title='View All Results']");
  let link = anchorElem.attr("href");
  // console.log("getting link => ", link);
  let fullLink = "https://www.espncricinfo.com" + link;
  console.log("fulllink => ", fullLink);
  AllMatcgObj.gAlmatches(fullLink);
}

function dirCreater(filePath) {
  try {
    if (fs.existsSync(filePath) === false) {
      fs.mkdirSync(filePath);
    }
  } catch (error) {
    console.log("error i dir create");
  }
}
