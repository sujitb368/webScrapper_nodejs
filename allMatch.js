const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scoreCard");
function getAllMatchesLink(url) {
  request(url, function (err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractAllLinks(html);
    }
  });
}
function extractAllLinks(html) {
  let $ = cheerio.load(html);

  let scorecardElems = $(".ds-no-tap-higlight");

  // console.log("test in scorecardElems =>", scorecardElems);
  const arrayOfLink = [];
  for (let i = 0; i < scorecardElems.length; i++) {
    let link = $(scorecardElems[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    if (fullLink.includes("series/ipl")) {
      arrayOfLink.push(fullLink);
    }
    // scoreCardObj.ps(fullLink);
    //
  }

  const mySet = new Set(arrayOfLink);
  const newArr = [...mySet];

  newArr.forEach((e, i) => {
    //console.log("link => " + i + " " + e);
    // if (i === 0)
    scoreCardObj.ps(e);
  });
}

module.exports = {
  gAlmatches: getAllMatchesLink,
};
