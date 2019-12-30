import Login from './views/Login.vue'
import Register from "./views/Register";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";

export default [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/forgot-password',
        name: 'forgot_password',
        component: ForgotPassword
    },
    {
        path: '/reset-password',
        name: 'reset_password',
        component: ResetPassword
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
]
