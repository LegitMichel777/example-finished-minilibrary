import { Book } from "../../classes/Book";
import { updateBook, getBook, updateCacheForBook } from "../../utils/database";

// pages/detail/detail.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        book: undefined,
        account: undefined,
        bookBorrowedLimit: undefined,
        borrowButtonText: "",
        borrowButtonEnabled: false,
        borrowButtonMode: null,
        successText: null,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        refreshBorrowedButtonStatus: function() {
            this.data.borrowButtonMode = null;
            if (this.data.book === undefined) {
                return;
            }
            if (this.data.account === undefined) {
                return;
            }
            if (this.data.bookBorrowedLimit === undefined) {
                return;
            }
            if (this.data.book.borrowedUser !== null) {
                // book has been borrowed
                if (this.data.book.borrowedUser === this.data.account._id) {
                    this.setData({
                        borrowButtonMode: "return-book",
                        borrowButtonEnabled: true,
                        borrowButtonText: "还书",
                    });
                } else {
                    this.setData({
                        borrowButtonMode: "other-have-book",
                        borrowButtonEnabled: false,
                        borrowButtonText: `${this.data.book.borrowedUserWxName}已借`,
                        successText: null,
                    });
                }
            } else {
                // book is not borrowed
                if (this.data.account.booksBorrowed.length >= this.data.bookBorrowedLimit) {
                    this.setData({
                        borrowButtonMode: "cannot-borrow-maxed-out",
                        borrowButtonEnabled: false,
                        borrowButtonText: "租借",
                        successText: null,
                    });
                } else {
                    // i can borrow!
                    this.setData({
                        borrowButtonMode: "borrow-book",
                        borrowButtonEnabled: true,
                        borrowButtonText: "租借",
                    });
                }
            }
        },
        onLoad: function() {
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.on('book', async (data) => {
                this.setData({
                    book: data,
                });
                this.refreshBorrowedButtonStatus();
                await updateBook(data._id);
                this.setData({
                    book: getBook(data._id),
                });
                this.refreshBorrowedButtonStatus();
            });
            eventChannel.on("account", (data) => {
                this.setData({
                    account: data,
                });
                this.refreshBorrowedButtonStatus();
            });
            eventChannel.on("bookBorrowedLimit", (data) => {
                this.setData({
                    bookBorrowedLimit: data,
                });
                this.refreshBorrowedButtonStatus();
            })
        },
        borrowBook: function() {
            if (this.data.borrowButtonMode === "borrow-book" || this.data.borrowButtonMode === "other-have-book") {
                wx.cloud.callFunction({
                    name: "borrowBook",
                    data: {
                        book: this.data.book._id,
                    }
                }).then((res) => {
                    if (res.result.status === "success") {
                        this.data.account.booksBorrowed.push(this.data.book._id);
                        let newBook = this.data.book;
                        newBook.borrowedUser = this.data.account._id;
                        newBook.borrowedUserWxName = this.data.account.wxName;
                        this.setData({
                            book: newBook,
                            successText: "已成功租借！"
                        });
                        updateCacheForBook(newBook._id, newBook);
                        this.refreshBorrowedButtonStatus();
                    }
                });
            } else if (this.data.borrowButtonMode === "return-book") {
                wx.cloud.callFunction({
                    name: "requestReturn",
                    data: {
                        book: this.data.book._id,
                    }
                }).then((res) => {
                    if (res.result.status === "success") {
                        let requestId = res.result.res;
                        wx.navigateTo({
                            url: "/pages/confirmReturn/confirmReturn",
                            success: (res) => {
                                res.eventChannel.emit("returnId", requestId);
                                res.eventChannel.emit("book", this.data.book);
                                res.eventChannel.emit("userId", this.data.account._id);
                                res.eventChannel.on("update", (newAccount) => {
                                    this.setData({
                                        account: newAccount,
                                    });
                                    this.refreshBorrowedButtonStatus();
                                })
                                res.eventChannel.on("success", (data) => {
                                    if (data === true) {
                                        let newBook = this.data.book;
                                        newBook.borrowedUser = null;
                                        newBook.borrowedUserWxName = null;
                                        this.setData({
                                            book: newBook,
                                            successText: "已成功还书！"
                                        });
                                        this.refreshBorrowedButtonStatus();
                                    }
                                })
                            }                            
                        })
                    }
                })
            }
        },
        onUnload: function() {
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.emit("update", this.data.account);
        }
    }
})
