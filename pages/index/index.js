import { Book } from "../../classes/Book"
import { getGeneralTimeOfDayDescription } from "../../utils/util";
import { getAccount, getAccountCached, getBook, getBookLimit, getBooks, getBooksCached, getQuotes } from "../../utils/database";
import { searchBooks } from "../../utils/search";
const app = getApp()

Page({
    data: {
        account: null,
        generalTimeOfDayDescription: "",
        bookBorrowedLimit: 0,
        footerInspirationText: "",
        borrowedBookList: [],
        searchBookList: [],
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
    updateSearch() {
        searchBooks(this.data.searchText).then((res) =>{
            this.setData({
                searchBookList: res,
            });
        });
    },
    searchInput(x) {
        let value = x.detail.value;
        this.setData({
            searchText: value,
        });
        console.log(this.data.searchText);
        this.updateSearch();
    },
    searchFocus() {
        this.setData({
            searchFocused: true,
        });
        this.updateSearch();
    },
    searchBlur() {
        if (this.data.searchText === "") {
            this.setData({
                searchFocused: false,
            });
        }
    },
    gotoBookDetail(book) {
        wx.navigateTo({
            url: "/pages/detail/detail",
            success: (res) => {
                res.eventChannel.emit("book", book);
                res.eventChannel.emit("account", this.data.account);
                res.eventChannel.emit("bookBorrowedLimit", this.data.bookBorrowedLimit);
            }
        })
    },
    bookBorrowedDetail(x) {
        let book = this.data.borrowedBookList[x.currentTarget.dataset.index];
        this.gotoBookDetail(book);
    },
    bookSearchDetail(x) {
        let book = this.data.searchBookList[x.currentTarget.dataset.index];
        this.gotoBookDetail(book);
    },
    async onLoad() {
        wx.cloud.init();
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
            generalTimeOfDayDescription: getGeneralTimeOfDayDescription(),
        });

        // check for account
        getAccount().then((account) => {
            if (account === null) {
                wx.redirectTo({
                    url: '/pages/loginPage/loginPage',
                })
            } else {
                this.setData({
                    account: account,
                });
                this.generateBorrowedBookList();
            }
        });
        getBooks().then(() => {
            this.generateBorrowedBookList();
        })
    },
})
