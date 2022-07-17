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
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad: function() {
            let eventChannel = this.getOpenerEventChannel();
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
        }
    }
})
