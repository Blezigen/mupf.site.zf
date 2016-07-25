jQuery(function($){
    $.fn.FileBrowser = function(args) {
        var options = {
            data : [],

            // callback - metods
            selectImage : undefined,
            selectFile : undefined,
            selectFolder: undefined,
        };


        function _print_content(selector, data) {
            selector.html(_get_container());
            var control = selector.find(".file-browser-control");
            control.append(_get_back_folder());
            if (data !== undefined) {
                $.each(options.data,function (key,item) {
                    control.append(_get_item(key,item.name,item.type,item.link));
                });
            }
        }

        
        function _child_folder() {
            
        }
        
        function _click_event(data, id) {
            var link = data[id].link;
            var type = data[id].type;
            var name = data[id].name;

            var return_data = {
                id:id,
                name:name,
                type:type,
                link:link
            };

            if (type == "image"){
                if (options.selectImage !== undefined) {
                    options.selectImage(return_data);
                }
            }
            else if (type == "folder"){
                if (options.selectFolder !== undefined) {
                    options.selectFolder(return_data);
                }
            }
            else if (type == "file"){
                if (options.selectFile !== undefined) {
                    options.selectFile(return_data);
                }
            }
        }

        function _get_container() {
            return "<ul class='file-browser-control clearfix'></ul>"
        }

        function _get_back_folder() {
            return "<li class=\"file-browser-control-back\"> <button class=\"file-browser-btn back\">Назад</button></li>";
        }

        function _get_item(id,name,type,link) {
            var custom_attr = "";
            if(type == "image"){
                custom_attr = " style=\"background-image: url('"+link+"')\"";
            }
            return "<li id-item='"+id+"' class='file-browser-item "+type+"'"+custom_attr+"><span>"+name+"</span></li>";
        }


        var methods = {
            load: function (argums) {

            },
            init : function( argums ) {
                return this.each(function () {
                    var current = $(this);
                    if (argums.data !== undefined) {
                        options.data = argums.data;

                        _print_content(current, options.data);

                        $(".file-browser-item").click(function () {
                            _click_event(options.data,$(this).attr("id-item"));
                        });
                    }
                    if (argums.selectImage !== undefined) {
                        options.selectImage = argums.selectImage;
                    }
                    if (argums.selectFolder !== undefined) {
                        options.selectFolder = argums.selectFolder;
                    }
                    if (argums.selectFile !== undefined) {
                        options.selectFile = argums.selectFile;
                    }
                });
            }
        };

        // Метод вызывающий логику

        if ( methods[args.action] ) {
            return methods[ args.action ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof args.action === 'object' || ! args.action ) {
            return methods.init.apply( this, arguments );
        } else {
            console.log( 'Метод ' +  args + ' не существует в packBrowser' );
        }
    };
});