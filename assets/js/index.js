$(function () {
    getUserInfo()
    //退出功能实现
    $(".out").on("click", function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1,清除本地存储token
            localStorage.removeItem('token')
            //2,跳转至登录页
            location.href = './login.html'
            layer.close(index);
        });
    })
})
//渲染头像
function getUserInfo() {
    //发起请求获取用户信息
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        data: {},
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            render_avator(res.data)
        }
    })
}
function render_avator(user) {
    //得到名字
    const name = user.nickname || user.username
    $("#welcome").html('欢迎&nbsp&nbsp' + name)
    if (user.user_pic !== null) {
        //渲染拿到的图片
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $(".text-avator").hide()
    } else {
        //渲染文字图片
        const first = name[0].toUpperCase()
        $(".layui-nav-img").hide()
        $(".text-avator").html(first).show()
    }

}