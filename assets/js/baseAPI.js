$.ajaxPrefilter(function(options){
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    //统一为有权限的接口设置headers请求头
    if(options.url.indexOf('/my/') !== -1) {
        //设置请求头有权限的访问
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    //控制用户的访问权限
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1,清除本地存储token
            localStorage.removeItem('token')
            //2,跳转至登录页
            location.href = './login.html'
        }
    }
})