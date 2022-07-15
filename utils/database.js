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
            let account = await database.collection("userData").where({
                openId: "{openid}",
            }).get();
            if (account.data.length === 0) {
                value = null;
            } else {
                value = account.data[0];
            }
            databaseCache.account = value;
            return value;
        }
    } else {

    }
}

export async function getBooks() {
    if (useDatabase) {
        if (databaseCache.books !== undefined) {
            return databaseCache.books;
        } else {
            let database = wx.cloud.database();
            let data = await allCollectionsData(database, "bookData");
            console.log(data);
        }
    }
}