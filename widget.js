function newWidget(px, py, dx, dy, scale) {
    var e = document.createElement('div');
    var holder = $('.canvas');

    scale = defaultFor(scale, holder.data('scale'));
    e.dataset.scale = scale;

    if (px !== -1)
        e.style.left = px * holder.data('gridUnitX') + 'px';
    if (py !== -1)
        e.style.top  = py * holder.data('gridUnitY') + 'px';
    if (dx !== -1)
        e.style.width   = dx * holder.data('gridUnitX') + 'px';
    if (dy !== -1)
        e.style.height  = dy * holder.data('gridUnitY') + 'px';

    return e;
}

function sensorTemplate(e) {
    var scale = e.dataset.scale;

    var s0 = document.createElement('div');
    s0.style.position = 'absolute';
    s0.style.fontSize = 13*scale + 'px';
    s0.style.left = 5*scale + 'px';
    s0.innerHTML = this.name;
    s0.innerHTML += '<br>' + this.comment;
 
    var s1 = document.createElement('div');
    s1.id = this.id;
    s1.style.position = 'absolute';
    s1.style.fontSize = 50*scale + 'px';
    s1.style.right = 6*scale + 'px';
    s1.style.bottom = 0*scale + 'px';
    s1.innerHTML = (this.value === undefined)
        ? 'NAN'
        : this.value.toFixed(3);

    var s2 = document.createElement('div');
    s2.style.position = 'absolute';
    s2.style.fontSize = 12*scale + 'px';
    s2.style.right = 5*scale + 'px';
    s2.style.top = 20*scale + 'px';
    s2.innerHTML = this.unit;

    e.appendChild(s0);
    e.appendChild(s1);
    e.appendChild(s2);
}

function sensorFetchData1() {
    var id = this.id;
    $.get(this.url, function(data) {
        var arrayOfData = data.split(',');
        var value = parseFloat(
                arrayOfData[arrayOfData.length-1]
                ).toFixed(1);
        $('#'+id).html(value);
    });
}

function sensorFetchData() {
    var sensor = this;
    $.get(sensor.url, function(data) {
        var arrayOfData = data.split(',');
        var value = parseFloat(
                arrayOfData[arrayOfData.length-1]);
        sensor.value = value;
    });
}


function addSensor(px, py, sensorId, scale) {
    var e = newWidget(px, py, 4, 2, scale);
    e.className = 'tile';
    drawSensor = sensorTemplate.bind(SNS[sensorId]);
    drawSensor(e);
    return e;
}

function addSubSensor(px, py, sensorId, scale) {
    var e = newWidget(px, py, 4, 2, scale);
    e.className = 'subtile';
    drawSensor = sensorTemplate.bind(SNS[sensorId]);
    drawSensor(e);
    return e;
}

function updateSensor(sensor) {
    var fetch = sensorFetchData.bind(sensor);
    fetch();
}

function updateAllSensors() {
    for (var key in SNS) {
        sensor = SNS[key];
        updateSensor(sensor);
        var value = (sensor.value === undefined)
            ? 'NAN'
            : sensor.value.toFixed(3);
        $('#'+sensor.id).html(value);
    }
}

function sensorGroupTemplate(e) {
    

}

/*
 * Find size of contents
 */
function contentSize() {
    /*
    var width = 0;
    var height = 0;
    $(this).find('.tile').each(function() {
        var w = $(this).offset().left 
                + $(this).css('width').toNum() 
                - $('.canvas').offset().left 
                - $('.canvas').css("borderLeftWidth").toNum();
        var h = $(this).offset().top 
                + $(this).css('height').toNum()
                - $('.canvas').offset().top 
                - $('.canvas').css("borderTopWidth").toNum();
        if (w > width) width = w;
        if (h > height) height = h;
    });
    console.log(width, height);
    */
    var width = 0;
    var height = this.contentWindow.document.body.scrollHeight;
    return {width: width, height: height};
}


function addSensorGroup2(dx, dy, px, py, name, scale) {
    var drawGroup = sensorGroupTemplate.bind(GRP['group1']);
    var e = newWidget(px, py, dx, dy, scale);

    var el = document.createElement('ul');
    $(el).append($('<li class="ui-state-default">'+addSensor(0,0,'sensor1').outerHTML+'</li>'));
    $(el).append($('<li class="ui-state-default">'+addSensor(0,0,'sensor2').outerHTML+'</li>'));
    $(el).sortable()
        .disableSelection();
    $(e).append($(el));


    /*
    e.innerHTML += (addSensor(0,0,'sensor1')).outerHTML;
    e.innerHTML += (addSensor(4,0,'sensor2')).outerHTML;
    */

    //drawGroup(e);
    $(e).appendTo(this);

    var s = contentSize.call($(e));
    alert(s);

    $(e).addClass('group ui-widget-content')
        //.sortable()
        //.disableSelection()
        .resizable({ 
            grid: $('.canvas').data('gridUnitX'),
            minWidth: s.width - $('.canvas').data('gridUnitX'),
            minHeight: s.height- $('.canvas').data('gridUnitY'),
            handles: 'ne, se',
            containment: 'parent',
        })
        .draggable({
            grid: [$('.canvas').data('gridUnitX'),$('.canvas').data('gridUnitY')],
            containment: 'parent',
        });


    
    console.log(e.offsetWidth);
    console.log(e.clientWidth);
    
    return e;
}

function groupTemplate(e) {
    var scale = e.dataset.scale;
    var s0 = document.createElement('div');
    s0.style.position = 'absolute';
    s0.style.fontSize = 1.8*scale+'em';
    s0.style.left = 5*scale + 'px';
    s0.innerHTML = this.name;
    //s0.innerHTML += '<br>' + this.comment;
    $(e).append($(s0));
};

function addSensorGroup(px, py, dx, dy, groupId, scale) {
    var w = newWidget(px, py, dx, dy, scale);
    var drawGroup = groupTemplate.bind(GRP['group1']);
    drawGroup(w);

    $(w).addClass('group')
        .draggable({
            grid: [$('.canvas').data('gridUnitX'),$('.canvas').data('gridUnitY')],
            containment: 'parent',
        })
        .resizable({
            grid: $('.canvas').data('gridUnitX'),
            handles: 'ne, se',
            containment: 'parent',
            stop: function() {
                var width = $(this).children('.sortable_container').css('width').toNum();
                var height = $(this).children('.sortable_container').css('height').toNum();
                if ( $(this).css('width').toNum() < width ) {
                    $(this).css('width', width);
                }
                if ( $(this).css('height').toNum() - 1 < height ) {
                    $(this).css('height', height + $('.canvas').data('gridUnitX'));
                }
            },
        });

    var c = newWidget(0,1,-1,-1,scale);
    $(c).addClass('sortable_container')
        .sortable();

    s1 = addSubSensor(0,0,'sensor1',scale);
    s2 = addSubSensor(0,0,'sensor2',scale);
    $(c).append($(s1));
    $(c).append($(s2));

    for (var i=0; i<6; i++) {
        var t = newWidget(0,0,2,2,scale);
        t.className = 'subtile';
        t.innerHTML = "<div style='position: absolute; right: 5px'>"+3*i+"</div>";
        $(c).append($(t));
    }

    $(w).append($(c));
    $(this).append($(w));
}
