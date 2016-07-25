var stoper = false;
function Bricks(){
    var settings = {
        container : $('.makeup-preloader').children('ul'),
        height : $('.makeup-preloader').height()/2-30, //35 = 1/2 heigh li
        //width : $(document).width()/2, //200 = count li * li.width
    };

    settings.elHeaight = settings.container.find('li').first().height();
    settings.container.find('li').each(function(i,el){
        settings.elTop += settings.elHeaight;
        $(el).css('top', settings.height-100);
        if(i != 0){
            $(el).css('top',settings.elTop+settings.elHeaight);
        }
    });

    addSettings(settings);
    function addSettings(settings){
        settings.elements = settings.container.find('li');
        settings.first = settings.elements.first();
        settings.last = settings.elements.last();
        bricksAnimate(settings);
    }

    function _step_1(settings){
        settings.first.stop().animate({
            top: settings.height - 100
        }, 150, function() { _step_2(settings); });
    }
    function _step_2(settings){
        settings.last.prevAll().andSelf().each(function(i, el){
            var elPositiontop = parseInt($(el).css('top'));
            $(el).stop().animate({
                top: elPositiontop + settings.elHeaight
            },200, function() {});
        });
        _step_3(settings);
    }
    function _step_3(settings){
        settings.last.stop().animate({
            top: settings.height
        },150, function() {});
        _step_4(settings);
    }
    function _step_4(settings){
        settings.last.delay(30).stop().animate({
            top: settings.height*2
        },200, function() {
            _step_5(settings);
        });
    }

    var zindex = 4;
    function _step_5(settings){

        $(settings.last).prependTo(settings.container);
        settings.last.css({'top': "-"+settings.elHeaight+"px","z-index" : zindex, visibility:"visible"});
        addSettings(settings);
        zindex++;
        console.log(zindex);
    }

    function bricksAnimate(settings){
        if(!stoper){
            _step_1(settings);
        }
    }
}