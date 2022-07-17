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
    if (existingUser.data.length===0) {
        return {status: "fail"};
    }
    let user = existingUser.data[0];

    let bookId = event.book;
    let foundUserBookBorrowedIndex = -1;
    for (let i=0;i<user.booksBorrowed.length;i++) {
        if (user.booksBorrowed[i] === bookId) {
            foundUserBookBorrowedIndex = i;
        }
    }

    if (foundUserBookBorrowedIndex === -1) {
        return {status: "fail"};
    }

    let randomCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let requestReturnId = "";
    for (let i=0;i<8;i++) {
        requestReturnId += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
    }

    let res = await db.collection("returnRequests").add({
        data: {
            _id: requestReturnId,
            accountId: user._id,
            bookId: bookId,
            requestTime: Date.now(),
        }
    });
    console.log(res);
    return {
        status: "success",
        res: res._id,
    }
};
