jQuery(function($){
    FileBrowser
    $.fn.designer = function(args) {

        var this_designer = this;
        var this_designer_block = undefined;

        var options = {
            blocks : []
        };

        var packs = new Packs();
        var preloader = new Preloader();
        var dark_side = new darkSide();

        var modals = {
            add : new Modal("add"),
            edit : new Modal("edit"),
            remove: new Modal("remove"),
        }

        this.FileBrowser = function () {
            var this_pack = this;
            var this_pack_selector = undefined;
            var options = {
                data : [],
                currentPath:"",
                filter:"",
                url:"/Admin/design/browser",
                //metods
                iconSize:"",
            };

            var methods = {

                conditionAction : {
                    isImage : function(type) {
                        if (type == "png" || type == "jpeg" || type == "jpg" || type == "bmp" || type == "gif"){
                            return true;
                        }
                        return false;
                    }
                },
                dialogs:{
                    webUploadDialog: {
                        handle:undefined,
                        window:"<div class='file-browser-web-dialog'>" +
                        "<span class='file-browser-web-dialog-title'>Загрузка из интренета</span>" +
                        "<input class='file-browser-control-url' type='text' name='url' placeholder='http://www.lsk.ru/kkk.png'/>" +
                        "<button class='file-browser-btn upload-web-dialog'> Скачать </button>" +
                        "</div>",
                        active:function () {
                            options.current_selector.append(methods.dialogs.webUploadDialog.window);
                            methods.dialogs.webUploadDialog.handle = options.current_selector.find(".file-browser-web-dialog");

                            methods.dialogs.webUploadDialog.handle.css("display","block");
                            methods.dialogs.dark_side.active(
                                function () {
                                    methods.dialogs.webUploadDialog.handle.animate(
                                        {
                                            opacity:1
                                        },
                                        250,
                                        function () {

                                        }
                                    );
                                },
                                function () {
                                    methods.dialogs.webUploadDialog.handle.animate(
                                        {
                                            opacity:0
                                        },
                                        250,
                                        function () {
                                            dialog.css("display","none");
                                            methods.dialogs.webUploadDialog.handle.remove();
                                        }
                                    );
                                }
                            );
                            methods.dialogs.webUploadDialog.handle.find(".upload-web-dialog").bind("click",function () {
                                options.target = options.current_selector.find(".file-browser-control-url").val();
                                $.ajax({
                                    url: options.url,
                                    type: 'POST',
                                    data: {
                                        action : "uploadWebFile",
                                        target: options.target,
                                        path : options.currentPath

                                    },
                                    dataType: 'json',
                                    beforeSend:function () {
                                        options.beforeUploadAction(options.current_selector);
                                    },
                                    success: function(data)
                                    {

                                        methods.dialogs.dark_side.deactive(function () {
                                            methods.dialogs.webUploadDialog.handle.animate(
                                                {
                                                    opacity:0
                                                },
                                                250,
                                                function () {
                                                    dialog.css("display","none");
                                                    methods.dialogs.webUploadDialog.handle.remove();
                                                }
                                            );

                                        });
                                        methods.getFoldersFiles( );
                                        options.lastUploadAction(options.current_selector);
                                    }
                                });

                            })
                        }
                    },
                    dark_side:{
                        handle:undefined,
                        window:"<div class='dark_side'></div>",
                        active:function (handler_end_active,handler_end_deactive) {
                            options.current_selector.append(methods.dialogs.dark_side.window);
                            methods.dialogs.dark_side.handle = options.current_selector.find(".dark_side");
                            methods.dialogs.dark_side.handle.css("display","block");
                            methods.dialogs.dark_side.handle.animate(
                                {
                                    opacity:0.5
                                },
                                250,
                                handler_end_active
                            );
                            methods.dialogs.dark_side.handle.animate(
                                {
                                    opacity:1
                                },
                                250,
                                function () {
                                    methods.dialogs.dark_side.handle.bind("click",function () {
                                        methods.dialogs.dark_side.deactive(handler_end_deactive);
                                    });
                                }
                            );
                        },
                        deactive:function (handler_end_active) {
                            methods.dialogs.dark_side.handle.animate(
                                {
                                    opacity:0.5
                                },
                                250,
                                handler_end_active
                            );
                            methods.dialogs.dark_side.handle.animate(
                                {
                                    opacity:0
                                },
                                250,
                                function () {
                                    methods.dialogs.dark_side.handle.css("display","none");
                                    methods.dialogs.dark_side.handle.remove();
                                }
                            );
                        }

                    }
                },
                printAction : {
                    getContainer : function(){
                        return "<ul class='file-browser-control clearfix'></ul>";
                    },
                    getBackButton : function (id) {
                        return "<li class=\"file-browser-control-back\"> <button id-item='"+id+"' class=\"file-browser-btn back\">Назад</button></li>";
                    },
                    getUploadControl : function () {
                        return  "<li class=\"file-browser-control-upload\">" +
                            "<input id=\"fileUploader\" type=\"file\" name=\"file\" style=\"display: none;\" /> " +
                            "<button class=\"file-browser-btn upload-local\">Загрузка с компьютера</button>" +
                            "<button class=\"file-browser-btn upload-web\">Загрузка из сети</button>" +
                            "</li>";
                    },
                    getItem: function(id,name,type,path) {
                        var custom_attr = "";

                        if (type == ".."){
                            return methods.printAction.getBackButton(id);
                        }

                        if (type == "folder"){

                        }
                        else if(methods.conditionAction.isImage(type)){
                            type += " image";
                            custom_attr = " style=\"background-image: url('/"+options.basePath+path+"')\"";
                        }
                        else {
                            type += " file";
                        }
                        return "<li id-item='"+id+"' class='file-browser-item "+options.iconSize+" "+type+"'"+custom_attr+"><button class='file-browser-btn remove-file'><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button><span>"+name+"</span></li>";
                    },
                    getContent: function() {
                        if ( options.current_selector.find("li").length > 0 ){
                            options.current_selector.find("li").remove();
                        }

                        options.current_selector.append(methods.printAction.getUploadControl());
                        options.current_selector.append(methods.dialogs.dark_side.window);

                        if (options.data !== undefined) {
                            $.each(options.data,function (key,item) {
                                options.current_selector.append(methods.printAction.getItem(key,item.name,item.type,item.path));

                            });
                            // options.current_selector.find(".file-browser-item").unbind("click");
                            options.current_selector.find(".file-browser-item").bind("click",methods.selectItem);
                            options.current_selector.find(".file-browser-btn.back").bind("click", methods.selectItem);
                            options.current_selector.find(".file-browser-btn.upload-local").bind("click",methods.upload);
                            options.current_selector.find(".file-browser-btn.remove-file").bind("click",methods.delete);
                            options.current_selector.find(".file-browser-btn.upload-web").bind("click",methods.dialogs.webUploadDialog.active);
                        }
                    }
                },

                request : {

                }
            };

            this.delete = function(){
                var id = $(this).parent().attr("id-item");
                var path = options.data[id].path;
                $.ajax({
                    url: options.url,
                    type: 'POST',
                    data: {
                        action : "removeFile",
                        path : path
                    },
                    cache: false,
                    dataType: 'json',
                    beforeSend:function () {
                        options.beforeRemoveAction(options.current_selector);
                    },
                    success: function(data)
                    {
                        methods.getFoldersFiles( );
                        options.lastRemoveAction(options.current_selector);
                    }
                });
            };
            this.upload = function () {
                $('.file-browser-control-upload').on('change',"#fileUploader", function () {
                    var current = $(this);
                    var files = event.target.files;
                    event.stopPropagation();
                    event.preventDefault();
                    var data = new FormData();
                    data.append("action", "uploadLocalFile");
                    data.append("path", options.currentPath);
                    $.each(files, function(key, value)
                    {
                        data.append(key, value);
                    });
                    $.ajax({
                        url: options.url,
                        type: 'POST',
                        data: data,
                        cache: false,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        beforeSend:function () {
                            options.beforeUploadAction(options.current_selector);
                        },
                        success: function(data)
                        {
                            methods.getFoldersFiles( );
                            options.lastUploadAction(options.current_selector);
                        }
                    });
                });
                $("#fileUploader").trigger("click");
            },

            this.init = function( argums ) {
                return this.each(function () {
                    var current = $("body");

                    if (argums){
                        $.extend(options,argums);
                    }

                    current.append(methods.printAction.getContainer());

                    options.current_selector = current.find(".file-browser-control");

                    methods.getFoldersFiles( );
                });
            };

            this.getFoldersFiles = function () {
                $.ajax({
                    url:options.url,
                    type:"POST",
                    // async:false,
                    data:{
                        action:"getFolder",
                        path:options.currentPath,
                        filter:options.filter,
                        data:options.data
                    },
                    dataType:"json",
                    error:function () {
                        console.log("error");
                    },
                    success : function (data) {
                        options.data = data.contents;
                        options.basePath = data.basePath;
                        methods.printAction.getContent();
                        options.lastLoadAction(options.current_selector);
                    },
                    beforeSend : function () {
                        options.beforeLoadAction(options.current_selector);
                    }
                });
            };


            this.selectItem = function () {
                var id = $(this).attr("id-item");
                var type = options.data[id].type;
                var path = options.data[id].path;
                if(type == "folder" || type == ".."){
                    options.currentPath = path;
                    methods.getFoldersFiles();
                }
                else {
                    if (options.selectFileAction != undefined)
                        options.selectFileAction({file_path:options.basePath+path});
                }
            };

            this.bindClickToFile = function (event_click){
                this_pack_selector.find(".template").unbind("click");
                this_pack_selector.find(".template").click(function () {
                    event_click({
                        pack: $(this).attr("pack"),
                        template: $(this).attr("template")
                    });
                });
            }
        };


        this.public_methods = {
            init_modal : function () {
                modals.edit.init($("body"));
                modals.remove.init($("body"));
                modals.add.init($("body"));
                modals.add.setContent("");
                // packs.init(modals.add.getContentSelectror());
            },
            bindControlEvent: function(){
                $.each(options.blocks, function (k,v) {
                    v.option.controls.edit.bindEvent(function () {
                        this_designer.public_methods.requests.block.get.option(
                            {block_id:v.getBlockID()},
                            function (data) {
                                modals.edit.setContent(data);
                                modals.edit.showDialog();

                                var modal_content = modals.edit.getContentSelectror()

                                modal_content.unbind("submit");
                                modal_content.on("submit","form",function () {
                                    var form_this = $(this);
                                    this_designer.public_methods.requests.block.custom.set(
                                        {
                                            block_id : v.getBlockID(),
                                            data:form_this.serializeArray()
                                        },
                                        function (data) {
                                            v.clearContent();
                                            v.setContent();
                                            this_designer.public_methods.update();
                                            modals.edit.hideDialog();
                                        }
                                    );
                                    return false;
                                });

                                dark_side.bindEvent("click", function () {
                                    modals.edit.hideDialog();
                                    dark_side.unbindEvent("click");
                                })
                            }
                        );
                    });
                    v.option.controls.remove.bindEvent(function () {
                        if (confirm("Удалить?")) {
                            this_designer.public_methods.requests.block.custom.remove({block_id: v.getBlockID()}, function () {
                                this_designer.public_methods.update();
                            });
                        }
                    });
                    v.option.controls.add.bindEvent(function () {
                        modals.add.setContent("");
                        modals.add.showDialog();
                        packs.init(modals.add.getContentSelectror());
                        packs.bindClickToTemplate(function (data) {
                            this_designer.public_methods.requests.block.custom.add(
                                {
                                    block_id : v.getBlockID(),
                                    name_template : data.template,
                                    name_pack : data.pack
                                },
                                function (data) {
                                    this_designer.public_methods.update();
                                    modals.add.hideDialog();
                                }
                            );
                        });

                        dark_side.bindEvent("click", function () {
                            modals.add.hideDialog();
                            dark_side.unbindEvent("click");
                        })
                    });
                })
            },
            init : function( args ) {
                return this.each(function () {
                    if (args){
                        $.extend(options,args);
                    }
                    this_designer_block = $(this);
                    this_designer.public_methods.update();
                });
            },
            update : function () {
                this_designer_block.html("");
                this_designer.public_methods.requests.block.get.all(function (data) {
                    $.each(data.blocks, function (i,block_data) {
                        var block = new Block(i);
                        block.init(this_designer_block);
                        block.setContent(block_data.style,block_data.code);
                        options.blocks[i] = block;
                    });
                    this_designer.public_methods.init_modal();
                    this_designer.public_methods.bindControlEvent();
                });
            },
            requests : {
                block : {
                    get:{
                        all : function (event_success) { /// getBlocks
                            /*
                             * Позволяет передать в качестве значения в функцию все блоки лендинга
                             */
                            // preloader.show();
                            $.ajax({
                                url: '/Admin/design/block',
                                type:"post",
                                dataType:"json",
                                // async : false,
                                data: {
                                    action : "blocks.get",
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                            // preloader.hide()
                        },
                        style : function (value, event_success) { /// getBlockStyle
                            /*
                             * Позволяет передать в качестве значения в функцию стили
                             */
                            $.ajax({
                                url: '/Admin/design/block',
                                type:"POST",
                                // async : false,
                                data: {
                                    action : "block.get.style",
                                    id_block : value.block_id
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                        },
                        code : function (value, event_success) { /// getBlockCode
                            /*
                             * Позволяет передать в качестве значения в функцию html code
                             */
                            $.ajax({
                                url: '/Admin/design/block',
                                type:"post",
                                // async : false,
                                data: {
                                    action : "block.get.code",
                                    id_block : value.block_id
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                        },
                        option : function (value,event_success) { /// getBlockOption
                            $.ajax({
                                url: '/Admin/design/block',
                                type:"post",
                                // async : false,
                                data: {
                                    action : "block.get.option",
                                    id_block : value.block_id
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                        },
                    },
                    custom:{
                        set : function (value, event_success) { /// setBlock
                            $.ajax({
                                url : '/Admin/design/block',
                                type : "post",
                                // async : false,
                                data : {
                                    action : "block.set",
                                    "options" : value.data,
                                    "id-section" : value.block_id,
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                        },
                        add : function (value, event_success) { /// addBlock
                            $.ajax({
                                url : '/Admin/design/block',
                                type : "post",
                                // async : false,
                                data : {
                                    action : "block.add",
                                    "name_pack" : value.name_pack,
                                    "name_template" : value.name_template,
                                    "insert_position" : value.block_id+1
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                        },
                        remove: function (value, event_success) { /// removeBlock
                            $.ajax({
                                url : '/Admin/design/block',
                                type : "post",
                                // async : false,
                                data : {
                                    action : "block.remove",
                                    block_id : value.block_id
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                        }
                    },
                },
                pack:{
                    get:{
                        all: function (event_success) { /// getPacks
                            $.ajax({
                                url: '/Admin/design/packs',
                                type:"post",
                                async : false,
                                dataType:"json",
                                data: {
                                    action : "packs.get",
                                },
                                beforeSend : function(){
                                    preloader.show();
                                },
                                success:function (data) {
                                    if (event_success != undefined)
                                        event_success(data);
                                },
                                error:function () {

                                },
                                complete : function(){
                                    preloader.hide()
                                }
                            });
                        },
                    }
                }
            }

        };

        function darkSide() {
            var this_darkSide = this;
            var this_darkSide_selector = undefined;

            this.showSide = function () {
                if (!($("body .designer-dark-side").length > 0)) {
                    $("body").append("<div class='designer-dark-side'></div>");
                    this_darkSide_selector = $("body .designer-dark-side");
                }
            };
            this.hideSide = function () {
                this_darkSide_selector.remove();
            };
            this.unbindEvent = function (value) {
                this_darkSide_selector.unbind(value);
            };
            this.bindEvent = function (value,event) {
                this_darkSide_selector.bind(value,event);
            };
        }
        function Preloader() {
            var this_preloader = this;
            var this_preloader_selector = undefined;

            this.show = function () {
                if (!($("body .designer-preloader").length > 0)) {
                    $("body").append("<div class='designer-preloader'></div>");
                    this_preloader_selector = $("body .designer-preloader");
                }
            };
            this.hide = function () {
                this_preloader_selector.remove();
            };
            this.unbindEvent = function (value) {
                this_preloader_selector.unbind(value);
            };
            this.bindEvent = function (value,event) {
                this_preloader_selector.bind(value,event);
            };
        }
        function Modal(name_modal) {
            var this_modal = this;
            var this_modal_selector = undefined;

            var options = {
                name : name_modal,
                title: "",
                content: ""
            };

            this.update = function () {
                if (this_modal_selector != undefined){
                    this_modal_selector.find(".designer-block-title").html(this_modal.getTitle());
                    this_modal_selector.find(".designer-block-body").html(this_modal.getContent());
                }
            };

            this.setName = function (value) {
                options.name = value;
            };

            this.setTitle = function (value) {
                options.title = value;
                this_modal.update();
            };

            this.setContent = function (value) {
                options.content = value;
                this_modal.update();
            };

            this.getContentSelectror = function () {
                return this_modal_selector.find(".designer-block-body");
            };

            this.getName = function () {
                return options.name;
            };

            this.getTitle = function () {
                return options.title;
            };

            this.getContent = function () {
                return options.content;
            };

            this.init = function (selector) {
                var modal_window = "";
                modal_window += "<div class='designer-block-modal "+this_modal.getName()+"'>";
                modal_window += "<div class='designer-block-title'>"+this_modal.getTitle()+"</div>";
                modal_window += "<div class='designer-block-body'>";
                modal_window += this_modal.getContent();
                modal_window += "</div>";
                modal_window += "</div>";
                selector.append(modal_window);
                this_modal_selector = selector.find("."+this_modal.getName());
                this_modal.update();
            };

            this.showDialog = function () {
                dark_side.showSide();
                this_modal_selector.css("display","block");
                this_modal.update();
                dark_side.unbindEvent("click");
                dark_side.bindEvent("click", this_modal.hideDialog);

                // return thisModal;
            }

            this.hideDialog = function () {
                dark_side.hideSide();
                this_modal_selector.css("display","none");
                // return thisModal;
            }

        }
        function Control(control_name) {
            var this_control = this;
            var this_control_selector = undefined;

            this.options = {
                title : undefined,
                name : undefined,
                attrs : "",
                print_data: ""
            };

            this.setName = function (value) {
                this_control.options.name = "caction_" + value;
            };

            this.setAttrs = function (value) {
                this_control.options.attrs = value;
            };

            this.getAttrs  = function () {
                return this_control.options.attrs;
            }

            this.setTitle = function(value){
                this_control.options.title = value;
            };

            this.init = function (selector) {
                if (options.attrs == undefined){
                    options.attrs = "";
                }
                selector.append("<button class='designer-block-action-button " + this_control.options.name + "' " + this_control.options.attrs + ">" + this_control.options.title + "</button>");
                this_control_selector = selector.find(".designer-block-action-button." + this_control.options.name );
            };

            this.bindEvent = function (event) {
                this_control_selector.unbind("click");
                this_control_selector.bind("click",event);
            };

            this.setTitle(control_name);
            this.setName(control_name);
        }
        function Packs() {
            var this_pack = this;
            var this_pack_selector = undefined;
            var options = {
                data : [],
                selected_data:{
                    pack_name:"",
                    pack_image : "",
                    name_template:"",
                    pack_templates: [
                        {
                            name_template : "",
                            image_template : ""
                        }
                    ]
                }
            };
            this.update = function () {
                var pack = "";
                $.each(options.data, function (pack_key, pack_data) {
                    var pack_templates = "<ul class=\"pack_templates\">";
                    $.each(pack_data.pack_templates, function (templates_key, templates_data) {
                        pack_templates +=
                            "<li class=\"template\" pack=\"" + pack_data.pack_name + "\" template=\"" + templates_data.name_template + "\" >" +
                                "<img src=\"" + templates_data.image_template + "\">" +
                                "<span>" +
                                    templates_data.name_template +
                                "</span>" +
                            "</li>";
                    });
                    pack_templates += "</ul>";
                    pack += "<li class=\"pack\" id-element=\"" + pack_key + "\">" +
                        "<img src=\"" + pack_data.pack_image + "\"/>" +
                        "<span>" + pack_data.pack_name + "</span>" +
                        pack_templates +
                        "</li>";
                });
                this_pack_selector.html(pack);
            };
            this.init = function (selector) {
                this_designer.public_methods.requests.pack.get.all(function (data) {
                    options.data = data;

                    var pack_control = "";

                    pack_control += "<ul class='pack_browser'></ul>";

                    selector.append(pack_control);

                    this_pack_selector = selector.find(".pack_browser");

                    this_pack.update();
                });
            };
            this.bindClickToTemplate = function (event_click){
                this_pack_selector.find(".template").unbind("click");
                this_pack_selector.find(".template").click(function () {
                    event_click({
                        pack: $(this).attr("pack"),
                        template: $(this).attr("template")
                    });
                });
            }
        }
        function Block (id_block){
            var this_block = this;
            var this_block_selector = undefined;

            this.option = {
                id : id_block,
                controls : {
                    edit : new Control("edit"),
                    add : new Control("add"),
                    remove : new Control("remove"),
                    file_selector : new Control("file_selector")
                }
            };

            this.getBlockID = function(){
                return this_block.option.id;
            }

            this.initControl = function(){
                var selector = this_block_selector.find(".designer-block-option");
                selector.html("");
                this_block.option.controls.edit.init(selector);
                this_block.option.controls.remove.init(selector);
                this_block.option.controls.add.init(this_block_selector);
            };

            this.clearContent = function () {

            };

            this.setContent = function (style,code) {
                var selector = this_block_selector.find(".designer-block-view");
                selector.html("");
                // this_designer.public_methods.requests.block.get.code({block_id:this_block.getBlockID()}, function (data) {
                    selector.append(code);
                // });
                // this_designer.public_methods.requests.block.get.style({block_id:this_block.getBlockID()}, function (data) {
                    selector.append("<style>"+style+"</style>");
                // });
            };

            this.init = function (selector) {
                var container = "";
                    container += "<div class='designer-block' id='lg_"+this_block.getBlockID()+"' block-id='"+this_block.getBlockID()+"'>";
                    container += "<div class='designer-block-view'></div>";
                    container += "<div class='designer-block-option'></div>";
                    container += "</div>";

                selector.append(container);
                this_block_selector = selector.find("#lg_"+this_block.getBlockID());
                this.initControl();
            }
        }

        // Метод вызывающий логику
        if ( this.public_methods[args] ) {
            return this.public_methods[ args ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof args === 'object' || ! args ) {
            return this.public_methods.init.apply( this, arguments );
        } else {
            console.log( 'Метод ' +  args + ' не существует в packBrowser' );
        }
    };
});