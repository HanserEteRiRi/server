var migu_search = require("./migu_search");
var kuwo_search = require("./kuwo_search");
var kugou_search = require("./kugou_search");
var qq_search = require("./qq_search");
const wy_search = require("./wy_search");

// function uniq()

async function search(searchContent) {
  // let songsFromMigu = migu_search(searchContent);
  // let songsFromKuwo = kuwo_search(searchContent);
  // let songsFromKugou = kugou_search(searchContent);
  let songsFromQQ = qq_search(searchContent);
  // let songsFromWy = wy_search(searchContent);

  // const priority = [
  //   songsFromQQ,
  //   songsFromWy,
  //   songsFromKugou,
  //   songsFromMigu,
  //   songsFromKuwo,
  // ];

  // const combinedSongs = [];
  // const songExists = (song1, song2) =>
  //   song1.name === song2.name && song1.artist === song2.artist;

  // priority.forEach((songList) => {
  //   songList.forEach((song) => {
  //     if (!combinedSongs.some((existingSong) => songExists(song, existingSong))) {
  //       combinedSongs.push(song);
  //     }
  //   });
  // });

  return songsFromQQ;
}

module.exports = search;
