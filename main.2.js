/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
{ 
			// Level 0 includes
			ModulesLoader.requireModules(["threejs/three.js"]) ;
			ModulesLoader.requireModules([ "myJS/ThreeRenderingEnv.js", 
				"myJS/ThreeLightingEnv.js", 
				"myJS/ThreeLoadingEnv.js", 
				"myJS/navZ.js",
				"FlyingVehicle.js"]) ;
			ModulesLoader.requireModules(["fonts/helvetiker_regular.typeface.js","fonts/helvetiker_bold.typeface.js"]);
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
		) ;

function start(){
	//	----------------------------------------------------------------------------
	//	MAR 2014 - nav test
	//	author(s) : Cozot, R. and Lamarche, F.
	//	date : 11/16/2014
	//	last : 11/25/2014
	//	---------------------------------------------------------------------------- 			
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed


	var clock = new THREE.Clock();
	clock.start();
	var currentlyPressedKeys = {};
	
	// car Position
	var CARx = -220; 
	var CARy = 0 ; 
	var CARz = 0 ;
	var CARtheta = 0 ; 
	// car speed
	var dt = 0.05; 
	var dx = 1.0;









	// car Position
	var CAR2x = -220; 
	var CAR2y = 0 ; 
	var CAR2z = 0 ;
	var CAR2theta = 0 ; 
	// car speed
	var dt2 = 0.05; 
	var dx2 = 1.0;











	//lap numbers
	var lap = -1;

	//lap numbers
	var lapMachine = -1;

	//previous area
	var prevArea;

	//current area
	var currentArea = 0;

	//previous area
	var prevArea2;

	//current area
	var currentArea2 = 0;

	// Creates the vehicle (handled by physics)
	var vehicle = new FlyingVehicle(
	{
		position: new THREE.Vector3(CARx, CARy, CARz),
		zAngle : CARtheta+Math.PI/2.0,
	}


	);






	// Creates the vehicle (handled by physics)
	var vehicle2 = new FlyingVehicle(
	{
		position: new THREE.Vector3(CAR2x, CAR2y, CAR2z),
		zAngle : CAR2theta+Math.PI/2.0,
	}) ;
	





	//	rendering env
	var RC =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',RC,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();

	//	Meshes
	Loader.loadMesh('assets','border_Zup_02','obj',	RC.scene,'border',	-340,-340,0,'front');
	Loader.loadMesh('assets','ground_Zup_03','obj',	RC.scene,'ground',	-340,-340,0,'front');
	Loader.loadMesh('assets','circuit_Zup_02','obj',RC.scene,'circuit',	-340,-340,0,'front');
	//Loader.loadMesh('assets','tree_Zup_02','obj',	RC.scene,'trees',	-340,-340,0,'double');
	Loader.loadMesh('assets','arrivee_Zup_01','obj',	RC.scene,'decors',	-340,-340,0,'front');











	//	Car
	// car Translation
	var car0 = new THREE.Object3D(); 
	car0.name = 'car0'; 
	RC.addToScene(car0); 
	// initial POS
	car0.position.x = CARx;
	car0.position.y = CARy;
	car0.position.z = CARz;
	// car Rotation floor slope follow
	var car1 = new THREE.Object3D(); 
	car1.name = 'car1';
	car0.add(car1);
	// car vertical rotation
	var car2 = new THREE.Object3D(); 
	car2.name = 'car2';
	car1.add(car2);
	car2.rotation.z = CARtheta ;
	// the car itself 
	// simple method to load an object
	var car3 = Loader.load({filename: 'assets/car_Zup_01.obj', node: car2, name: 'car3'}) ;
	car3.position.z= +0.25 ;
	// attach the scene camera to car
	car3.add(RC.camera) ;







	//	Car
	// car Translation
	var c2ar0 = new THREE.Object3D(); 
	c2ar0.name = 'c2ar0'; 
	RC.addToScene(c2ar0); 
	// initial POS
	c2ar0.position.x = CAR2x;
	c2ar0.position.y = CAR2y;
	c2ar0.position.z = CAR2z;
	// car Rotation floor slope follow
	var c2ar1 = new THREE.Object3D(); 
	c2ar1.name = 'c2ar1';
	c2ar0.add(c2ar1);
	// car vertical rotation
	var c2ar2 = new THREE.Object3D(); 
	c2ar2.name = 'c2ar2';
	c2ar1.add(c2ar2);
	c2ar2.rotation.z = CAR2theta ;
	// the car itself 
	// simple method to load an object
	var c2ar3 = Loader.load({filename: 'assets/car_Zup_02.obj', node: c2ar2, name: 'c2ar3'}) ;
	c2ar3.position.z= +0.25 ;
	//c2ar3.add(RC.camera) ;










	RC.camera.position.x = 0.0 ;
	RC.camera.position.z = 10.0 ;
	RC.camera.position.y = -25.0 ;
	RC.camera.rotation.x = 85.0*3.14159/180.0 ;

	var meshMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );

	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', RC.scene, 'sky',4000);

	//	Planes Set for Navigation 
	// 	z up 
	var NAV = new navPlaneSet(
					new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01	
	NAV.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02		
	NAV.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03		
	NAV.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04		
	NAV.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05		
	NAV.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06		
	NAV.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07		
	NAV.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08		
	NAV.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09		
	NAV.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10		
	NAV.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11		
	NAV.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12		
	NAV.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13 		
	NAV.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14		
	NAV.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15		
	NAV.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16	
	NAV.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17	
	NAV.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18	
	NAV.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19	
	NAV.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20	
	NAV.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21		
	NAV.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22		
	NAV.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23		
	NAV.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24		
	NAV.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25		
	NAV.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26		
	NAV.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27	
	NAV.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28	
	NAV.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29	
	NAV.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30			
	NAV.setPos(CARx,CARy,CARz); 
	NAV.initActive();


	var NAV2 = new navPlaneSet(
					new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01	
	NAV2.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02		
	NAV2.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03		
	NAV2.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04		
	NAV2.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05		
	NAV2.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06		
	NAV2.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07		
	NAV2.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08		
	NAV2.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09		
	NAV2.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10		
	NAV2.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11		
	NAV2.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12		
	NAV2.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13 		
	NAV2.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14		
	NAV2.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15		
	NAV2.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16	
	NAV2.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17	
	NAV2.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18	
	NAV2.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19	
	NAV2.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20	
	NAV2.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21		
	NAV2.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22		
	NAV2.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23		
	NAV2.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24		
	NAV2.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25		
	NAV2.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26		
	NAV2.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27	
	NAV2.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28	
	NAV2.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29	
	NAV2.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30*/			
	NAV2.setPos(CAR2x,CAR2y,CAR2z); 
	NAV2.initActive();






	// DEBUG
	//NAV.debug();
	//var navMesh = NAV.toMesh();
	//RC.addToScene(navMesh);
	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks 
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;					

	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true;}
	function handleKeyUp(event) {currentlyPressedKeys[event.keyCode] = false;}

	function handleKeys() {
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			RC.scene.traverse(function(o){
				//console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}				
		if (currentlyPressedKeys[68]) // (D) Right
		{
			vehicle.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{		
			vehicle.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			vehicle.goFront(1200, 1200) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			vehicle.brake(100) ;
		}
	}

	//	window resize
	function  onWindowResize() {RC.onWindowResize(window.innerWidth,window.innerHeight);}

	function render() { 
		requestAnimationFrame( render );
		handleKeys();


		// Vehicle stabilization 
		vehicle.stabilizeSkid(50) ; 
		vehicle.stabilizeTurn(1000) ;
		var oldPosition = vehicle.position.clone() ;
		vehicle.update(1.0/60) ;
		var newPosition = vehicle.position.clone() ;
		newPosition.sub(oldPosition) ;


		// Vehicle stabilization 
		vehicle2.stabilizeSkid(50) ; 
		vehicle2.stabilizeTurn(1000) ;
		var oldPosition2 = vehicle2.position.clone() ;
		vehicle2.update(1.0/60) ;
		var newPosition2 = vehicle2.position.clone() ;
		newPosition2.sub(oldPosition2) ;


		// NAV
		NAV2.move(newPosition2.x, newPosition2.y, 150,10) ;

		// NAV
		NAV.move(newPosition.x, newPosition.y, 150,10) ;


		// car0
		car0.position.set(NAV.x, NAV.y, NAV.z) ;
		// Updates the vehicle
		vehicle.position.x = NAV.x ;
		vehicle.position.y = NAV.y ;
		// Updates car1
		car1.matrixAutoUpdate = false;		
		car1.matrix.copy(NAV.localMatrix(CARx,CARy));
		// Updates car2
		car2.rotation.z = vehicle.angles.z-Math.PI/2.0 ;


		// car0
		c2ar0.position.set(NAV2.x, NAV2.y, NAV2.z) ;
		// Updates the vehicle
		vehicle2.position.x = NAV2.x ;
		vehicle2.position.y = NAV2.y ;
		// Updates car1
		c2ar1.matrixAutoUpdate = false;		
		c2ar1.matrix.copy(NAV2.localMatrix(CAR2x,CAR2y));
		// Updates car2
		c2ar2.rotation.z = vehicle2.angles.z-Math.PI/2.0 ;
		



		var carr = RC.scene.getObjectByName( "car0" );

		var pos = NAV.findActive(carr.position.x,carr.position.y);


		var carr2 = RC.scene.getObjectByName( "c2ar0" );

		var pos2 = NAV2.findActive(carr2.position.x,carr2.position.y);


		var vitmax = 1200;

		if (pos2 == 0  || pos2 == 4 ||  pos2 == 6 
			|| pos2 == 7 || pos2 == 9
			|| pos2 == 13	|| pos2 == 17
			|| pos2 == 23 || pos2 == 27){
			vehicle2.goFront(vitmax, vitmax);
		}

		//Accé et gauche
		if (pos2 == 21){
			vehicle2.goFront(100, 100) ;
		}

		//Accé et gauche
		if (pos2 == 15){
			if(lapMachine >=1){
				vehicle2.goFront(1050, 1050) ;
			}
			else{
				vehicle2.goFront(vitmax, vitmax) ;
			}
		}

		

		//Freiner et gauche
		if (pos2 == 22 ){
			if(lapMachine >=1){
				vehicle2.brake(70) ;
				vehicle2.turnLeft(600) ;
				vehicle2.goFront(100, 100) ;
			}
			else{
				vehicle2.brake(20) ;
				vehicle2.turnLeft(150) ;
				vehicle2.goFront(100, 100) ;
			}	

		}

		//Freiner et gauche
		if (pos2 == 19 ||pos2 == 18){
			vehicle2.brake(24) ;
			vehicle2.turnLeft(100) ;
		}

		//Freiner et gauche
		if (pos2 == 28 ){
			if(lapMachine >=1){
				vehicle2.goFront(vitmax, vitmax);
			}
			else{
				vehicle2.goFront(vitmax, vitmax);
				vehicle2.turnLeft(220) ;
			}
		}

		if (pos2 == 29){
			if(lapMachine >=1){
				if(lapMachine ==1){
					vehicle2.goFront(vitmax, vitmax);
					vehicle2.turnLeft(20);
				}
				if(lapMachine >1){
					vehicle2.goFront(vitmax, vitmax);
					vehicle2.turnRight(80);
				}
			}
			else{
				vehicle2.goFront(vitmax, vitmax);
			}
		}


		//Freiner et droite
		if (pos2 == 1){
			if(lapMachine >=1){
				vehicle2.brake(45) ;
				vehicle2.turnRight(100) ;
			}
			else{
				vehicle2.brake(20) ;
				vehicle2.turnRight(100) ;
			}
		}


		//Freiner et droite
		if (pos2 == 5|| pos2 == 10 || pos2 == 11 
			|| pos2 == 14 || pos2 == 24	|| pos2 == 25){
			vehicle2.brake(20) ;
			vehicle2.turnRight(100) ;

		}

		//Freiner et droite
		if (pos2 == 12){
			if(lapMachine >=1){
				if (lapMachine ==1){
					vehicle2.brake(20) ;
					vehicle2.turnRight(145) ;
				}
				if(lapMachine >1){
					vehicle2.brake(20) ;
					vehicle2.turnRight(165) ;
				}
			}
			else{
				vehicle2.brake(20) ;
				vehicle2.turnRight(100) ;
			}
		}

		//Accé et gauche
		if (pos2 == 2 || pos2 == 8){
			vehicle2.goFront(vitmax, vitmax) ;
			vehicle2.turnLeft(200) ;
		}

		//Accé et gauche
		if (pos2 == 20){
			vehicle2.goFront(vitmax, vitmax) ;
			vehicle2.turnLeft(210) ;
		}

		//Accé et droite
		if (pos2 == 26){
			if(lapMachine >=1){
				vehicle2.goFront(vitmax, vitmax) ;
				vehicle2.turnRight(95) ;

			}
			else{
				vehicle2.goFront(vitmax, vitmax) ;
				vehicle2.turnRight(170) ;
			}
		}
		
		//Accé et droite
		if (pos2 == 3 || pos2 == 16){
			vehicle2.goFront(vitmax, vitmax) ;
			vehicle2.turnRight(200) ;
		}

		if(pos != currentArea){
			prevArea = currentArea;
			currentArea = pos;

			if(prevArea == 0 && currentArea == 1){
				if(lap >-1){
					car3.remove(RC.scene.getObjectByName( 'vide'+lap ));
					car3.remove(RC.scene.getObjectByName( 'temps'+lap ));
				}

				lap++;

				var vide = new THREE.Object3D();
				vide.name = 'vide'+lap;
				car3.add(vide) ;
				vide.position.x = -20.0 ;
				vide.position.z = 23.0 ;
				vide.position.y = 0.0 ;
				vide.rotation.x = 100.0*3.14159/180.0 ;
				var text = new THREE.TextGeometry( "Tours : " +lap,{size:2,height:1,curveSegments: 2});			
				var textMesh = new THREE.Mesh(text,meshMaterial);
				vide.add(textMesh);

				var temps = new THREE.Object3D();
				temps.name = 'temps'+lap;
				car3.add(temps) ;
				temps.position.x = 7.0 ;
				temps.position.z = 23.0 ;
				temps.position.y = 0.0 ;
				temps.rotation.x = 100.0*3.14159/180.0 ;
				var nb = clock.getDelta ();
				var n = nb.toPrecision(4); 
				var text = new THREE.TextGeometry( "Temps : " + n,{size:2,height:1,curveSegments: 2});			
				var textMesh = new THREE.Mesh(text,meshMaterial);
				
				if(lap!=0){
					temps.add(textMesh);
				}
			}

		}

		if(pos2 != currentArea2){
			prevArea2 = currentArea2;
			currentArea2 = pos2;
			if(prevArea2 == 0 && currentArea2 == 1){
				lapMachine++;
				console.log("lapMachine"+lapMachine)

			}
		}

		console.log("zone"+pos2)
		// Rendering
		RC.renderer.render(RC.scene, RC.camera); 
	};

	render(); 
}
