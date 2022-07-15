import {Book} from "../../classes/Book"
import { getGeneralTimeOfDayDescription } from "../../utils/util";
import { getAccount, getBookLimit, getBooks, getQuotes } from "../../utils/database";
const app = getApp()

Page({
    data: {
        username: "",
        generalTimeOfDayDescription: "",
        bookBorrowedLimit: 0,
        footerInspirationText: "",
        borrowedBookList: []
    },
    async onLoad() {
        wx.cloud.init();
        let limit = await getBookLimit();
        let quotes = await getQuotes();
        this.setData({
            username: "Michel",
            generalTimeOfDayDescription: getGeneralTimeOfDayDescription(),
            bookBorrowedLimit: limit,
            footerInspirationText: quotes,
        });

        // check for account
        let account = await getAccount();
        if (account === null) {
            // create account
        }
        console.log(account);
        getBooks();

        let borrowedBookList = [new Book("id", "isbn", "title", "author", "publisher", "borrowedUser", 0), new Book("id2", "isbn2", "title2", "author2", "publisher2"), new Book("id3", "isbn3", "title3", "author3", "publisher3")];
        this.setData({
            borrowedBookList: borrowedBookList,
        });
    },
})
