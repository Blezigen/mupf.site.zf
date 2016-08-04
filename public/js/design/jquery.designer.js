jQuery(function($){
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
                    this_designer.public_methods.init_modal();
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
                print_data: "",
                output: undefined
            };

            this.setName = function (value) {
                this_control.options.name = "caction_" + value;
            };
            this.getName = function () {
                return this_control.options.name;
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
            this.getTitle = function(){
                return this_control.options.title ;
            };
            this.init = function (selector) {
                if (options.attrs == undefined){
                    options.attrs = "";
                }
                if (this_control.options.output != undefined ){
                    this_control_selector = this_control.options.output(selector);
                }
                else {
                    selector.append("<button class='designer-block-action-button " + this_control.getName() + "' " + this_control.getAttrs() + ">" + this_control.getTitle() + "</button>");
                    this_control_selector = selector.find(".designer-block-action-button." + this_control.getName());
                }
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
                this_block.option.controls.edit.setTitle('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>');
                this_block.option.controls.remove.setTitle('<i class="fa fa-trash" aria-hidden="true"></i>');
                this_block.option.controls.add.setTitle('<i class="fa fa-plus" aria-hidden="true"></i>');
                    this_block.option.controls.edit.init(selector);
                    this_block.option.controls.remove.init(selector);
                    this_block.option.controls.add.options.output = function (selector) {
                        var cadd = "";
                        cadd += "<div class='designer-block-action-area'>";
                        cadd += "<button class='designer-block-action-button "+this_block.option.controls.add.getName()+"' >"+this_block.option.controls.add.getTitle()+"</button>";
                        cadd += "</div>";
                        selector.append(cadd);
                        return selector.find(".designer-block-action-area").last();
                    };
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