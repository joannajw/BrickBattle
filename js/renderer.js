// This js file abstracts away the rendering aspects of three.js
// Unless you are interested, do not read into this file.

var Renderer = Renderer || {
    // internal variables
    _canvas     : undefined,
    _renderer   : undefined,
    _controls   : undefined,
    _camera     : undefined,
    _scene      : undefined,
    _raycaster  : undefined,
    _width      : undefined,
    _height     : undefined,
    _aspect     : undefined,

};

Renderer.getDims = function() {
    var width  = window.innerWidth;
    var height = window.innerHeight;
    if (Gui.values.windowSize !== "full") {
        var parts = Gui.values.windowSize.split('x');
        width  = parseInt(parts[0]);
        height = parseInt(parts[1]);
    }
    Renderer._width  = width;
    Renderer._height = height;
    Renderer._aspect = width/height;
};

Renderer.create = function( scene, canvas ) {
    Renderer.getDims();

    // Canvas and rendering setup
    Renderer._canvas = canvas;
    Renderer._renderer = new THREE.WebGLRenderer( { canvas:canvas, antialias: true, preserveDrawingBuffer: true } );
    Renderer._renderer.setPixelRatio( window.devicePixelRatio );
    Renderer._renderer.setSize( Renderer._width, Renderer._height );
    Renderer._renderer.setClearColor( 0x444444 );//c5e1d7

    window.addEventListener( "resize",    Renderer.onWindowResize, false );
    canvas.addEventListener( "mouseup",   Renderer.onMouseUp,      false );
    canvas.addEventListener( "mousedown", Renderer.onMouseDown,    false );

    document.body.appendChild( Renderer._renderer.domElement );

    // Create camera and setup controls
    Renderer._camera   = new THREE.PerspectiveCamera ( 55, Renderer._aspect, 0.01, 10000 );
    Renderer._camera.position.set( 0, 0, 800 );

    Renderer._camera2   = new THREE.PerspectiveCamera ( 55, Renderer._aspect, 0.01, 10000 );
    Renderer._camera2.position.set( 0, 0, -800 );


    Renderer._controls = new THREE.TrackballControls ( Renderer._camera, Renderer._renderer.domElement );
    Renderer._controls2 = new THREE.TrackballControls ( Renderer._camera2, Renderer._renderer.domElement );

    // make sure renderer is aware of the scene it is rendering
    Renderer._scene = scene._scene;

    // create raycaster
    Renderer._mouse = new THREE.Vector2;
    Renderer._raycaster = new THREE.Raycaster();
};

Renderer.onWindowResize = function () {
    Renderer.getDims();

    Renderer._camera.aspect = Renderer._aspect;
    Renderer._camera.updateProjectionMatrix();

    Renderer._camera2.aspect = Renderer._aspect;
    Renderer._camera2.updateProjectionMatrix();

    Renderer._renderer.setSize( Renderer._width, Renderer._height );
};


Renderer.update = function () {

    ParticleEngine.step();

    Renderer._controls.update();

    var r = Renderer._renderer;

    var spacing = 3;

    r.setViewport(0, 0, Renderer._width / 2 - spacing, Renderer._height);
    r.setScissor(0, 0, Renderer._width / 2 - spacing, Renderer._height);
    r.render(Renderer._scene, Renderer._camera);

    Renderer._renderer.autoClear = false;

    r.setViewport(Renderer._width / 2 + spacing, 0, Renderer._width / 2, Renderer._height);
    r.setScissor(Renderer._width / 2 + spacing, 0, Renderer._width / 2, Renderer._height);
    r.render(Renderer._scene, Renderer._camera2);

    Renderer._renderer.autoClear = true;

    requestAnimationFrame( Renderer.update );

}

Renderer.snapShot = function () {
    // get the image data
    try {
        var dataURL = Renderer._renderer.domElement.toDataURL();
    }
    catch( err ) {
        alert('Sorry, your browser does not support capturing an image.');
        return;
    }

    // this will force downloading data as an image (rather than open in new window)
    var url = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    window.open( url );
}

// add event listener that will cause 'I' key to download image
window.addEventListener( 'keyup', function( event ) {
    // only respond to 'I' key
    if ( event.which == 73 ) {
        Renderer.snapShot();
    }
});

window.addEventListener( 'keyup', function( event ) {
    // only respond to 'Spacebar' key
    if ( event.which == 32 ) {
        // ParticleEngine.pause();
    }
});