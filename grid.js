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

function getAdeiData(url) {
    var xhr = window.XMLHttpRequest 
            ? new XMLHttpRequest() 
            : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onreadystatechange = function() {
        console.log(xhr.responseText);
        return xhr.responseText;
    }
    console.log(url);
    xhr.open('GET', url, true);
    xhr.send(null);
}

// Sensor List
//
var urlbase = 'http://katrin.kit.edu/adei/services/getdata.php';
var SNS = {
    'sensorid1': {
        name: 'sensor name',
        comment: 'sensor comment',
        min: 0,
        max: 100,
        url: urlbase + '?db_server={0}&db_name={1}&db_group={2}&db_mask={3}&window=-1'.format(
                'temp0',
                'BakeOut2013',
                'TempMon',
                1),
        getdata: function() {
            res = $.get(this.url, function(data) {
                this.data = data;
            });
        },
    },
    'sensorid2': {
        'name': 'sensor name',
        'comment': 'sensor comment',
        'min': 0,
        'max': 100,
        'url': urlbase + '?db_server={0}&db_name={1}&db_group={2}&db_mask={3}&windows=-1'.format(
                'a','b','c','d'),
    },
};


function initPage(){
            var wdt0 = screen.width - 100;
            var hgt0 = screen.height 
                        - $('.banner').css('height').toNum()
                        - $('.footer').css('height').toNum()
                        - $('.canvas').css('margin-top').toNum()
                        - $('.canvas').css('margin-bottom').toNum();

            var gridUnitX = 50;
            var gridUnitY = 50;

            var gridSizeX = Math.floor(wdt0 / gridUnitX);
            var gridSizeY = Math.floor(hgt0 / gridUnitY);

            girdSizeX = (gridSizeX % 2 == 0) ? gridSizeX : gridSizeX - 1;
            girdSizeY = (gridSizeY % 2 == 0) ? gridSizeY : gridSizeY - 1;

            var hgt = screen.availHeight - 150
                        - $('.banner').css('height').toNum()
                        - $('.footer').css('height').toNum()
                        - $('.canvas').css('margin-top').toNum()
                        - $('.canvas').css('margin-bottom').toNum();
            var scale = Math.floor(hgt / hgt0 * 100) / 100;

            var wdt = gridSizeX * scale * 50;
            hgt = gridSizeY * scale * 50;

            $('.canvas').data('height', hgt);
            $('.canvas').data('width', wdt);
            $('.canvas').data('height-fullscreen', hgt0);
            $('.canvas').data('width-fullscreen', wdt0);

            $('.canvas').data('gridUnitX', gridUnitX);
            $('.canvas').data('gridUnitY', gridUnitY);
            $('.canvas').data('gridSizeX', gridSizeX);
            $('.canvas').data('gridSizeY', gridSizeY);
            $('.canvas').data('scale', scale);

            $('.canvas').css('height', hgt+'px');
            $('.canvas').css('width', wdt+'px');
            
            console.log("gridSize:", gridSizeX, gridSizeY);  // grid dimensions
            console.log("scale:", scale);       // canvas relative scale between fullscreen and maximize
            console.log("canvas size:", wdt0, hgt0);  // canvas size when fullscreen
            console.log("canvas size:", wdt, hgt);    // canvas size when maximize
}



function submitTest() {
    fncstring = $('#testfunction').val();

    var fncname = /^[a-zA-Z0-9]+/.exec(fncstring);
    var args =  /\(([^)]+)/.exec(fncstring);

    fncname = fncname[0];
    args = args[1].split(/\s*,\s*/);
    console.log(fncname, args);

    /*
    if (args.length < 5) {
        alert('not enough number of parameters');
        return;
    }
    */

    /*
    for (var i = 0; i < 4; i++) 
            args[i] = args[i].toNum();
            */

    console.log(args[5]);
    console.log(fncname);

    switch(fncname) {
        case "drawText":
            args[4] = /[^'"]+/.exec(args[4]);
            var e = drawText(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
        case "drawSensor":
            var e = drawSensor(args[0], args[1], args[2], args[3]);
            break;
        case "drawS0":
            args[2] = /[^'"]+/.exec(args[2]);
            var e = drawS0(args[0], args[1], args[2], args[3]);
            break;
        default:
            alert('function "' + fncname + '" not defined');
    }

    if (e !== 'undefined')
        $('.canvas').append(e.outerHTML);

    return;
}


/*
 * Library for Widgets
 */
function newWidget(dx, dy, posx, posy, scale) {
    var holder = $('.canvas');

    scale = defaultFor(scale, holder.data('scale'));
    var e = document.createElement('div');

    e.style.left = posx * holder.data('gridUnitX') * scale + 'px';
    e.style.top  = posy * holder.data('gridUnitY') * scale + 'px';
    e.style.width   = dx * holder.data('gridUnitX') * scale + 'px';
    e.style.height  = dy * holder.data('gridUnitY') * scale + 'px';

    return e;
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
            var e = newWidget(1, 1, i, j);
            e.className = 'grid';
            holder.append(e.outerHTML);
        }
    return;
}


function drawText(dx, dy, posx, posy, str, scale) {
    //scale = defaultFor(scale, $('.canvas').data('scale'));
    var e = newWidget(dx, dy, posx, posy);
    e.className = 'tile';
    e.innerHTML = str;
    return e;
}


function sensorTemplate(e) {
    var s0 = document.createElement('div');
    s0.style.position = 'absolute';
    s0.style.fontSize = '12px';
    s0.style.left = '5px';
    s0.innerHTML = this.name;
    s0.innerHTML += '<br>' + this.comment;
 
    var s1 = document.createElement('div');
    s1.style.position = 'absolute';
    s1.style.fontSize = '64px';
    s1.style.right = '8px';
    s1.style.bottom = '-4px';
    s1.innerHTML = this.max;

    e.appendChild(s0);
    e.appendChild(s1);
}


function newW0(dx, dy, px, py, scale) {
    var holder = $('.canvas');
    scale = defaultFor(scale, holder.data('scale'));

    var e = document.createElement('div');
    e.className = 'tile';
    e.style.left = px * holder.data('gridUnitX') * scale + 'px';
    e.style.top  = py * holder.data('gridUnitY') * scale + 'px';
    e.style.width   = dx * holder.data('gridUnitX') * scale + 'px';
    e.style.height  = dy * holder.data('gridUnitY') * scale + 'px';

    return e;
}


function drawS0(px, py, sensorId, scale) {
    var e = newW0(5, 3, px, py);
    bindfunc = sensorTemplate.bind(SNS[sensorId]);

    bindfunc(e);

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
