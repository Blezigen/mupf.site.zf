jQuery(function($){
    $.fn.FileBrowser = function(args) {
        var this_browser = this;
        var this_browser_selector = undefined;

        var items = [];

        var FileUploaderItem = new FileUploader();
        var ModaleUploadWeb = new Modal("file_uploader_dialog");

        var dark_side = new darkSide();


        var options = {
            currentPath:"",
            filter:"",
            url:"/Admin/design/browser",
            iconSize:"",
            basePath: "",

            beforeLoadAction : undefined,
            lastLoadAction : undefined,
            beforeRemoveAction:undefined,
            lastRemoveAction:undefined,
            beforeUploadAction:undefined,
            lastUploadAction:undefined,
            selectFileAction:undefined,
            selectImageAction:undefined
        };
        var requests = {
            get:{
                all : function ( event_success ) {
                    $.ajax({
                        url:options.url,
                        type:"POST",
                        // async:false,
                        data:{
                            action:"folder.get.all",
                            path : options.currentPath,
                            filter : options.filter,
                        },
                        dataType:"json",
                        error:function () {

                        },
                        success : function (data) {
                            event_success(data);
                            if ( options.lastLoadAction != undefined )
                                options.lastLoadAction();
                        },
                        beforeSend : function () {
                            if ( options.beforeLoadAction != undefined )
                                options.beforeLoadAction();
                        },
                    });
                }
            },
            custom : {
                delete : function (value, event_success) {
                    // var id = $(this).parent().attr("id-item");
                    // var path = options.data[id].path;
                    $.ajax({
                        url: options.url,
                        type: 'POST',
                        data: {
                            action : "file.remove", // removeFile
                            path : value.path
                        },
                        cache: false,
                        dataType: 'json',
                        beforeSend:function () {
                            if ( options.beforeRemoveAction != undefined )
                                options.beforeRemoveAction();
                        },
                        success: function(data)
                        {
                            event_success(data);
                            //methods.getFoldersFiles( );
                            if ( options.lastRemoveAction != undefined )
                                options.lastRemoveAction();
                        }
                    });
                },
                upload: {
                    local:function (value, event_success) {
                        $.ajax({
                            url: options.url,
                            type: 'POST',
                            data: value.data_files,
                            cache: false,
                            dataType: 'json',
                            processData: false,
                            contentType: false,
                            beforeSend:function () {
                                if ( options.beforeUploadAction != undefined)
                                    options.beforeUploadAction();
                            },
                            success: function(data)
                            {
                                event_success(data);
                                if ( options.lastUploadAction != undefined)
                                    options.lastUploadAction();
                            }
                        });
                    },
                    web: function (value, event_success) {
                        $.ajax({
                            url: options.url,
                            type: 'POST',
                            data: {
                                action : "folder.upload.web",
                                target: value.url,
                                path : options.currentPath

                            },
                            dataType: 'json',
                            beforeSend:function () {
                                if ( options.beforeUploadAction != undefined )
                                    options.beforeUploadAction();
                            },
                            success: function(data)
                            {
                                event_success(data);
                                if ( options.lastUploadAction != undefined )
                                    options.lastUploadAction();
                            }
                        });
                    }
                }
            }

        };

        this.output = {

        };

        this.methods = {
            show: function () {

            },
            dispose: function () {

            },

            update:function () {
                requests.get.all(function (data) {
                    this_browser.methods.output.clear();
                    options.basePath = data.basePath;
                    $.each(data.contents,function (index, file_data) {
                        items[index] = new Item(index);
                        items[index].setType(file_data.type);
                        items[index].setName(file_data.name);
                        items[index].setPath(file_data.path);
                    });
                    this_browser.methods.output.print();
                });

            },

            output : {
                clear:function () {
                    items.splice(0,items.length);
                    this_browser_selector.html("");
                },
                print : function () {
                    FileUploaderItem.init(this_browser_selector);
                    // options.current_selector.find(".file-browser-btn.upload-local").bind("click",methods.upload);
                    // options.current_selector.find(".file-browser-btn.remove-file").bind("click",methods.delete);
                    $.each(items,function (index, file) {
                        file.init(this_browser_selector);
                    });
                }
            },

            init : function( argums ) {
                // if (this_browser_selector == undefined) {
                    return this.each(function () {
                        this_browser_selector = $(this);
                        if (argums) {
                            $.extend(options, argums);
                        }
                        // if (this_browser_selector != undefined)
                            this_browser_selector.append("<ul class='file-browser-control clearfix'></ul>");

                        this_browser_selector = this_browser_selector.find("ul.file-browser-control").last();
                        this_browser.methods.update();
                    });
                // }
            },

        };
        function darkSide() {
            var this_darkSide = this;
            var this_darkSide_selector = undefined;

            this.showSide = function () {
                if (!($("body .file_browser_dark_side").length > 0)) {
                    $("body").append("<div class='file_browser_dark_side'></div>");
                    this_darkSide_selector = $("body .file_browser_dark_side");
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
                    this_modal_selector.find(".file-browser-btn.upload-web-dialog").unbind("click");
                    this_modal_selector.find(".file-browser-btn.upload-web-dialog").click(function () {
                        var url_target = this_modal_selector.find(".file-browser-control-url").val();
                        requests.custom.upload.web({url:url_target},function () {
                            this_modal.hideDialog();
                            this_browser.methods.update();
                        })
                    });
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
                modal_window += "<div class='file-browser-web-dialog'>" ;
                modal_window += "<span class='file-browser-web-dialog-title'>Загрузка из интренета</span>" ;
                modal_window += "<input class='file-browser-control-url' type='text' name='url' placeholder='http://www.lsk.ru/kkk.png'/>" ;
                modal_window += "<button class='file-browser-btn upload-web-dialog'> Скачать </button>" ;
                modal_window += "</div>";
                selector.append(modal_window);
                this_modal_selector = selector.find(".file-browser-web-dialog");

                this_modal.update();
            };

            this.dispose = function () {
                this_modal_selector.remove();
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
                this_modal.dispose();
                // return thisModal;
            }

        }

        function Item(id) {
            var this_item = this;
            var this_item_selector = undefined;

            this.option = {
                id:id,
                type: "folder",
                name: "",
                path: ""
            };

            this.condition = {
                isImage:function () {
                    switch ( this_item.option.type ) {
                        case "png" : return true; break;
                        case "jpeg" : return true; break;
                        case "jpg" : return true; break;
                        case "bmp" : return true; break;
                        case "gif" : return true; break;
                        default: return false;
                    }
                }
            };
            this.output = {
                back_folder : function () {
                    if (options.iconSize != "") {
                        this_item_selector.toggleClass(options.iconSize, true);
                    }
                    this_item_selector.toggleClass("file-browser-item", false);
                    this_item_selector.toggleClass("file-browser-control-back", true);
                    this_item_selector.append('<button class="file-browser-btn back">Назад</button>');
                    this_item_selector.find("span").text(this_item.getName());
                    this_item_selector.bind("click", function () {
                        options.currentPath = this_item.getPath();
                        console.log(options.currentPath);
                        this_browser.methods.update();
                    });
                },
                folder : function () {
                    if (options.iconSize != "") {
                        this_item_selector.toggleClass(options.iconSize, true);
                    }
                    this_item_selector.toggleClass("folder");
                    this_item_selector.append('<span></span>');
                    this_item_selector.find("span").text(this_item.getName());
                    this_item_selector.bind("click", function () {
                        options.currentPath = this_item.getPath();
                        console.log(options.currentPath);
                        this_browser.methods.update();
                    });
                },
                file : function () {
                    if (options.iconSize != "") {
                        this_item_selector.toggleClass(options.iconSize, true);
                    }
                    this_item_selector.toggleClass("file");
                    this_item_selector.toggleClass(this_item.getType());
                    this_item_selector.append('<button class="file-browser-btn remove-file"><i class="fa fa-trash" aria-hidden="true"></i></button>');
                    this_item_selector.append('<span></span>');
                    this_item_selector.find("span").text(this_item.getName());
                    this_item_selector.bind("click", function () {
                        options.selectFileAction({"url":'/'+options.basePath+this_item.getPath()});
                    });
                },
                image : function () {
                    if (options.iconSize != "") {
                        this_item_selector.toggleClass(options.iconSize, true);
                    }
                    this_item_selector.toggleClass("image");
                    this_item_selector.toggleClass(this_item.getType());
                    this_item_selector.css("background-image", "url('/"+options.basePath+this_item.getPath()+"')")
                    this_item_selector.append('<button class="file-browser-btn remove-file"><i class="fa fa-trash" aria-hidden="true"></i></button>');
                    this_item_selector.append('<span></span>');
                    this_item_selector.find("span").text(this_item.getName());
                    this_item_selector.unbind("click");
                    this_item_selector.bind("click", function () {
                        options.selectImageAction({"url":'/'+options.basePath+this_item.getPath()});
                    });
                }
            };

            this.setType = function (value) {
              this_item.option.type = value;
            };
            this.getType = function () {
                return this_item.option.type;
            };
            this.getID = function () {
                return this_item.option.id;
            };
            this.setName = function (value) {
                this_item.option.name = value;
            };
            this.getName = function () {
                return this_item.option.name;
            };
            this.setPath = function (value) {
                this_item.option.path = value;
            };
            this.getPath = function () {
                return this_item.option.path;
            };

            this.update = function () {
                switch (this_item.getType()){
                    case ".." : { this_item.output.back_folder(); break; }
                    case "folder" : { this_item.output.folder(); break; }
                    default: {
                        if(this_item.condition.isImage(this_item.getType())){
                            this_item.output.image();
                        }
                        else {
                            this_item.output.file();
                        }
                    }
                }

            };

            this.init = function (selector) {
                selector.append("<li class='file-browser-item'></li>");
                this_item_selector = selector.find(".file-browser-item").last();
                this_item.update();
            }
            
        }

        function FileUploader(){
            var this_fuploader = this;
            var this_fuploader_selector = undefined;

            this.option = {

            };

            this.output = {

            };

            this.update = function () {
                this_fuploader_selector.append(
                    "<input class=\"fileUploader\" type=\"file\" name=\"file\" style=\"display: none;\" /> " +
                    "<button class=\"file-browser-btn upload-local\">Загрузка с компьютера</button>" +
                    "<button class=\"file-browser-btn upload-web\">Загрузка из сети</button>"
                );
                var button_upload_local = this_fuploader_selector.find(".file-browser-btn.upload-local").last();
                var button_upload_web = this_fuploader_selector.find(".file-browser-btn.upload-web").last();

                button_upload_local.click(function () {
                    this_fuploader_selector.on('change',".fileUploader", function () {
                        var files = event.target.files;
                        event.stopPropagation();
                        event.preventDefault();
                        var data = new FormData();
                        data.append("action", "folder.upload.local");
                        data.append("path", options.currentPath);
                        $.each( files, function( key, value ) {
                            data.append( key, value );
                        });
                        requests.custom.upload.local( { data_files:data }, function () {
                            this_browser.methods.update();
                        });
                    });
                    this_fuploader_selector.find(".fileUploader").trigger("click");
                    return false;
                });

                button_upload_web.click(function () {
                    ModaleUploadWeb.init($("body"));
                    ModaleUploadWeb.showDialog();
                    return false;
                });

            };

            this.init = function (selector) {
                selector.append('<li class="file-browser-control-upload"></li>');
                this_fuploader_selector = selector.find(".file-browser-control-upload").last();
                this_fuploader.update();
            }
        }

        // Метод вызывающий логику

        if ( this_browser.methods[args] ) {
            return this_browser.methods[ args ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof args === 'object' || ! args ) {
            return this_browser.methods.init.apply( this, arguments );
        } else {
            console.log( 'Метод ' +  args + ' не существует в packBrowser' );
        }
    };
});