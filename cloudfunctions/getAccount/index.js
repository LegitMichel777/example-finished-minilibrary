'use strict';

const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
    let db = cloud.database();
    const wxContext = cloud.getWXContext();
    let openId = wxContext.OPENID;
    let existingUser = await db.collection("userData").where({
        openId: openId,
    }).get();
    if (existingUser.data.length>0) {
        return { res: existingUser.data[0]};
    }
    return { res: undefined };
};
