$(function(){
    //定义验证规则
    const form = layui.form
    form.verify({
        pass:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samepwd: function(value) {
            if (value === $("[name=oldPwd]").val()){
                return '两次密码不能一致'
            }
        },
        diff: function(value) {
            if (value !== $("[name=newPwd]").val()){
                return '两次密码输入不一致'
            }
        }
        
    })
    //修改密码发起请求
    $("#form_pwd").on("submit",function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('重置密码失败')
                }
                layui.layer.msg('重置密码成功')
                $("#form_pwd")[0].reset()
            }
        })
    })


})