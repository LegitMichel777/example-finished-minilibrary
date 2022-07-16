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
    let bookBorrowLimit = await db.collection("constants").doc("bookLimit").get();
    let limit = bookBorrowLimit.data.value;
    if (user.booksBorrowed.length<limit) {
        // attempt to borrow the book
        // grab the book
        let bookGet = await db.collection("bookData").doc(event.book).get();
        if (bookGet.data === undefined) {
            return {status: "fail"};
        }
        let book = bookGet.data;
        if (book.borrowedUser !== null) {
            return {status: "fail"};
        }
        user.booksBorrowed.push(event.book);
        // borrow!
        book.borrowedUser = user._id;
        db.collection("bookData").doc(event.book).update({
            data: {
                borrowedUser: user._id,
                borrowedUserWxName: user.wxName,
                borrowedTime: Date.now(),
            }
        });
        db.collection("userData").doc(user._id).update({
            data: {
                booksBorrowed: user.booksBorrowed,
            },
        });
        return {status: "success"};
    }
    return {status: "fail"};
};
