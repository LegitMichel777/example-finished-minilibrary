import { Book } from "../../classes/Book";
import { updateBook, getBook, getBooks } from "../../utils/database";

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
        account: Object(),
        bookBorrowedLimit: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad: function() {
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.on('book', async (data) => {
                this.setData({
                    book: data,
                });
                // TODO: reget the book with the index page
                await updateBook(data._id);
                console.log(getBook(data._id));
                this.setData({
                    book: getBook(data._id),
                });
            });
            eventChannel.on("account", (data) => {
                this.setData({
                    account: data,
                });
            });
            eventChannel.on("bookBorrowedLimit", (data) => {
                this.setData({
                    bookBorrowedLimit: data,
                });
            })
        },
        borrowBook: function() {
            // TODO: react to book change
            wx.cloud.callFunction({
                name: "borrowBook",
                data: {
                    book: this.data.book._id,
                }
            });
        }
    }
})
