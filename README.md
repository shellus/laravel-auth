# laravel-auth
laravel jwt 对接laravel后端的扩展

1. 提供注册、登录（获取token），重设密码等路由和页面
2. 提供登陆后回调，有认证数据回调，你可以在回调中使用store储存这些数据
3. token 自动刷新


## 使用
1. 执行 `npm i -S laravel-auth`
2. 在 `main.js` 添加 
   ```js
    // 认证相关的回调处理，必须放在任何需要认证的接口请求前
    import authRegister from './bootstrap/authRegister'
    Vue.use(authRegister);
   ```
   添加文件 `src/bootstrap/authRegister.js`
   ```javascript
   import auth from "laravel-auth";
   import userStore from "../store/userStore";
   import httpErrorHandle from './httpErrorHandle'
   
   export default {
       install(vue){
           // 认证过程中的异常
           auth.httpErrorHandle = httpErrorHandle;
   
           // 登陆后储存用户数据
           auth.authAfter(() => {
               userStore.commit('setUser', auth.user())
           });
   
           // 注册到Vue，用来注销之类的操作
           vue.prototype.$auth = auth;
   
           // 页面初始化时调用认证类从localStorage恢复数据
           auth.restoreAuthData();
       }
   };

   ```
   在 `router.js` 中添加
   ```javascript
   import authRoutes from 'laravel-auth/routes'
   const router = new Router({
       mode: 'history',
       routes: [
           ...authRoutes,
           {
               path: '/',
               name: 'home',
               component: Home
           },
       ],
   });
   
   // 如果需要防止登陆后仍然跳转到登录页面，或者未登录状态跳到需要认证的页面，可以加上下面的路由守卫
   router.beforeEach(function(to, from, next) {
       if (to.name === "login" && auth.isLogin()){
           return next({name: 'home'})
       }
   
       if(['login', 'forgot_password', 'reset_password', 'register'].indexOf(to.name) === -1 && !auth.isLogin()){
           return next({name: 'login'})
       }
       return next()
   },);
   
   ```
3. 在后端项目添加 `https://packagist.org/packages/shellus/laravel-auth`


