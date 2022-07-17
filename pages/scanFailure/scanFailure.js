// pages/scanFailure/scanFailure.js
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
        errorDetail: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad: function() {
            let eventChannel = this.getOpenerEventChannel();
            eventChannel.on("errorDetail", (res) => {
                this.setData({
                    errorDetail: res,
                });
            })
        },
        okTapped: function() {
            wx.navigateBack();
        }
    }
})
