$(function () {
    const layer = layui.layer
    const form = layui.form
    const q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    //补0函数
    function zero(n) {
        n = n < 10 ? '0' + n : n
        return n
    }

    //格式化时间
    template.defaults.imports.formatdate = function (vdate) {
        const date = new Date(vdate)
        const year = date.getFullYear()
        const month = zero(date.getMonth() + 1)
        const day = zero(date.getDate())

        const hh = zero(date.getHours())
        const mm = zero(date.getMinutes())
        const ss = zero(date.getSeconds())
        return year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ":" + ss

    }
    //获取文章列表
    getlists()
    getcates()
    function getlists() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                const htmlstr = template('art_lists', res)
                $("tbody").html(htmlstr)
                renderPage(res.total)
            }
        })
    }

    //获取文章分类列表并渲染下拉框
    function getcates() {
        $.ajax({
            mtehod: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                layer.msg('获取文章分类列表成功')
                //调用模板u引擎
                const htmlstr = template('select_cate', res)
                $('#cate_name').html(htmlstr)
                form.render()
            }
        })
    }

    //筛选实现
    $("#select-cate").on("submit", function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        getlists()
    })
     //编辑文章
     $('body').on('click', '#edit_art', function () {
        // module.exports.id = $(this).attr('data-id')
        const id = $(this).attr('data-id')
        console.log(id);
        
        location.href = './article_edit.html'
    })
    //根据id删除文章数据
    $('body').on('click', '#del_art', function () {
        const id = $(this).attr('data-id')
        // 获取删除按钮的个数
        var len = $(".del").length
        console.log(len);
        //发起删除请求
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章失败')
                }
                layer.msg('删除文章成功')
                if (len === 1) {
                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    // 页码值最小必须是 1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                }
                getlists()
            }
        })
    })

    //分页渲染
    function renderPage(total) {
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize,
                curr: q.pagenum,
                limits: [2, 3, 5, 8, 10],
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    //得到当前页，以便向服务端请求对应页的数据。
                    q.pagenum = obj.curr
                    //得到每页显示的条数
                    q.pagesize = obj.limit

                    //首次不执行
                    if (!first) {
                        //do something
                        getlists()
                    }
                }
            });
        });
    }

})