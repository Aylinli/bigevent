$(function(){
    const layer = layui.layer
    const form = layui.form
    getcates()
    //获取初始化文章分类列表
    function getcates() {
        //发起ajax请求
        $.ajax({
            mtehod: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                layer.msg('获取文章分类列表成功')
                //调用模板u引擎
                const htmlstr = template('temp-cate',res)
                $('tbody').html(htmlstr)
            }
        })
    }
    //添加类别渲染页面
    let addindex = ''
    $("#add_cate").on("click",function(){
        addindex = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['450px', '250px'],
            content: $("#cate_add").html()
        });               
    })
    //新增文章分类
    $("body").on("submit","#cateadd",function(e){
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败')
                }
                layer.msg('新增文章分类成功')
                layer.close(addindex); //此时你只需要把获得的index，轻轻地赋予layer.close即可
                getcates()
            }
        })
    })
    //编辑文章分类渲染页面
    let editindex = ''
    $('body').on("click","#edit_art",function(){
        //弹出层显示
        editindex = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['450px', '250px'],
            content: $("#cate_edit").html()
        });
        //根据id获取文章分类数据
        const id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('根据id获取文章分类数据失败')
                }
                layer.msg('根据id获取文章分类数据成功')
                //快速为表单赋值
                console.log(res.data);
                form.val('form-edit',res.data)
            }
        })
    })
    //根据 Id 更新文章分类数据
    $("body").on("submit","#cateedit",function(e){
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类失败')
                }
                layer.msg('更新文章分类成功')
                layer.close(editindex); //此时你只需要把获得的index，轻轻地赋予layer.close即可
                getcates()
            }
        })
    })

    // 根据 Id 删除文章分类
    $('body').on("click","#del_art",function(){
        const id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('根据id删除文章分类数据失败')
                }
                layer.msg('根据id删除文章分类数据成功')
                getcates()
                
            }
        })
    })

})