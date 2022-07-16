import allCollectionsData from "./allCollectionsData";

const useDatabase = true;
let databaseCache = Object();
export async function getBookLimit() {
    if (useDatabase) {
        if (databaseCache.bookLimit !== undefined) {
            return databaseCache.bookLimit;
        }
        let database = wx.cloud.database();
        let databaseResult = await database.collection("constants").doc("bookLimit").get();
        databaseCache.bookLimit = databaseResult.data.value;
        return databaseResult.data.value;
    } else {
        return 5;
    }
}
export async function getQuotes() {
    let value = [];
    if (useDatabase) {
        if (databaseCache.quotes !== undefined) {
            value = databaseCache.quotes;
        } else {
            let database = wx.cloud.database();
            let databaseResult = await database.collection("constants").doc("quotes").get();
            value = databaseResult.data.value;
            databaseCache.quotes = value;
        }
    } else {
        value = ["读书益脑，游戏伤身！- 李格"];
    }
    return value[Math.floor(Math.random()*value.length)];
}

export async function getAccount() {
    if (useDatabase) {
        if (databaseCache.account !== undefined) {
            return databaseCache.account;
        } else {
            let value;
            let database = wx.cloud.database();
            let account = await wx.cloud.callFunction({
                name: "getAccount",
            });
            // console.log(account);
            if (account.result.res === undefined) {
                value = null;
            } else {
                value = account.result.res;
            }
            databaseCache.account = value;
            return value;
        }
    } else {
        return [{"title": "\u5434\u59d0\u59d0\u8bb2\u5386\u53f2\u6545\u4e8b\u7b2c4\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u5386\u53f2\u6545\u4e8b\u7b2c15\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u5386\u53f2\u6545\u4e8b\u7b2c5\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u4e2d\u56fd\u795e\u8bdd\u6545\u4e8b\u96c6\u4e0a\u53e4\u65f6\u4ee3\u5377", "author": "\u8881\u73c2", "publisher": "\u4e2d\u56fd\u5c11\u5e74\u513f\u7ae5\u51fa\u7248\u793e", "isbn": "9787514852370", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u5386\u53f2\u6545\u4e8b\u7b2c8\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u5386\u53f2\u6545\u4e8b\u7b2c9\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u6545\u4e8b\u7b2c2\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u4e2d\u56fd\u795e\u8bdd\u6545\u4e8b\u96c6", "author": "\u8881\u73c2", "publisher": "\u4e2d\u56fd\u5c11\u5e74\u513f\u7ae5\u51fa\u7248\u793e", "isbn": "9787514852363", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u6545\u4e8b\u7b2c14\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u6545\u4e8b\u7b2c7\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u6545\u4e8b\u7b2c3\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u6545\u4e8b\u7b2c6\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u6545\u4e8b\u7b2c15\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        {"title": "\u5434\u59d0\u59d0\u8bb2\u6545\u4e8b\u7b2c11\u518c", "author": "\u5434\u6db5\u78a7", "publisher": "\u65b0\u4e16\u754c\u51fa\u7248\u793e", "isbn": "", "borrowedUser": null, "borrowedUserWxName": null, "borrowedTime": null},
        ]
    }
}

export async function getAccountCached() {
    if (useDatabase) {
        return databaseCache.account;
    }
}

export async function getBooksCached() {
    if (useDatabase) {
        return databaseCache.books;
    }
}

let booksCache = Object();
export async function buildBooksCache() {
    booksCache = Object();
    let books = await getBooks();
    for (let i=0;i<books.length;i++) {
        booksCache[books[i]._id] = books[i];
    }
}

export function getBook(_id) {
    return booksCache[_id];
}

export function updateCacheForBook(_id, book) {
    booksCache[_id] = book;
}

export async function getBooks() {
    if (useDatabase) {
        if (databaseCache.books !== undefined) {
            return databaseCache.books;
        } else {
            let database = wx.cloud.database();
            let data = await allCollectionsData(database, "bookData");
            let res = data.data;
            databaseCache.books = res;
            buildBooksCache();
            return res;
        }
    }
}

export async function updateBook(id) {
    if (useDatabase) {
        let database = wx.cloud.database();
        let data = await database.collection("bookData").doc(id).get();
        let newBooks = getBooks();
        for (let i=0;i<newBooks.length;i++) {
            if (newBooks[i]._id === id) {
                newBooks[i] = data.data;
            }
        }
        databaseCache.books = newBooks;
        booksCache[id] = data.data;
    }
}

export async function createAccount(wxName) {
    if (useDatabase) {
        let newAccount = {
            openId: "",
            wxName: wxName,
            booksBorrowed: [],
        };
        let res = await wx.cloud.callFunction({
            name: "createAccount",
            data: {
                wxName: wxName,
            }
        });
        databaseCache.account = newAccount;
        newAccount._id = res.result.res;
        return;
    } else {
        // TODO
    }
}