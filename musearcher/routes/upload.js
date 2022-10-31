var express = require('express');
const { Collection } = require('mongoose');
var router = express.Router();
var fs = require("fs");
var multer  = require('multer')
var multiparty = require('multiparty');

const database = require('../db');


/* GET home page. */
router.get('/', function(req, res, next) {
  
    res.render('upload');
  
});

router.post('/', function(req, res, next) {
  
    // console.log(req.files);  // 上传的文件信息
    // console.log(req);

    let form = new multiparty.Form();
    form.parse(req, (err,fields,file)=>{
        console.log(file)

        var des_file = "upload_music" + "/" + file.avatar[0].originalFilename; //文件名
        fs.readFile(file.avatar[0].path, function(err, data) {  // 异步读取文件内容
            fs.writeFile(des_file, data, function(err) { // des_file是文件名，data，文件数据，异步写入到文件
                if(err){
                    console.log(err);
                }else{

                    let sql = "INSERT INTO uploadmusic SET name=?,userid=?"
                    let sqlArr = [file.avatar[0].originalFilename, file.id]
                    database.query(sql, sqlArr, (err, data)=>{
                        if(err) {
                            console.log('error in upload database:', err)
                            return;
                        }
                    }) 
                    // 文件上传成功，respones给客户端
                    response = {
                        message:'File uploaded successfully', 
                        filename: file.avatar[0].originalFilename
                    };
                }
                console.log( response );
                res.end( JSON.stringify( response ) );
            });
        });
    })
})



module.exports = router;

