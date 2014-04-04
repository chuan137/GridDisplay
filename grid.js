String.prototype.toNum = function() {
    return parseInt(this);
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}

function submitTest() {
    fncstring = $('#testfunction').val();

    var fncname = /^[a-zA-Z0-9]+/.exec(fncstring);
    var args =  /\(([^)]+)/.exec(fncstring);

    fncname = fncname[0];
    if (args !== null)
        args = args[1].split(/\s*,\s*/);

    switch(fncname) {
        case "drawText":
            args[4] = /[^'"]+/.exec(args[4]);
            var e = drawText(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
        case "drawSensor":
            var e = drawSensor(args[0], args[1], args[2], args[3]);
            break;
        case "addSensor":
            args[2] = /[^'"]+/.exec(args[2]);
            var e = addSensor(args[0], args[1], args[2], args[3]);
            break;
        case "updatePage":
            updatePage();
            break;
        case "addSensorGroup":
            addSensorGroup.call($('.canvas'), args[0], args[1], args[2], args[3], args[4]);
            break;
        default:
            alert('function "' + fncname + '" not defined');
    }

    /*
    if (e !== undefined)
        $('.canvas').append(e.outerHTML);
        */
    $('.group')
        /*
        .draggable({
            grid: [$('.canvas').data('gridUnitX'),$('.canvas').data('gridUnitY')],
            containment: 'parent'
        })
        */
    return;
}

function toggleGrid() {
    var holder = $('.canvas');
    var attr = holder.attr('grid');

    if (typeof attr !== 'undefined' && attr !== false) {
        holder.children('.grid').remove();
        holder.removeAttr('grid');
        return;
    }

    holder.attr('grid', 'grid');
     
    for (var i = 0; i < holder.data('gridSizeX'); i++)
        for(var j = 0; j < holder.data('gridSizeY'); j++) {
            var e = newWidget(i, j, 1, 1);
            e.className = 'grid';
            holder.append(e.outerHTML);
        }
    return;
}

function initPage2(sizeX, sizeY) {
    var unit0 = 50,
        wgt = $(window).width() * 0.96,
        hgt = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum())*0.96,
        scale1 = wgt/ (sizeX*unit0),
        scale2 = hgt/ (sizeY*unit0),
        scale = (scale2 < scale1) ? scale2 : scale1,

    scale = Math.floor(scale*100)/100;

    var margin = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum()
                - sizeY * unit0 * scale)/2.;

    $('.canvas').attr('scaled', 'scaled');
    $('.canvas').data('gridUnitX', unit0*scale);
    $('.canvas').data('gridUnitY', unit0*scale);
    $('.canvas').data('gridSizeX', sizeX);
    $('.canvas').data('gridSizeY', sizeY);
    $('.canvas').data('scale', scale);
    $('.canvas').data('unit0', unit0);

    $('.canvas').css('margin-top', margin + 'px');
    $('.canvas').css('height', sizeY*unit0*scale + 'px');
    $('.canvas').css('width', sizeX*unit0*scale + 'px');

    console.log('gridSize', sizeX, sizeY);
    console.log('unitX/Y', unit0*scale);
    console.log('scale', scale1, scale2, scale);
}
