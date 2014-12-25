 var windowWidth = window.innerWidth, windowHeight = window.innerHeight;
 var camera,renderer,scene;
var delta = 1.0;
var earthMesh;
 window.onload = function (){
    console.log("onload");
    Init();
    animate();
 };

function Init(){
        scene = new THREE.Scene();
       //setup camera
        camera = new LeiaCamera({
           cameraPosition:new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z), 
		   targetPosition: new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z)
        });
        scene.add(camera);
  
       //setup rendering parameter
 		renderer = new LeiaWebGLRenderer({
         antialias:true, 
 		renderMode: _renderMode, 
		shaderMode: _nShaderMode,
		colorMode : _colorMode,
		devicePixelRatio: 1 
        } );
 		renderer.Leia_setSize( windowWidth, windowHeight );
        renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
 		document.body.appendChild( renderer.domElement );
  
       //add object to Scene
        addObjectsToScene();
  
        //add Light
 		addLights();
  
        //add Gyro Monitor
        //addGyroMonitor();
 }

 function animate() 
 {
 	requestAnimationFrame( animate );
    renderer.setClearColor(new THREE.Color().setRGB(0.0, 0.0, 0.0)); 
   earthMesh.rotation.y  = LEIA.time;
	renderer.Leia_render({
     scene:scene, 
     camera:camera,
     holoScreenSize:_holoScreenSize,
     holoCamFov:_camFov,
      upclip: _up,
     downclip:  _down,
     messageFlag:_messageFlag
   });
 }

function addObjectsToScene(){
    //Add your objects here
    var geometry	= new THREE.SphereGeometry(8, 32, 32);
	var material	= new THREE.MeshPhongMaterial({
		map		: THREE.ImageUtils.loadTexture('resource/earthmap1k.jpg'),
		bumpMap		: THREE.ImageUtils.loadTexture('resource/earthbump1k.jpg'),
		bumpScale	: 0.05,
		specularMap	: THREE.ImageUtils.loadTexture('resource/earthspec1k.jpg'),
		specular	: new THREE.Color('grey'),
	});
	earthMesh	= new THREE.Mesh(geometry, material);
  	earthMesh.castShadow = true;
	earthMesh.receiveShadow = true;
    scene.add(earthMesh);
  
  // setBackgroundPlane('resource/space1.jpg');
}

function addLights(){
    //Add Lights Here
    var xl = new THREE.DirectionalLight( 0x555555 );
 	xl.position.set( 1, 0, 2 );
 //	scene.add( xl );
 	var light = new THREE.SpotLight( 0xffffff);
	//light.color.setHSL( Math.random(), 1, 0.5 );
 	light.position.set(0,90,90);
    light.shadowCameraVisible = true;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 512;
    light.shadowDarkness = 0.7;
 //	scene.add(light);
 	var ambientLight = new THREE.AmbientLight(0xaaaaaa);	
 	scene.add(ambientLight);
}

function setBackgroundPlane(filename, aspect){
	var foregroundPlaneTexture = new THREE.ImageUtils.loadTexture( filename );
	foregroundPlaneTexture.wrapS = foregroundPlaneTexture.wrapT = THREE.RepeatWrapping; 
	foregroundPlaneTexture.repeat.set( 1, 1 );
	
  //
    var planeMaterial = new THREE.MeshPhongMaterial( {map: foregroundPlaneTexture, color: 0xffdd99 } );
    var backgroundPlaneGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);
	backgroundPlane = new THREE.Mesh(backgroundPlaneGeometry,   planeMaterial);
	backgroundPlane.position.z = -10;
	backgroundPlane.castShadow = false;
	backgroundPlane.receiveShadow = true;
	scene.add(backgroundPlane);
}