$(function(){
    $("#link_reg").on("click",function(e){
        $(".login").hide()
        $(".reg").show()
    })
    $("#link_login").on("click",function(e){
        $(".login").show()
        $(".reg").hide()
    })
    //自定义校验规则表单验证
    const form = layui.form
    const layer = layui.layer
    form.verify({
        password: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        repass:function(value){
            const password = $(".reg [name=password]").val()
            if (value !== password) {
                return '两次密码不一致'
            }
        }
    })
    //登录发起登录请求
    $("#form_login").on("submit",function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/login',
            data: $(this).serialize(),
            success:function(res) {
                if (res.status !== 0 ) {
                    return layer.msg('登录失败:' + res.message); 
                }
                layer.msg('登录成功')
                localStorage.setItem('token',res.token)
                location.href = './index.html'

            }

        })
        
    })

    //注册发起注册请求
    $("#form_reg").on("submit",function(e){
        e.preventDefault()
        $.post('/api/reguser',{username:$(".reg [name=username]").val(),password:$(".reg [name=repassword]").val()},function(res){
            if (res.status !== 0 ) {
                return layer.msg('注册失败:' + res.message); 
            }
            layer.msg('注册成功，请登录'); 
            $("#link_login").click()
        })
    })

})