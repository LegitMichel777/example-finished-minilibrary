// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    let currentDate = Date.now();
    let removeBefore = currentDate-24*60*60;
    let db = cloud.database();
    db.collection("returnRequests").where({
        requestTime: db.command.lte(removeBefore)
    }).remove();
}