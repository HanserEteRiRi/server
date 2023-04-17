var express = require("express");
var router = express.Router();

function extractRelWords(jsonData) {
  const data = jsonData.data;
  const relWords = data.map((item) => {
    const keyValuePairs = item.split("\r\n");
    const relWordPair = keyValuePairs.find((pair) => pair.startsWith("RELWORD="));
    return relWordPair.replace("RELWORD=", "");
  });
  return relWords;
}





router.post("/", function (req, res, next) {
  console.log("search: searchMusic:" + req.body.searchMusic)
  let searchMusic = req.body.searchMusic;
  console.log(searchMusic);
  search(searchMusic).then((reqsong) => {
    song = reqsong;
    // console.log(song);
    res.json(song); //服务器返回song数据
  });
});

module.exports = router;
