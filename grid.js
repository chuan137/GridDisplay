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
        for(var j = 0; j < holder.data('gridSizeY'); j++)
        {
            var e = newWidget(i, j, 1, 1);
            e.className = 'grid';
            holder.append(e.outerHTML);
        }
    return;
}

/*
 * Sensor List
 */
function initPage2(sizeX, sizeY) {
    var unit0 = 50;
    var wgt = $(window).width() * 0.96;
    var hgt = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum())*0.96;

    var scale1 = wgt/ (sizeX*unit0);
    var scale2 = hgt/ (sizeY*unit0);
    var scale = (scale2 < scale1) ? scale2 : scale1;
    scale = Math.floor(scale*100)/100;
    
    console.log(scale1, scale2);

    var margin = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum()
                - sizeY * unit0 * scale)/2.;


    $('.canvas').css('margin-top', margin + 'px');
    $('.canvas').css('height', sizeY*unit0*scale + 'px');
    $('.canvas').css('width', sizeX*unit0*scale + 'px');

    $('.canvas').data('gridUnitX', unit0*scale);
    $('.canvas').data('gridUnitY', unit0*scale);
    $('.canvas').data('gridSizeX', sizeX);
    $('.canvas').data('gridSizeY', sizeY);
    $('.canvas').data('scale', scale);
    $('.canvas').data('unit0', unit0);

    console.log('gridSize', sizeX, sizeY);
    console.log('unitX/Y', unit0*scale);
    console.log('scale', scale1, scale2, scale);
}

/*
 * Library for Widgets
 */
/*
function newWidget0(dx, dy, posx, posy, scale) {
    var holder = $('.canvas');

    scale = defaultFor(scale, holder.data('scale'));
    var e = document.createElement('div');

    e.style.left = posx * holder.data('unit') * scale + 'px';
    e.style.top  = posy * holder.data('unit') * scale + 'px';
    e.style.width   = dx * holder.data('unit') * scale + 'px';
    e.style.height  = dy * holder.data('unit') * scale + 'px';

    return e;
}


function drawText(dx, dy, posx, posy, str, scale) {
    //scale = defaultFor(scale, $('.canvas').data('scale'));
    var e = newWidget0(dx, dy, posx, posy);
    e.className = 'tile';
    e.innerHTML = str;
    return e;
}


function drawSensor(posx, posy, sensorid, scale) {
    var e = newWidget(5, 3, posx, posy);
    sensorname = 'sensor name';
    sensorvalue = 86;
    e.className = 'tile';
    var str =  '<div style="font-size: 10px; float: left">{0}</div>'.format(sensorname);
    str += '<div style="positon: absolute; top: 50; right: 10; font-size: 50px">{0}</div>'.format(sensorvalue);
    e.innerHTML = str;
    
    return e;
}
*/
