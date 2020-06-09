import axios from "axios/index";

/**
 * 认证管理类
 */
export default (function () {
    // 注销回调
    let logoutAfters = [];
    // 登录回调
    let loginAfters = [];
    // 有了认证数据后，包括登陆后和刷新页面从localStorage取出后
    let authAfters = [];

    // 内部调用：触发登录事件（一般用作登陆后页面跳转）
    let _callLoginAfter = function () {
        loginAfters.map(call => call())
    };
    // 内部调用：触发退出登录事件
    let _callLogoutAfter = function () {
        logoutAfters.map(call => call())
    };
    // 内部调用：触发认证数据事件
    let _callAuthAfter = function () {
        authAfters.map(call => call())
    };

    let _defaultErrorHandle = function (e) {
        alert(e.message)
    }

    // 处理认证成功响应
    // 会记录token和token过期时间戳到本地储存
    let _storeAuthData = function (data) {
        localStorage.expiresTimestamp = (new Date()).getTime() + (data.expires_in * 1000);
        localStorage.token = data.access_token;
        localStorage.client_code = data.client_code;
        localStorage.user = JSON.stringify(data.user);
        if (data.roles) {
            localStorage.roles = JSON.stringify(data.roles);
        }
    };
    // 删除认证凭证，可能是手动退出登录，
    // 或者是服务器认为凭证无效，所以本地就删掉无效凭证
    let _clearAuthData = function () {
        localStorage.removeItem('expiresTimestamp');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
    };

    let _refreshTokenPromise;

    return {

        /**
         * 注册登陆后回调
         * @param call
         * @returns {number}
         */
        loginAfter: function (call) {
            loginAfters.push(call)
        },

        // 注销后触发，可以用来注销后跳转到登录页
        // 销毁认证才有的资源等
        logoutAfter: function (call) {
            logoutAfters.push(call)
        },
        // 认证数据，说白了就是有token后
        // 这个和loginAfter不同的是多了页面刷新后从localStore取出token后
        authAfter: function (call) {
            authAfters.push(call)
        },

        // 内部调用：触发有认证数据事件
        // 返回当前是否登录
        isLogin: () => localStorage.hasOwnProperty('token'),
        // 从本地储存恢复认证数据
        // 一般是在刷新页面后这样的场景调用
        // 会触发onAuth() 回调
        restoreAuthData: function () {
            this.isLogin() && _callAuthAfter()
        },

        user() {
            if (localStorage.hasOwnProperty('user'))
                return JSON.parse(localStorage.user);
            else return null;
        },
        roles() {
            if (localStorage.hasOwnProperty('roles'))
                return JSON.parse(localStorage.roles);
            else return null;
        },
        // 刷新token，返回刷新后的token
        async refreshToken() {
            let response;
            let config = {headers: {Authorization: `Bearer ${localStorage.token}`}};
            try {
                response = await axios.post('/api/refresh', {client_code: localStorage.client_code}, config);
            } catch (e) {
                this.httpErrorHandle(e)
                throw e
            }
            return response.data;
        },
        // 获取token
        // 如果检测到token过期，会请求刷新token并醍醐按本地记录的token
        // 如果刷新失败，会进入注销流程，清除本地凭证、触发注销事件
        async token() {

            // 过期前10秒，则先刷新token再继续业务请求
            let deadline = (new Date()).getTime() - localStorage.expiresTimestamp;
            if (deadline < -10000) {
                return localStorage.token;
            }
            // 刷新token
            try {
                return new Promise((resolve, reject) => {
                    // 第一次刷新
                    if (!_refreshTokenPromise) {
                        _refreshTokenPromise = this.refreshToken();
                        _refreshTokenPromise
                            .then((data) => {
                                _storeAuthData(data);
                            })
                            .catch(reject)
                            .finally(() => _refreshTokenPromise = null);
                    }
                    // 后面的刷新直接只等结果，别的都不做
                    _refreshTokenPromise.then((data) => {
                        resolve(data.access_token);
                    });
                });

            } catch (e) {
                // 刷新token失败，进入注销流程，
                // 因为已经无权限，所以不调用注销api

                // 删除认证凭证
                _clearAuthData();
                // 通知注销回调
                _callLogoutAfter();

                // 抛出异常到上层
                throw e;
            }
        },

        // 登录
        // 成功会记录token
        // 并且保存用户数据
        // 然后触发登录成功回调
        async login(credentials) {
            let postData = JSON.parse(JSON.stringify(credentials));
            let response;
            postData.client_code = localStorage.client_code;
            response = await axios.post('/api/login', postData);
            _storeAuthData(response.data);
        },
        // 用户主动退出登录状态
        // 调用后端注销api
        // 无论成功失败都会删除本地凭证触发注销事件
        async logout() {
            try {
                await axios.post('/api/logout', {}, {headers: {Authorization: `Bearer ${localStorage.token}`}})
            } catch (e) {
                this.httpErrorHandle(e)
                throw e
            } finally {
                // 删除认证凭证
                _clearAuthData();
                // 通知注销回调
                _callLogoutAfter();
            }
        },
        // 内部页面调用的
        _callLoginAfter: _callLoginAfter,
        _callAuthAfter: _callAuthAfter,
        _callLogoutAfter: _callLogoutAfter,
        _clearAuthData: _clearAuthData,

        // 认证过程中的错误处理， 默认使用alert弹出，可以覆盖这个成员实现异常自定义处理
        httpErrorHandle: _defaultErrorHandle,
    };
})()
