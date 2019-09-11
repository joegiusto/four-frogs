
var s = function (sel) { return document.querySelector(sel); };
var sId = function (sel) { return document.getElementById(sel); };
var removeClass = function (el, clss) {
    el.className = el.className.replace(new RegExp('\\b' + clss + ' ?\\b', 'g'), '');
}
var joysticks = {
    dynamic: {
        zone: s('.zone.dynamic'),
        color: 'blue',
        multitouch: true
    },
    semi: {
        zone: s('.zone.semi'),
        mode: 'semi',
        catchDistance: 150,
        color: 'white'
    },
    static: {
        zone: s('.zone.static'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: 'green',
    }
};
var joystick;

// Get debug elements and map them
var elDebug = sId('debug');
var elDump = elDebug.querySelector('.dump');
var els = {
    position: {
        x: elDebug.querySelector('.position .x .data'),
        y: elDebug.querySelector('.position .y .data')
    },
    force: elDebug.querySelector('.force .data'),
    pressure: elDebug.querySelector('.pressure .data'),
    distance: elDebug.querySelector('.distance .data'),
    angle: {
        radian: elDebug.querySelector('.angle .radian .data'),
        degree: elDebug.querySelector('.angle .degree .data')
    },
    direction: {
        x: elDebug.querySelector('.direction .x .data'),
        y: elDebug.querySelector('.direction .y .data'),
        angle: elDebug.querySelector('.direction .angle .data')
    }
};

var timeoutCreate;
function createThrottle (evt) {
    clearTimeout(timeoutCreate);
    timeoutCreate = setTimeout(() => {
        createNipple(evt);
    }, 100);
}

// sId('buttons').onclick = sId('buttons').ontouchend = createThrottle;

createNipple('static');

function bindNipple () {
    joystick.on('start end', function (evt, data) {
        dump(evt.type);
        debug(data);
    }).on('move', function (evt, data) {
        debug(data);
        if (data.force > 0.3) {
            if (data.angle.degree >= 337.5 || data.angle.degree < 22.5) {
                console.log('right');
                movement.down = false;
                movement.up = false;
                movement.left = false;
                movement.right = true;
            } else if (data.angle.degree >= 22.5 && data.angle.degree < 67.5){
                console.log('top-right');
                movement.down = false;
                movement.up = true;
                movement.left = false;
                movement.right = true;
            } else if (data.angle.degree >= 67.5 && data.angle.degree < 112.5){
                console.log('top');
                movement.down = false;
                movement.up = true;
                movement.left = false;
                movement.right = false;
            } else if (data.angle.degree >= 112.5 && data.angle.degree < 157.5){
                console.log('top-left');
                movement.down = false;
                movement.up = true;
                movement.left = true;
                movement.right = false;
            } else if (data.angle.degree >= 157.5 && data.angle.degree < 202.5){
                console.log('left');
                movement.down = false;
                movement.up = false;
                movement.left = true;
                movement.right = false;
            } else if (data.angle.degree >= 202.5 && data.angle.degree < 247.5){
                console.log('bottom-left');
                movement.down = true;
                movement.up = false;
                movement.left = true;
                movement.right = false;
            } else if (data.angle.degree >= 247.5 && data.angle.degree < 292.5){
                console.log('bottom');
                movement.down = true;
                movement.up = false;
                movement.left = false;
                movement.right = false;
            } else if (data.angle.degree >= 292.5 && data.angle.degree < 337.5){
                console.log('bottom-right');
                movement.down = true;
                movement.up = false;
                movement.left = false;
                movement.right = true;
            }
        } else {
            movement.up = false;
            movement.down = false;
            movement.right = false;
            movement.left = false;
        }
        
    }).on('dir:up plain:up dir:left plain:left dir:down ' +
        'plain:down dir:right plain:right',
        function (evt, data) {
            dump(evt.type);
        }
    ).on('pressure', function (evt, data) {
        debug({pressure: data});
    })
    // .on('plain:down', (evt, data) => {
    //     movement.down = true;
    //     movement.up = false;
    // }).on('plain:up', (evt, data) => {
    //     movement.up = true;
    //     movement.down = false;
    // }).on('plain:right', () => {
    //     movement.right = true;
    //     movement.left = false;
    // }).on('plain:left', () => {
    //     movement.right = false;
    //     movement.left = true;
    // }).on('dir:left', () => {
    //     movement.up = false;
    //     movement.down = false;
    //     movement.right = false;
    //     movement.left = true;
    // }).on('dir:right', () => {
    //     movement.up = false;
    //     movement.down = false;
    //     movement.right = true;
    //     movement.left = false;
    // }).on('dir:up', () => {
    //     movement.up = true;
    //     movement.down = false;
    //     movement.right = false;
    //     movement.left = false;
    // }).on('dir:down', () => {
    //     movement.up = false;
    //     movement.down = true;
    //     movement.right = false;
    //     movement.left = false;
    .on('end', () => {
         movement.up = false;
        movement.down = false;
        movement.right = false;
        movement.left = false;
     })
    ;
}

function createNipple (evt) {

    if (joystick) {
        joystick.destroy();
    }

    joystick = nipplejs.create(joysticks['static']);
    bindNipple();
}

// Print data into elements
function debug (obj) {
    function parseObj(sub, el) {
        for (var i in sub) {
            if (typeof sub[i] === 'object' && el) {
                parseObj(sub[i], el[i]);
            } else if (el && el[i]) {
                el[i].innerHTML = sub[i];
            }
        }
    }
    setTimeout(function () {
        parseObj(obj, els);
    }, 0);
}

var nbEvents = 0;

// Dump data
function dump (evt) {
    setTimeout(function () {
        if (elDump.children.length > 4) {
            elDump.removeChild(elDump.firstChild);
        }
        var newEvent = document.createElement('div');
        newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
            evt + '</span>';
        elDump.appendChild(newEvent);
        nbEvents += 1;
    }, 0);
}