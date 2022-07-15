import { Book } from "../../classes/Book"
import { getGeneralTimeOfDayDescription } from "../../utils/util";
import { getAccount, getAccountCached, getBook, getBookLimit, getBooks, getBooksCached, getQuotes } from "../../utils/database";
import { searchBooks } from "../../utils/search";
const app = getApp()

Page({
    data: {
        username: "",
        generalTimeOfDayDescription: "",
        bookBorrowedLimit: 0,
        footerInspirationText: "",
        borrowedBookList: [],
        searchFocused: false,
        searchText: "",
    },
    async generateBorrowedBookList() {
        let books = await getBooksCached();
        let account = await getAccountCached();
        if (books === undefined || account === undefined) {
            return
        }
        let booksBorrowed = account.booksBorrowed;
        let borrowedBookList = [];
        for (let i=0;i<booksBorrowed.length;i++) {
            borrowedBookList.push(getBook(booksBorrowed[i]));
        }
        this.setData({
            borrowedBookList: borrowedBookList,
        });
    },
    searchInput(x) {
        let value = x.detail.value;
        this.setData({
            searchText: value,
        });
        searchBooks(value).then((res) =>{
            this.setData({
                searchBookList: res,
            });
        });
    },
    searchFocus() {
        this.setData({
            searchFocused: true,
        });
    },
    searchBlur() {
        this.setData({
            searchFocused: false,
        });
    },
    async onLoad() {
        wx.cloud.init();
        let quotes = await getQuotes();
        getBookLimit().then((val) => {
            this.setData({
                bookBorrowedLimit: val,
            });
        })
        getQuotes().then((val) => {
            this.setData({
                footerInspirationText: val,
            });
        })
        this.setData({
            username: "Michel",
            generalTimeOfDayDescription: getGeneralTimeOfDayDescription(),
        });

        // check for account
        getAccount().then((account) => {
            if (account === null) {
                wx.redirectTo({
                    url: '/pages/loginPage/loginPage',
                })
            } else {
                this.generateBorrowedBookList();
            }
        });
        getBooks().then(() => {
            this.generateBorrowedBookList();
        })
    },
})
