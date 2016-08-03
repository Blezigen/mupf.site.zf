jQuery(function($){
    var options = {
        fullscreen:null
    };
    $.fn.preloader = function(args) {
        var methods = {
            destroy: function (argums) {
                options.fullscreen.animate({"opacity":"0"},1000,function () {
                     options.fullscreen.remove();
                });
            },
            init : function( argums ) {
                return this.each(function () {
                    var preloader_block = "<div id='full_screen'><div class=\"jj_preloader\"><span>Loading ...</span></div></div>";
                    $(this).append(preloader_block);
                    var fs = $(this).find("#full_screen");
                    fs.css("background-color","#fff");
                    fs.css("width","100%");
                    fs.css("height","100%");
                    fs.css("display","block");
                    fs.css("position","absolute");
                    fs.css("top","0");
                    fs.css("left","0");
                    fs.css("left","0");
                    fs.css("opacity","0");
                    fs.css("z-index","100")
                    fs.animate({"opacity":"1"},800,function () {

                    });
                    options.fullscreen = fs;
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