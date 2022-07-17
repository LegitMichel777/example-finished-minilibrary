import { Book } from "../../classes/Book";
let QRCode = require('../../utils/weapp-qrcode');

// pages/confirmReturn/confirmReturn.js
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
        userId: "",
        watcher: undefined,
        account: undefined,
        successful: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad: function() {
            let eventChannel = this.getOpenerEventChannel();
            eventChannel.on("userId", (data) => {
                let db = wx.cloud.database();
                this.data.watcher = db.collection("userData").where({
                    _id: data,
                }).watch({
                    onChange: (snapshot) => {
                        let newUserAccount = snapshot.docs[0];
                        this.data.account = newUserAccount;
                        let hasBook = false;
                        for (let i=0;i<newUserAccount.booksBorrowed.length;i++) {
                            if (newUserAccount.booksBorrowed[i] === this.data.book._id) {
                                hasBook = true;
                                break;
                            }
                        }
                        if (!hasBook) {
                            this.data.successful = true;
                            wx.navigateBack();
                        }
                    },
                    onError: function (err) {
                        console.error("user data watch closed due to", err);
                    }
                })
            })
            eventChannel.on("returnId", (data) => {
                // mL - identifying it as a mini library code
                // a - identifying the version
                // r - identifying the type (return code)
                let qrCodeContents = "jqLar"+data;
                let qrCode = new QRCode("returnCodeCanvas", {
                    usingIn: "",
                    text: "",
                    width: 178,
                    height: 178,
                    colorDark: "#000000",
                    colorLight: "#F2F1F6",
                    correctLevel: QRCode.CorrectLevel.H,
                });
                qrCode.makeCode(qrCodeContents);
            })
            eventChannel.on("book", (data) => {
                this.setData({
                    book: data,
                });
            })
        },
        onUnload: function() {
            if (this.data.watcher !== undefined) {
                this.data.watcher.close();
            }
            let eventChannel = this.getOpenerEventChannel();
            eventChannel.emit("update", this.data.account);
            eventChannel.emit("success", this.data.successful);
        }
    }
})
