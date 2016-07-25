jQuery(function($){
    $.fn.pack_browser = function(args) {
        var options = {
          selected_data:{
              pack_name:"",
              name_template:""
          },
        };

        var methods = {
            init : function( argums ) {
                return this.each(function () {
                    $(this).html("<ul class=\"pack_browser\"></ul>");
                    var ul = $(this).find("ul");
                    if (argums.endWork !== undefined) {
                        options.data = argums.data;
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
                            ul.append(
                                "<li class=\"pack\" id-element=\"" + pack_key + "\">" +
                                "<img src=\"" + pack_data.pack_image + "\"/>" +
                                "<span>" + pack_data.pack_name + "</span>" +
                                pack_templates +
                                "</li>");
                            $(".pack").unbind("click");
                            $(".pack").bind("click", expand_pack);
                        });
                    }

                    function select_data() {
                        options.selected_data.pack_name = $(this).attr("pack");
                        options.selected_data.name_template = $(this).attr("template");
                        var data = {
                            pack_name:options.selected_data.pack_name,
                            name_template:options.selected_data.name_template
                        };
                        if (argums.endWork !== undefined) {
                            argums.endWork(data);
                        }

                        $(".template").unbind("click");
                    }

                    function expand_pack() {
                        var parent = $(this);
                        var current = parent.find(".pack_templates");
                        current.toggleClass("active",true);
                        parent.unbind("click");
                        var height_element = 0;
                        var count_elem = 0;
                        $.each(current.find("li"), function (k,v) {
                            height_element = $(v).outerHeight(true);
                            count_elem++;
                        });

                        height_element = height_element * Math.ceil(count_elem / 3);

                        $(".template").bind("click",select_data);
                        current.animate({
                            height: height_element
                        }, 1000, function() {
                            parent.bind("click",de_expand_pack);
                        });
                    }

                    function de_expand_pack(){
                        var parent = $(this);
                        var current = parent.find(".pack_templates");
                        current.toggleClass("active",false);
                        parent.unbind("click");
                        var height_element = 0;

                        current.animate({
                            height: height_element
                        }, 1000, function() {
                            parent.bind("click",expand_pack);
                        });
                    }
                });
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