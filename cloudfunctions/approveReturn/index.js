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
    let adminsGet = await db.collection("constants").doc("admins").get();
    let admins = adminsGet.data.value;
    if (admins.indexOf(user._id) === -1) {
        return {status: "fail", reason: "noAdmin"};
    }

    // implicitly trust admins with their requests
    let request = event.returnRequest;
    console.log(request);
    // check if the user owns that book
    let accountGet = await db.collection("userData").doc(request.accountId).get();
    let account = accountGet.data;
    console.log(account);
    let foundBook = false;
    for (let i=0;i<account.booksBorrowed.length;i++) {
        if (account.booksBorrowed[i] === request.bookId) {
            foundBook = true;
            account.booksBorrowed.splice(i, 1);
            break;
        }
    }
    if (!foundBook) {
        return {status: "fail", reason: "alreadyReturned"};
    }
    db.collection("bookData").doc(request.bookId).update({
        data: {
            borrowedUser: null,
            borrowedUserWxName: null,
            borrowedTime: null,
        }
    });
    db.collection("userData").doc(account._id).update({
        data: {
            booksBorrowed: account.booksBorrowed,
        },
    });
    return {status: "success"};
};
