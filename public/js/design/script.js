/**
 * Created by Front on 13.07.2016.
 */
var upload_file = [];
function dark_disable () {
    _active(".makeup-modal","deactive");
};
function prepareUpload(event)
{
    var current = $(this);
    var files = event.target.files;
    event.stopPropagation();
    event.preventDefault();
    var data = new FormData();
    data.append("action", "import");
    $.each(files, function(key, value)
    {
        data.append(key, value);
    });
    data.append("id", $(".set-option").attr("id-section"));
    data.append("hidden", current.parent().parent().find("input[type=hidden]").attr("name"));
    $.ajax({
        url: 'uploadFile',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(data)
        {
            current.parent().parent().find("input[type=hidden]").val(data.url);
        }
    });
}
function loading_screen () {
    $("body").append("<div class='makeup-load'></div>");
    $.ajax({
       url:"preloader",
       success: function (data) {
           $(".makeup-load").html(data);
           Bricks();
           $(".makeup-load").fadeTo( "fast" , 1.0 , function() {

           });
       },
        error:function () {
            $(".makeup-load").remove();
        }
    });


};
function complete_screen () {
    $(".makeup-load").fadeTo( "slow" , 0.0, function() {
        $(".makeup-load").remove();
    })

};

function get_option(name_pack,name_template,id_section) {
    var container_option = $(".makeup-modal.option .makeup-modal-container");
    container_option.html("");
    $.ajax({
        url: 'block',
        type:"post",
        data: {
            action : "block.get",
            name_pack : name_pack,
            name_template : name_template,
            id_section : id_section
        },
        beforeSend : loading_screen,
        success:function (data) {
            complete_screen();
            container_option.html(data);
            $(".makeup-modal.option").toggleClass("active", true);
            $(".dark").fadeTo( "fast" , 0.3, function() { })
            $(".dark").bind("click",dark_disable);
            $('.makeup-modal').on('change',"input[type=file]", prepareUpload);
            var dropify = $('input[type=file]').dropify();
            attachDropifyEvent(dropify);
            $(".makeup-modal.option").on("submit","form.set-option",_send_option);

        },
        error:function () {
            complete_screen();
            container_option.html("Ошибка");
            $(".makeup-modal.option").toggleClass("active", true);
            $(".dark").fadeTo( "fast" , 0.3, function() { })
            $(".dark").bind("click",dark_disable);
        }
    });
}
function attachDropifyEvent(selector){
    selector.on('dropify.afterClear', function(event, element){
        $(this).parent().parent().find("input[type=hidden]").val("");
    });
}

function _active(selector,action) {
    if (action == "active"){
        $("body").append("<div class='dark'> </div>");
        $(".dark").fadeTo( "fast" , 0.2, function() {

        });
    }
    else if (action == "deactive"){
        $(".dark").unbind("click",dark_disable);
        $(".dark").fadeTo( "fast" , 0.2, function() {
            $(selector).toggleClass("active", false);
            $(".dark").fadeTo( "fast" , 0.0, function() {
                $(".dark").remove();
            })

        });
    }
    else {
        $(selector).toggleClass("active");
    }
}

function _send_option() {
    var current = $(this);
    var id_section = current.attr("id-section");
    var arr_data = current.serializeArray();
    $.ajax({
        url : 'block',
        type : "post",
        data : {
            action : "block.set",
            "options" : arr_data,
            "id-section" : id_section,
        },
        beforeSend : loading_screen,
        success:function (data) {
            $(current.attr("update-block")).html(data);
            complete_screen();
            $(".makeup-modal.option").toggleClass("active", false);
            $(".dark").fadeTo( "fast" , 0.0, function() {
                dark_disable();
                $(".dark").remove();
            });
            upload_file = [];
        },
        error:function () {
            complete_screen();
            $(".makeup-modal.option").toggleClass("active", true);
            $(".dark").fadeTo( "fast" , 0.3, function() { })
            $(".dark").bind("click",dark_disable);
            dark_disable();
        }
    });
    return false;
}


$(document).ready(function () {
    $(".makeup-designer").on("click",".makeup-edit",function () {
        var name_pack = $(this).attr("name-pack");
        var name_template = $(this).attr("name-template");
        var id_section = $(this).attr("id-section");
        get_option(name_pack,name_template,id_section);
       _active(".makeup-modal.option","active");
    });
    $("body").on("click",".makeup-add-button",function () {
        var current = $(this);
        _active(".makeup-modal.pack_browser","active");
        $(".makeup-modal.pack_browser").toggleClass("active");
        $.ajax({
            url: 'packs',
            type:"post",
            dataType:"json",
            data: {
                action : "get_packs"
            },
            success:function (data) {
                var ajaxData = data;
                $(".makeup-modal.pack_browser").toggleClass("active", true);
                $(".dark").fadeTo( "fast" , 0.3, function() { })
                $(".dark").bind("click",dark_disable);
                $(".make-up-pack-selector").pack_browser({
                    data: ajaxData,
                    endWork:function (data) {
                        $.ajax({
                            url: 'block',
                            type:"post",
                            data: {
                                action : "block.add",
                                name_pack : data.pack_name,
                                name_template : data.name_template,
                                insert_position: current.attr("insert-position"),
                                id_section : "0"
                            },
                            success:function (data) {
                                $(".makeup-designer").html(data);
                                dark_disable();
                            },
                            error:function () {
                                $(".makeup-modal.pack_browser").toggleClass("active", true);
                                dark_disable();
                            }
                        });
                    }
                });
            },
            error:function () {

            }
        });
    });
    $("body").on("click",".makeup-remove",function () {
        var current = $(this);
        $.ajax({
            url: 'block',
            type: "post",
            data: {
                action: "block.remove",
                remove_block_id: current.attr("id-section"),
                id_section: "0"
            },
            success: function (data) {
                $(".makeup-designer").html(data);
            },
        });
    });
});
