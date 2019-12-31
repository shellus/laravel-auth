<template>
    <div class="el-row">
        <div class="el-col-md-8 el-col-md-offset-8 el-col-xs-24">

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>找回密码</span>
                </div>

                <el-form v-loading="loading" @submit.native.prevent="submit" :model="form" class="form-horizontal"
                         role="form" method="POST"
                         label-width="80px">
                    <el-form-item label="E-Mail" width="">
                        <el-input style="width: 300px;" id="email" type="email" name="email" v-model="form.email" required
                                  autofocus></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button type="primary" native-type="submit">发送邮件</el-button>
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
        name: 'ForgotPassword',
        data: () => {
            return {
                form: {
                    email: "",
                    validate_code: '',
                },
                loading: false,
            };
        },
        methods: {
            submit: function (event) {

                // 修复ios chrome自动填充不响应的问题
                this.form.email = event.target.querySelector("[name=email]").value;

                this.loading = true;
                let credentials = JSON.parse(JSON.stringify(this.form));
                axios.post('/api/forgot-password', credentials)
                    .then((response) => {
                        this.$message({
                            message: response.data.message,
                            type: 'success',
                            onClose: () => {
                                this.$router.replace({name: 'login'})
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
