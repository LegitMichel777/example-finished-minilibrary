'use strict';

const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
    let db = cloud.database();
    const wxContext = cloud.getWXContext();
    let openId = wxContext.OPENID;
    let newAccountObject = {
        openId: openId,
        wxName: event.wxName,
        booksBorrowed: []
    };
    let existingUser = await db.collection("userData").where({
        openId: openId,
    }).get();
    if (existingUser.data.length>0) {
        return;
    }
    let res = await db.collection("userData").add({data: newAccountObject});
    return { res: res._id};
};
