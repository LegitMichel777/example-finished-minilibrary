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
        isAdmin: false,
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
    scanFailure(reason) {
        wx.navigateTo({
            url: '/pages/scanFailure/scanFailure',
            success: (res) => {
                res.eventChannel.emit("errorDetail", reason);
            }
        })
    },
    async handleCode(code) {
        if (code.length<5) {
            this.scanFailure("扫码错误");
            return;
        }
        let beginningIdentifier = code.substr(0,3);
        if (beginningIdentifier !== "jqL") {
            this.scanFailure("扫码错误");
            return;
        }
        code = code.substr(3);
        let versionIdentifier = code[0];
        if (versionIdentifier !== 'a') {
            this.scanFailure("请更新久牵图书馆！");
            return;
        }
        code = code.substr(1);
        let codeAction = code[0];
        code = code.substr(1);
        if (codeAction === "r") {
            let database = wx.cloud.database();
            let returnBookRequest = code;
            let getRequest = await database.collection("returnRequests").where({_id: returnBookRequest}).get();
            if (getRequest.data.length === 0) {
                this.scanFailure("还书码已过期！");
                return;
            }
            let request = getRequest.data[0];
            // approve the request
            console.log(request);
            wx.cloud.callFunction({
                name: "approveReturn",
                data: {
                    returnRequest: request,
                },
            }).then((res) => {
                if (res.result.status === "fail") {
                    let reason = res.result.reason;
                    if (reason === "alreadyReturned") {
                        this.scanFailure("书已还");
                    } else if (reason === "noAdmin") {
                        this.scanFailure("您不是管理员");
                    } else {
                        this.scanFailure("服务端出现未知错误");
                    }
                }
            })

        } else {
            this.scanFailure("扫码错误");
            return;
        }
    },
    scanCode() {
        // this.handleCode("jqLarQ7_uu4KR");
        // return;

        wx.scanCode({
            onlyFromCamera: true,
            success: async (res) => {
                if (res.scanType === "QR_CODE") {
                    // handle the code
                    if (this.data.isAdmin) {
                        let code = res.result;
                        this.handleCode(code);
                    } else {
                        this.scanFailure("您不是管理员");
                        return;
                    }
                } else {
                    // handle the ISBN
                }
            }, fail(res) {
              console.error(res);
            }
        });
    },
    gotoBookDetail(book) {
        wx.navigateTo({
            url: "/pages/detail/detail",
            success: (res) => {
                res.eventChannel.emit("book", book);
                res.eventChannel.emit("account", this.data.account);
                res.eventChannel.emit("bookBorrowedLimit", this.data.bookBorrowedLimit);
                res.eventChannel.on("update", (newAccount) => {
                    this.setData({
                        account: newAccount,
                    });
                    this.generateBorrowedBookList();
                    this.updateSearch();
                }) 
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
        getAccount().then(async (account) => {
            if (account === null) {
                wx.redirectTo({
                    url: '/pages/loginPage/loginPage',
                })
            } else {
                let database = wx.cloud.database();
                let admins = await database.collection("constants").doc("admins").get();
                if (admins.data.value.indexOf(account._id) === -1) {
                    this.setData({
                        isAdmin: false,
                    });
                } else [
                    this.setData({
                        isAdmin: true,
                    })
                ]
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
