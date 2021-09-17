<template>
  <div class="login_container">
      <div class="login_box">
          <div class="avater_box">
              <img src="../assets/logo.png" alt="">
          </div>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
              <el-form-item prop="username">
                  <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
               </el-form-item>
               <el-form-item prop="password">
                  <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
               </el-form-item>
               <el-form-item class="btns">
                  <el-button type="primary" round class="btn" @click="loginBtn">登录</el-button>
                  <el-button type="info" round class="btn" @click="resetBtn">重置</el-button>
               </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetBtn () {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    loginBtn () {
      this.$refs.loginFormRef.validate(async msg => {
        console.log(msg)
        if (msg === true) {
          const res = await this.axios({
            method: 'post',
            data: this.loginForm,
            url: '/login'
          })
          //   const res = await this.axios.post("login",this.loginForm)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            // 登录成功后 将token保存到sessionStorage中，以保证在登录之后才能访问其他接口
            window.sessionStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
          } else {
            return this.$message.error(res.data.meta.msg)
          }
        } else {
          return this.$message.warning('验证失败，请重新输入')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // position: absolute;
    // left: 50%;
    // transform: translate(-50%,-50%);
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: relative;
        .avater_box {
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            border-radius: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            position: absolute;
            left: 50%;
            img {
                width: 100%;
                height: 100%;
                background-color: #eee;
                border-radius: 50%;
            }
        }
        .login_form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
        }
        .btns {
            display: flex;
            justify-content: center;
            .btn {
                margin: 0 30px;
            }
        }
    }
}
</style>
