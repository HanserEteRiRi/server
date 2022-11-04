let starList = []
// const addr = "http://47.104.186.86:80"
const addr = "http://localhost:3000"


clicktostar = function () {
    if(localStorage.getItem("username") == "null") {
        alert("请先登录")
        return
    }
    let playInfo = localStorage.getItem("play-info")
    if(playInfo == "null") {
        alert("请选择歌曲")
        return
    }
    let play_info = JSON.parse(playInfo);
    let data = {
        "id": localStorage.getItem("id"),
        "song": play_info.play_song,
        "artist": play_info.play_singer,
        "platform": play_info.play_platform,
        "songid": play_info.play_songid,
        "img": play_info.play_image
    }
    $.ajax({
        type: "post",
        data: data,
        url: "http://localhost:3000/star/starset",
        success: res=>{
            console.log(res.msg)
            // alert("收藏成功")
        },
        error: err=>{
            console.log(err)
        }
    })
}

showStar = function(){
    if(document.getElementById("star").style.display == "block") {
        document.getElementById("star").style.display = "none";
    } else {
        if(localStorage.getItem("username") == "null") {
            alert("请先登录")
            return
        }
        let data = {
            "id" : localStorage.getItem("id")
        }
        $.ajax({
            type: "post",
            data: data,
            url: "http://localhost:3000/star/starget",
            success: res=>{
                // localStorage.setItem("starList", res)
                starList = res
                let tpl = document.getElementById("star-element").innerHTML
                let num = 0
                let starhtml = res.reduce((pre, cur)=>{
                    let result = tpl
                        .replace("{{id}}", num++)
                        .replace("{{img}}", cur.img)
                        .replace("{{song}}", cur.song)
                        .replace("{{artist}}", cur.artist)
                    return result + pre;
                }, "")
                document.querySelector("#star").innerHTML = starhtml
                // console.log(res.msg)
            },
            error: err=>{
                console.log(err)
            }
        })
        document.getElementById("star").style.display = "block"
    }
}

clicktoplay_star = async function(obj) {
    // console.log(obj.id);
    let i = obj.id;
    let starMusic = starList[i]
    console.log("starMusic", starMusic)
    // let starList = JSON.parse(localStorage.getItem("starList"))

    let data = {
        searchMusic: starMusic.song + "_" + starMusic.artist
    }
    console.log(data)

    await $.ajax({
        type:"POST",
        url:"http://localhost:3000/searchandplay",
        data: data,
        success:res=>{
            starMusic.lyric = res.lyric
            starMusic.url = res.url
            starMusic.song = res.name
            starMusic.img = res.pic
            document.getElementById("play-source").setAttribute("src", res.url)
            document.getElementById("audio").load()
            console.log(res)

            let playInfo = {
                "play_image": res.pic,
                "play_source": res.url,
                "play_singer": res.artist,
                "play_song": res.name,
                "play_lyric": res.lyric
            };
            localStorage.setItem("play-info", JSON.stringify(playInfo)); //存在localstorage中在页面刷新后也能使用
            // updata_listen_info(playInfo);
        },
        error:err=>{
            console.log(err)
        }
    })

    document.getElementById("play-image").setAttribute("src", starMusic.img);
    // document.getElementById("play-source").setAttribute("src", starMusic.url + '?' + new Date().getTime());
    document.getElementById("play-singer").innerHTML = starMusic.artist;
    document.getElementById("play-song").innerHTML = starMusic.song;
    // document.getElementById("audio").load();
    document.location.href = '../lyric'
}