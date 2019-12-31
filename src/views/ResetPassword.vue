<template>
    <div class="el-row">
        <div class="el-col-md-8 el-col-md-offset-8 el-col-xs-24">

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>重设密码</span>
                </div>

                <el-form v-loading="loading" @submit.native.prevent="submit" :model="form" class="form-horizontal"
                         role="form" method="POST"
                         label-width="80px">
                    <el-form-item label="E-Mail" width="">
                        <el-input style="width: 300px;" auto-complete="false" id="email" type="email" name="email" v-model="form.email"
                                  required></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input style="width: 300px;" auto-complete="false" id="password" type="password" name="password"
                                  v-model="form.password"
                                  required></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input style="width: 300px;" auto-complete="false" type="password" name="confirm_password"
                                  v-model="form.confirm_password"
                                  required></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" native-type="submit">重设密码</el-button>
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
        name: 'ResetPassword',
        data: () => {
            return {
                form: {
                    email: "",
                    token: '',
                },
                loading: false,
            };
        },
        created(){
            this.form.email = this.$router.currentRoute.query['email'];
            this.form.token = this.$router.currentRoute.query['token'];
        },
        methods: {
            submit: function () {

                if (this.form.password !== this.form.confirm_password) {
                    this.$message({
                        type: "error",
                        message: "两次密码不一致",
                    });
                    return
                }

                this.loading = true;
                let credentials = JSON.parse(JSON.stringify(this.form));
                axios.post('/api/reset-password', credentials)
                    .then((response) => {
                        this.$message({
                            message: response.data.message,
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
