// express superagent
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
// 导入代理模块
var superAgent = require("superagent");
var app = express();
app.use(express.static("www"));
// 手机号码和验证码
app.use(bodyParser.urlencoded({ extended: false }));

var tel;
console.log(tel);
app.get("/setcode", function (req, res) {
    // req.query
    console.log(req.query);
   
    var url = "http://sms.tehir.cn/code/sms/api/v1/send?srcSeqId=123&account=18046018464&password=180460184644&mobile=" + req.query.tel + "&code=" + req.query.code + "&time=1";
    superAgent.get(url).end(function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json(data.body);
        }
    });
    tel=req.query.tel;
    console.log(tel);
    // var fileName = "users/" + req.query.tel + ".txt";
    // fs.exists(fileName, function(exists2) {
    //     if (exists2) {
    //         //					用户存在
    //         res.send("<script>alert('错误')</script>");
    //     } 
    // });
});

app.post("/register", function(req, res) {


    req.body.tel = tel;
    console.log(req.body);


        
        console.log(tel);
        var fileName = "users/" + req.body.tel + ".txt";
        fs.exists("users", function(exists) {
            if (exists) {
                //			有
                fs.exists(fileName, function(exists2) {
                    if (exists2) {
                        					// 用户存在
                        res.status(200).json({
                            info: "用户已存在",
                            code: 1
                        });
                        // res.send("<script>alert('用户名存在')</script>");
                    } else {
                        writeFile();
                    }
                });

            } else {
                //			不存在users文件夹
                fs.mkdir("users", function(err) {

                    if (err) {
                        res.status(200).json({
                            info: "创建users文件夹失败，系统错误",
                            code: 2
                        });
                    } else {
                        //					写入文件
                        writeFile();

                    }
                });

            }
        
    });
    function writeFile() {
        req.body.tel =tel;
        fs.writeFile(fileName, JSON.stringify(req.body), function(err) {
            if (err) {
                res.status(200).json({
                    info: "用户注册失败，系统错误",
                    code: 3
                });
            } else {
                res.status(200).json({
                    info: "注册成功",
                    code: 0
                });
            }
        });

    }
});

// 登入

app.post("/login", function(req, res) {
    console.log(req.body);
    var fileName = "users/" + req.body.user + ".txt";

    fs.exists(fileName, function(ex) {
        if (ex) {

            fs.readFile(fileName, function(err, data) {
                var data = data.toString();
                data = JSON.parse(data);
                if (data.password == req.body.password) {

                    res.status(200).json({
                        info: "登录成功",
                        code: 0
                    });
                } else {
                    res.status(200).json({
                        info: "密码错误，请重新登录",
                        code: 2
                    });
                }
            });
        } else {
            // 不存在
            res.status(200).json({
                info: "该用户不存在，请重新登录",
                code: 1
            });

        }
    });
});
app.listen("3000", function () {
    console.log("服务器开启中......");
});