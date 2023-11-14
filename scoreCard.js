// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
// Venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");

const fs = require("fs");
const path = require("path");

// const iplPath = path.join(__dirname, "ipl");

//directory creator function
// dirCreater(iplPath);
// home page
function processScorecard(url) {
  request(url, cb);
}
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    // console.log(html);
    extractMatchDetails(html);
  }
}
function extractMatchDetails(html) {
  // Venue date opponent result runs balls fours sixes sr
  // ipl
  // team
  //     player
  //         runs balls fours sixes sr opponent venue date  result
  // venue date
  // .event .description
  // result ->  .event.status - text
  let $ = cheerio.load(html);
  let descElem = $(".ds-p-0 div .ds-px-4 .ds-grow> .ds-text-typo-mid3");
  let result = $(".ds-text-compact-xxs>div>.ds-text-tight-m>span");
  let stringArr = descElem.text().split(",");
  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  result = result.text();

  // console.log("result = >", result);

  let innings = $(".ds-rounded-lg > .ds-w-full");
  // console.log("innings = >", $(innings[0]).html());
  // return;

  // let htmlString = "";ś

  for (let i = 0; i < innings.length; i++) {
    // htmlString = $(innings[i]).html();
    // team opponent
    let teamName = $(innings[i]).find("span > .ds-text-title-xs").text();
    teamName = teamName.trim();
    let opponentIndex = i == 0 ? 1 : 0;

    let opponentName = $(innings[opponentIndex])
      .find("span > .ds-text-title-xs")
      .text();
    opponentName = opponentName.trim();
    let cInning = $(innings[i]);

    console.log(`${venue}| ${date} |${teamName}| ${opponentName} |${result}`);

    // return;

    let allRows = cInning.find(".ci-scorecard-table > tbody > tr");
    // console.log("allRows", allRows.html());
    // return;
    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isWorthy = $(allCols[0]).hasClass("ds-w-0");
      if (isWorthy == true) {
        // console.log(allCols.text());
        //       Player  runs balls fours sixes sr
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();

        processPlayer(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          sr,
          opponentName,
          venue,
          date,
          result
        );
        // console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
      }
    }
  }
  // console.log(htmlString);
}

function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  sr,
  opponentName,
  venue,
  date,
  result
) {
  try {
    const teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);

    playerName = playerName.includes("(c)")
      ? playerName.split("(")[0].trim()
      : playerName.includes("†")
      ? playerName.split("†")[0].trim()
      : playerName.trim();

    const filePath = path.join(teamPath, playerName + ".json");

    // console.log("name of path", filePath);

    // return;
    const content = fileRead(filePath);

    const playerObj = {
      teamName,
      playerName,
      runs,
      balls,
      fours,
      sixes,
      sr,
      opponentName,
      venue,
      date,
      result,
    };

    content.push(playerObj);

    writeFile(filePath, content);
  } catch (error) {
    console.log("error in process player", error);
  }
}

function dirCreater(filePath) {
  try {
    if (fs.existsSync(filePath) === false) {
      fs.mkdirSync(filePath);
    }
  } catch (error) {
    console.log("error in dir create");
  }
}

function fileRead(filePath) {
  try {
    if (fs.existsSync(filePath) === false) {
      return [];
    }

    const file = JSON.parse(fs.readFileSync(filePath, "utf8"));

    return file;
  } catch (error) {
    console.log("Error in fileRead: ", error);
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(content));
  } catch (error) {
    console.log("error in fileWrite: ", error);
  }
}
module.exports = {
  ps: processScorecard,
};
