<template>
    <div class="el-row">
        <div class="el-col-md-8 el-col-md-offset-8 el-col-xs-24">

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>登录</span>
                </div>

                <el-form v-loading="loading" @submit.native.prevent="submit" :model="form" class="form-horizontal"
                         role="form" method="POST"
                         label-width="80px">
                    <el-form-item label="E-Mail">
                        <el-input id="email" type="email" name="email" v-model="form.email" required
                                  autofocus></el-input>
                    </el-form-item>

                    <el-form-item label="密码">
                        <el-input id="password" type="password" name="password"
                                  v-model="form.password"
                                  required></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button type="primary" native-type="submit">登录</el-button>
                        <div style="display: inline-block;width: 30px;"></div>
                        <el-link type="" @click="forgotPassword">忘记密码</el-link>
                        <div style="display: inline-block;width: 30px;"></div>
                        <el-link type="" @click="register">注册</el-link>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import auth from '../auth'

    export default {
        name: 'Login',
        data: () => {
            return {
                form: {
                    email: "",
                    password: "",
                },
                loading: false,
            };
        },
        methods: {
            submit: function (event) {

                // 修复ios chrome自动填充不响应的问题
                this.form.email = event.target.querySelector("[name=email]").value;
                this.form.password = event.target.querySelector("[name=password]").value;

                this.loading = true;
                auth.login(this.form)
                    .then(() => {
                        this.$message({
                            message: "登录成功, 1秒后自动跳转到首页",
                            showClose: true,
                            duration: 1000,
                            type: 'success',
                            onClose: () => {
                                auth._callLoginAfter();
                            },
                        });
                    })
                    .catch(auth.httpErrorHandle)
                    .finally(() => {
                        this.loading = false;
                    });
            },
            forgotPassword()
            {
                this.$router.push({name: 'forgot_password'})
            },
            register()
            {
                this.$router.push({name: 'register'})
            }
        },
    }
</script>
