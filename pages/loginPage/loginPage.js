// pages/loginPage/loginPage.js
import {createAccount} from "../../utils/database"
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

    },

    /**
     * 组件的方法列表
     */
    methods: {
        getUserName: async function() {
            wx.getUserProfile({
                desc: '用于记录您的名字',
                success: (res) => {
                    createAccount(res.userInfo.nickName).then( () => {
                        wx.redirectTo({
                          url: '/pages/index/index',
                        })
                    });
                }
            });
        }
    }
})
