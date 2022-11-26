$(function () {
    const form = layui.form
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //选择封面
    $("#choose").on("click", function () {
        $(".files").click()
    })
    //监听文件选择
    $(".files").on("change", function (e) {
        const files = e.target.files
        console.log(files);
        if (files.length < 1) {
            return
        }
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    getcates()
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
    //点击存为草稿
    let states = '已发布'
    $("#cao").on("click", function () {
        states = '草稿'
    })

    //给表单绑定submit事件
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()
        const fd = new FormData($(this)[0])
        fd.append('state', states)
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })

    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败')
                }
                layer.msg('发表文章成功')
                location.href = './article_lists.html'

            }
        })
    }
})