<template>
    <div class="el-row">
        <div class="el-col-md-8 el-col-md-offset-8 el-col-xs-24">

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>注册</span>
                </div>

                <el-form v-loading="loading" @submit.native.prevent="submit" :model="form" class="form-horizontal"
                         role="form" method="POST"
                         label-width="80px">
<!--                    <el-form-item label="用户名">-->
<!--                        <el-input id="name" type="text" name="name" v-model="form.name" required-->
<!--                                  autofocus></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="E-Mail">
                        <el-input id="email" type="email" name="email" v-model="form.email" required
                                  ></el-input>
                    </el-form-item>

                    <el-form-item label="密码">
                        <el-input id="password" type="password" name="password"
                                  v-model="form.password"
                                  required></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input type="password" name="confirm_password"
                                  v-model="form.confirm_password"
                                  required></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button type="primary" native-type="submit">注册</el-button>
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
        name: 'Register',
        data: () => {
            return {
                form: {
                    email: "",
                    password: "",
                    confirm_password: "",
                },
                loading: false,
            };
        },
        methods: {
            submit: function (event) {

                // 修复ios chrome自动填充不响应的问题
                this.form.email = event.target.querySelector("[name=email]").value;
                this.form.password = event.target.querySelector("[name=password]").value;

                if (this.form.password !== this.form.confirm_password) {
                    this.$message({
                        type: "error",
                        message: "两次密码不一致",
                    });
                    return
                }

                this.loading = true;
                let credentials = JSON.parse(JSON.stringify(this.form));
                axios.post('/api/register', credentials)
                    .then((response) => {
                        console.log(response.data);
                        this.$message({
                            message: "注册成功, 1秒后自动跳转到登录页面",
                            showClose: true,
                            duration: 1000,
                            type: 'success',
                            onClose: () => {
                                this.$router.push({name: 'login'})
                            },
                        });
                    })
                    .catch(auth.httpErrorHandle)
                    .finally(() => {
                        this.loading = false;
                    });
            },
        },
    }
</script>
