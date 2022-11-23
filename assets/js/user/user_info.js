$(function(){
    //用户昵称校验规则
    const form = layui.form
    const layer = layui.layer
    form.verify({
        nickname: function(value) {
            if(value.length < 6) {
                return '昵称至少为6个字符'
            }
        }
    })
    initUserInfo()
    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                layui.layer.msg('获取用户信息成功')
                //快速为表单赋值
                form.val('user_info',res.data);
            }
        })
    }
    
    //重置
    $("#btnreset").on("click",function(e){
        e.preventDefault()
        initUserInfo()
    })
    //表单提交
    $("#form_user").on("submit",function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败')
                }
                //调用index.js里面的getUserInfo()重新渲染头像欢迎。。。
                window.parent.getUserInfo()
            }
        })
    })
})