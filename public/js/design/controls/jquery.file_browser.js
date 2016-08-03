jQuery(function($){
    $.fn.FileBrowser = function(args) {

        var options = {
            current_selector : undefined,
            data : [],
            currentPath:"",
            filter:"",
            url:"/Admin/design/browser",
            //metods
            iconSize:"",
            beforeLoadAction : undefined,
            lastLoadAction : undefined,
            beforeRemoveAction:undefined,
            lastRemoveAction:undefined,
            beforeUploadAction:undefined,
            lastUploadAction:undefined,
            selectFileAction:undefined
        };



        var methods = {
            hide: function () {
                options.current_selector.hide();
            },
            delete : function(){
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
            },
            upload : function () {
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

            init : function( argums ) {
                return this.each(function () {
                    var current = $("body");

                    if (argums){
                        $.extend(options,argums);
                    }

                    current.append(methods.printAction.getContainer());

                    options.current_selector = current.find(".file-browser-control");

                    methods.getFoldersFiles( );
                });
            },

            getFoldersFiles: function () {
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
                    },
                });
            },
            selectItem: function () {
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
            },

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
            }
        };

        // Метод вызывающий логику

        if ( methods[args] ) {
            return methods[ args ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof args === 'object' || ! args ) {
            return methods.init.apply( this, arguments );
        } else {
            console.log( 'Метод ' +  args + ' не существует в packBrowser' );
        }
    };
});