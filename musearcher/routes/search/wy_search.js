const axios = require("axios");
var express = require('express');

const song = require("./song");
const interface = require("../../setting");
const e = require("express");

async function searchmusic(searchContent) { //设为async函数，因为有axios存在等待行为。

    var searchSrc = interface.wySearch + searchContent + "&limit=50"; //输入搜索地址
    var songList = [];
    var searchSrcs2 = []; //歌曲rid搜索列表
    let searchSrcs3 = []; //歌词搜索列表
    var songs = [];

    console.log("search from: ",searchSrc);

    await axios({ //await等待行为结束才会进行下一步
        method: 'get',
        url: searchSrc,
        responseType: 'json'
    }).then( (response) => {   //response:搜索结果对象
        // console.log(response.data.req.data.body);

        for(var songid of response.data.result.songs) { //页面信息在response.data中
            let searchSrc2 = interface.wyUrl + songid.id // url搜索地址
            let searchSrc3 = interface.wyLyric + songid.id // 歌词搜索请求
            searchSrcs2.push(searchSrc2)
            searchSrcs3.push(searchSrc3)
            // console.log(searchSrc2)
            let newsong = new song()
            newsong.name = songid.name
            newsong.pic = songid.al.picUrl;
            newsong.artists = [];
   
            for(let singer of songid.ar) {
                newsong.artists.push(singer.name);
            }
            
            newsong.artist = newsong.artists.reduce( (pre, cur) => {
                return pre + "&" + cur;
            });
            // console.log(newsong);
            songs.push(newsong);
        }
        
    }).catch( (error) => {
        console.log(error);
    });

    await axios.all(searchSrcs2.map( (searchSrc2) => 
        axios.get(searchSrc2))
    ).then( (resArr) => {//所有的查询请求执行完后进入then, resArr为所有请求结果的数组
        // console.log(resArr[4].data);
        for(let i in resArr) {
            // console.log(resArr[i].data);
            if(resArr[i].data[0].code == 200) { //成功获取url的歌曲有8调信息，其他的只有7条
                songs[i].url = resArr[i].data[0].data[0].url;
                //console.log(songs[i].url);
            }
        }
        //console.log(songs); //最终的结果songs列表
    }).catch((error) => {
        console.log(error);
    });

    await axios.all(searchSrcs3.map( (searchSrc3) =>  // axios.all同时执行所有的rid查询请求,并行操作
        axios.get(searchSrc3))
    ).then( (resArr) => {//所有的查询请求执行完后进入then, resArr为所有请求结果的数组
        // console.log(resArr[4].data);
        for(let i in resArr) {
            // console.log(resArr[i].data);
            if(resArr[i].data.code == 200) { //成功获得标志其他的只有7条
                songs[i].lyric = resArr[i].data.lrc.lyric;
                //console.log(songs[i].url);
            }
        }
        //console.log(songs); //最终的结果songs列表
    }).catch((error) => {
        console.log(error);
    });
    

    //console.log(songs);
    return songs;
}

module.exports = searchmusic;