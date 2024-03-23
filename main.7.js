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
				"FlyingVehicle.js",
				"ParticleSystem.js",
				"MathExt.js",
				"Interpolators.js"]) ;
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
	
	var id;
	//	rendering env
	var RC =  new ThreeRenderingEnv();

	// camera position
	RC.camera.position.x = 0.0 ;
	RC.camera.position.z = 10.0 ;
	RC.camera.position.y = -25.0 ;
	RC.camera.rotation.x = 85.0*3.14159/180.0 ;

	// Courbes de Béziers
	var tabCurves = new Array();

	var curve = new THREE.CubicBezierCurve3
	(new THREE.Vector3(-140, 200, 70 ), 
	 new THREE.Vector3(-170, 190, 70 ),
	 new THREE.Vector3( -220, 170, 30 ),
	 new THREE.Vector3( -220, 0, 0 )
	); 

	var curve1 = new THREE.CubicBezierCurve3(
	 			new THREE.Vector3( 180, 80, 70),
	 			new THREE.Vector3( -80, 220, 80),
			 	new THREE.Vector3( -80, 220, 80),
			 	new THREE.Vector3(-140, 200, 70) 
				);

	var curve2 = new THREE.CubicBezierCurve3(
	 			new THREE.Vector3( 210,-160,40),
	 			new THREE.Vector3( 250, -10,20),
			 	new THREE.Vector3(  260,40,50),
			 	new THREE.Vector3(180, 80, 70) 
				);

	var curve3 = new THREE.CubicBezierCurve3(
	 			new THREE.Vector3( 20,-65,100),
	 			new THREE.Vector3( 90, -300,80),
			 	new THREE.Vector3(  150, -250,50),
			 	new THREE.Vector3(210,-160,40) 
				);


	var curve4 = new THREE.CubicBezierCurve3(
	 			new THREE.Vector3( -130,-150,100),
	 			new THREE.Vector3( -150,-100,110),
			 	new THREE.Vector3( -70,-50,110),
			 	new THREE.Vector3(20,-65,100)
				);

	var curve5 = new THREE.CubicBezierCurve3(
	 			new THREE.Vector3( -250,-180,50),
	 			new THREE.Vector3( -140,-300,50),
			 	new THREE.Vector3( -140,-300,50),
			 	new THREE.Vector3( -130,-150,100)
				);

	 var curve6 = new THREE.CubicBezierCurve3(
	  			new THREE.Vector3(-220, 0, 0 ),
	  			new THREE.Vector3( -220,-50,0 ),
	 		 	new THREE.Vector3( -250,-110,50),
	 		 	new THREE.Vector3( -250,-180,50)
	 			);

	tabCurves[0]= curve;
	tabCurves[1]= curve1;
	tabCurves[2]= curve2;
	tabCurves[3]= curve3;
	tabCurves[4]= curve4;
	tabCurves[5]= curve5;
	tabCurves[6]= curve6;
	
	var material = new THREE.LineBasicMaterial( { color : 0x000000, opacity: 1, blending: THREE.AdditiveBlending,  transparent: true} ); 

	var geometry = new THREE.Geometry(); 
	geometry.vertices = curve.getPoints( 500 ); 
	var curveObject = new THREE.Line( geometry, material );
	RC.scene.add(curveObject);

	var geometry1 = new THREE.Geometry(); 
	geometry1.vertices = curve1.getPoints( 500 ); 
	var curveObject1 = new THREE.Line( geometry1, material );
	RC.scene.add(curveObject1);

	var geometry2 = new THREE.Geometry(); 
	geometry2.vertices = curve2.getPoints( 500 ); 
	var curveObject2 = new THREE.Line( geometry2, material );
	RC.scene.add(curveObject2);

	var geometry3 = new THREE.Geometry(); 
	geometry3.vertices = curve3.getPoints( 500 ); 
	var curveObject3 = new THREE.Line( geometry3, material );
	RC.scene.add(curveObject3);

	var geometry4 = new THREE.Geometry(); 
	geometry4.vertices = curve4.getPoints( 500 ); 
	var curveObject4 = new THREE.Line( geometry4, material );
	RC.scene.add(curveObject4);

	var geometry5 = new THREE.Geometry(); 
	geometry5.vertices = curve5.getPoints( 500 ); 
	var curveObject5 = new THREE.Line( geometry5, material );
	RC.scene.add(curveObject5);

	var geometry6 = new THREE.Geometry(); 
	geometry6.vertices = curve6.getPoints( 500 ); 
	var curveObject6 = new THREE.Line( geometry6, material );
	RC.scene.add(curveObject6);
	// pas
	var pas = 1;
	// zone
	var zone = 0;
	//Fin courbes de Béziers

	//Horloges pour les temps
	var clockAvion = new THREE.Clock();
	var clockVoitureAuto = new THREE.Clock();
	var clockAvionAuto = new THREE.Clock();

	var nbToursAvionAuto = 0;
	var nbToursVoitureAuto = 0;
	var tempsTourAvionAuto = 0;
	var tempsTourVoitureAuto = 0;


	//	keyPressed
	var currentlyPressedKeys = {};
	
	// avion auto position
	var depart = curve.getPoint(1);
	var CARx = depart.x;//-220; 
	var CARy = depart.y;//0 ; 
	var CARz = depart.z;//0 ;
	var CARtheta = 0 ;
	// avion auto
	var dt = 0.05; 
	var dx = 1.0;

	// voiture auto Position
	var CAR2x = -220; 
	var CAR2y = 0 ; 
	var CAR2z = 0 ;
	var CAR2theta = 0 ; 
	// voiture auto speed
	var dt2 = 0.05; 
	var dx2 = 1.0;

	// avion controlable Position
	var CAR3x = -220; 
	var CAR3y = 0 ; 
	var CAR3z = 0 ;
	var CAR3theta = 0 ; 
	// avion controlable speed
	var dt3 = 0.05; 
	var dx3 = 1.0;

	//lap numbers avion
	var lapAvion = -1;
	//lap numbers avion auto
	var lapAvionAuto = 0;
	//lap numbers voiture auto
	var lapVoitureAuto = -1;

	//previous area
	var prevAreaAvion;

	//current area
	var currentAreaAvion = 0;

	//previous area
	var prevAreaVoitureAuto;

	//current area
	var currentAreaVoitureAuto = 0;

	// Creates the avionAuto (handled by physics)
	var avionAuto = new FlyingVehicle({
		position: new THREE.Vector3(CARx, CARy, CARz),
		zAngle : CARtheta+Math.PI/2.0,});

	// Creates the voitureAuto (handled by physics)
	var voitureAuto = new FlyingVehicle({
		position: new THREE.Vector3(CAR2x, CAR2y, CAR2z),
		zAngle : CAR2theta+Math.PI/2.0,}) ;

	// Creates the voitureAuto (handled by physics)
	var avion = new FlyingVehicle({
		position: new THREE.Vector3(CAR3x, CAR3y, CAR3z),
		zAngle : CAR3theta+Math.PI/2.0,}) ;

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

	//	Voiture Auto

	// car Translation
	var voitureAuto0 = new THREE.Object3D(); 
	voitureAuto0.name = 'voitureAuto0'; 
	RC.addToScene(voitureAuto0); 
	// initial POS
	voitureAuto0.position.x = CAR2x;
	voitureAuto0.position.y = CAR2y;
	voitureAuto0.position.z = CAR2z;
	// car Rotation floor slope follow
	var voitureAuto1 = new THREE.Object3D(); 
	voitureAuto1.name = 'voitureAuto1';
	voitureAuto0.add(voitureAuto1);
	// car vertical rotation
	var voitureAuto2 = new THREE.Object3D(); 
	voitureAuto2.name = 'voitureAuto2';
	voitureAuto1.add(voitureAuto2);
	voitureAuto2.rotation.z = CAR2theta ;
	// the car itself 
	// simple method to load an object
	var voitureAuto3 = Loader.load({filename: 'assets/car_Zup_02.obj', node: voitureAuto2, name: 'voitureAuto3'}) ;
	voitureAuto3.position.z= +0.25 ;


	//	Avion auto
	// car Translation
	var avionBezier0 = new THREE.Object3D(); 
	avionBezier0.name = 'avionBezier0'; 
	RC.addToScene(avionBezier0); 
	// initial POS
	avionBezier0.position.x = CARx;
	avionBezier0.position.y = CARy;
	avionBezier0.position.z = CARz;
	// car Rotation floor slope follow
	var avionBezier1 = new THREE.Object3D(); 
	avionBezier1.name = 'avionBezier1';
	avionBezier0.add(avionBezier1);
	// car vertical rotation
	var avionBezier2 = new THREE.Object3D(); 
	avionBezier2.name = 'avionBezier2';
	avionBezier1.add(avionBezier2);
	avionBezier2.rotation.z = CARtheta ;

	var corpsHelico = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: avionBezier2, name: 'corpsHelico'});

	var turbineD = new THREE.Object3D();

	var turbineDroite = Loader.load({filename: 'assets/helico/turbine.obj', node: turbineD, name: 'turbineDroite'});
	turbineDroite.position.x=8,5;
	turbineDroite.position.y=-3;
	turbineDroite.position.z=4;
	corpsHelico.add(turbineDroite);

	var turbineG = new THREE.Object3D();

	var turbineGauche = Loader.load({filename: 'assets/helico/turbine.obj', node: turbineG, name: 'turbineGauche'});
	turbineGauche.position.x=-8,5;
	turbineGauche.position.y=-3;
	turbineGauche.position.z=4;
	corpsHelico.add(turbineGauche);

	var axeD = new THREE.Object3D();

	var axeDroite = Loader.load({filename: 'assets/helico/axe.obj', node: axeD, name: 'axeDroite'}) ;
	axeDroite.position.x=0;
	axeDroite.position.y=1;
	axeDroite.position.z=0;
	turbineDroite.add(axeDroite);

	var axeG = new THREE.Object3D();

	var axeGauche = Loader.load({filename: 'assets/helico/axe.obj', node: axeG, name: 'axeGauche'}) ;
	axeGauche.position.x=0;
	axeGauche.position.y=1;
	axeGauche.position.z=0;
	turbineGauche.add(axeGauche);

	var turbineC = new THREE.Object3D();

	var turbineCentrale = Loader.load({filename:'assets/helico/turbine.obj', node: turbineC, name: 'turbineCentrale'});
	turbineCentrale.position.x=0;
	turbineCentrale.position.y=0;
	turbineCentrale.position.z=4;
	turbineCentrale.rotation.x=Math.PI/2.0;
	corpsHelico.add(turbineCentrale);

	var axeC = new THREE.Object3D();

	var axeCentral = Loader.load({filename: 'assets/helico/axe.obj', node: axeC, name: 'axeCentral'}) ;
	axeCentral.position.x=0;
	axeCentral.position.y=0.5;
	axeCentral.position.z=0;

	turbineCentrale.add(axeCentral);

	var pale1D = new THREE.Object3D();

	var pale1Droite = Loader.load({filename: 'assets/helico/pale2.obj', node: pale1D, name: 'pale1Droite'});
	pale1Droite.position.x=0;
	pale1Droite.position.y=2;
	pale1Droite.position.z=0;
	axeDroite.add(pale1Droite);

	var pale2D = new THREE.Object3D();

	var pale2Droite = Loader.load({filename: 'assets/helico/pale2.obj', node: pale2D, name: 'pale2Droite'});
	pale2Droite.position.x=0;
	pale2Droite.position.y=2;
	pale2Droite.position.z=0;
	pale2Droite.rotation.y=2*(Math.PI/3.0);
	axeDroite.add(pale2Droite);

	var pale3D = new THREE.Object3D();

	var pale3Droite = Loader.load({filename: 'assets/helico/pale2.obj', node: pale3D, name: 'pale3Droite'});
	pale3Droite.position.x=0;
	pale3Droite.position.y=2;
	pale3Droite.position.z=0;
	pale3Droite.rotation.y=-2*(Math.PI/3.0);
	axeDroite.add(pale3Droite);

	var pale1C = new THREE.Object3D();

	var pale1Centrale = Loader.load({filename: 'assets/helico/pale2.obj', node: pale1C, name: 'pale1Centrale'});
	pale1Centrale.position.x=0;
	pale1Centrale.position.y=2;
	pale1Centrale.position.z=0;
	axeCentral.add(pale1Centrale);

	var pale2C = new THREE.Object3D();

	var pale2Centrale = Loader.load({filename: 'assets/helico/pale2.obj', node: pale2C, name: 'pale2Centrale'});
	pale2Centrale.position.x=0;
	pale2Centrale.position.y=2;
	pale2Centrale.position.z=0;
	pale2Centrale.rotation.y=2*(Math.PI/3.0);
	axeCentral.add(pale2Centrale);

	var pale3C = new THREE.Object3D();

	var pale3Centrale = Loader.load({filename: 'assets/helico/pale2.obj', node: pale3C, name: 'pale3Centrale'});
	pale3Centrale.position.x=0;
	pale3Centrale.position.y=2;
	pale3Centrale.position.z=0;
	pale3Centrale.rotation.y=-2*(Math.PI/3.0);
	axeCentral.add(pale3Centrale);

	var pale1G = new THREE.Object3D();

	var pale1Gauche = Loader.load({filename: 'assets/helico/pale2.obj', node: pale1G, name: 'pale1Gauche'});
	pale1Gauche.position.x=0;
	pale1Gauche.position.y=2;
	pale1Gauche.position.z=0;
	axeGauche.add(pale1Gauche);

	var pale2G = new THREE.Object3D();

	var pale2Gauche = Loader.load({filename: 'assets/helico/pale2.obj', node: pale2G, name: 'pale2Gauche'});
	pale2Gauche.position.x=0;
	pale2Gauche.position.y=2;
	pale2Gauche.position.z=0;
	pale2Gauche.rotation.y=2*(Math.PI/3.0);
	axeGauche.add(pale2Gauche);

	var pale3G = new THREE.Object3D();

	var pale3Gauche = Loader.load({filename: 'assets/helico/pale2.obj', node: pale3G, name: 'pale3Gauche'});
	pale3Gauche.position.x=0;
	pale3Gauche.position.y=2;
	pale3Gauche.position.z=0;
	pale3Gauche.rotation.y=-2*(Math.PI/3.0);
	axeGauche.add(pale3Gauche);


	//Avion controlable
	// car Translation
	var avion0 = new THREE.Object3D(); 
	avion0.name = 'avion0'; 
	RC.addToScene(avion0); 
	// initial POS
	avion0.position.x = CAR3x;
	avion0.position.y = CAR3y;
	avion0.position.z = CAR3z;
	// car Rotation floor slope follow
	var avion1 = new THREE.Object3D(); 
	avion1.name = 'avion1';
	avion0.add(avion1);
	// car vertical rotation
	var avion2 = new THREE.Object3D(); 
	avion2.name = 'avion2';
	avion1.add(avion2);
	avion2.rotation.z = CAR2theta ;
	// the avion itself 
	var avion3 = Loader.load({filename: 'assets/helico/helicoCorpControlable.obj', node: avion2, name: 'avion3'}) ;
	avion3.position.z= +0.25 ;
	// attach the scene camera to car
	avion3.add(RC.camera) ;

	var t3urbineD = new THREE.Object3D();

	var turbineDroit3e = Loader.load({filename: 'assets/helico/turbine2.obj', node: t3urbineD, name: 'turbineDroit3e'});
	turbineDroit3e.position.x=8,5;
	turbineDroit3e.position.y=-3;
	turbineDroit3e.position.z=4;
	avion3.add(turbineDroit3e);

	var t3urbineG = new THREE.Object3D();

	var turbineGauch3e = Loader.load({filename: 'assets/helico/turbine2.obj', node: t3urbineG, name: 'turbineGauch3e'});
	turbineGauch3e.position.x=-8,5;
	turbineGauch3e.position.y=-3;
	turbineGauch3e.position.z=4;
	avion3.add(turbineGauch3e);

	var a3xeD = new THREE.Object3D();

	var axeDroit3e = Loader.load({filename: 'assets/helico/axe.obj', node: a3xeD, name: 'axeDroit3e'}) ;
	axeDroit3e.position.x=0;
	axeDroit3e.position.y=1;
	axeDroit3e.position.z=0;
	turbineDroit3e.add(axeDroit3e);

	var a3xeG = new THREE.Object3D();

	var axeGauch3e = Loader.load({filename: 'assets/helico/axe.obj', node: a3xeG, name: 'axeGauch3e'}) ;
	axeGauch3e.position.x=0;
	axeGauch3e.position.y=1;
	axeGauch3e.position.z=0;
	turbineGauch3e.add(axeGauch3e);

	var t3urbineC = new THREE.Object3D();

	var turbineCentral3e = Loader.load({filename:'assets/helico/turbine2.obj', node: t3urbineC, name: 'turbineCentral3e'});
	turbineCentral3e.position.x=0;
	turbineCentral3e.position.y=0;
	turbineCentral3e.position.z=4;
	turbineCentral3e.rotation.x=Math.PI/2.0;
	avion3.add(turbineCentral3e);

	var a3xeC = new THREE.Object3D();

	var axeCentra3l = Loader.load({filename: 'assets/helico/axe.obj', node: a3xeC, name: 'axeCentra3l'}) ;
	axeCentra3l.position.x=0;
	axeCentra3l.position.y=0.5;
	axeCentra3l.position.z=0;

	turbineCentral3e.add(axeCentra3l);

	var p3ale1D = new THREE.Object3D();

	var pale1Droit3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale1D, name: 'pale1Droit3e'});
	pale1Droit3e.position.x=0;
	pale1Droit3e.position.y=2;
	pale1Droit3e.position.z=0;
	axeDroit3e.add(pale1Droit3e);

	var p3ale2D = new THREE.Object3D();

	var pale2Droit3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale2D, name: 'pale2Droit3e'});
	pale2Droit3e.position.x=0;
	pale2Droit3e.position.y=2;
	pale2Droit3e.position.z=0;
	pale2Droit3e.rotation.y=2*(Math.PI/3.0);
	axeDroit3e.add(pale2Droit3e);

	var p3ale3D = new THREE.Object3D();

	var pale3Droit3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale3D, name: 'pale3Droit3e'});
	pale3Droit3e.position.x=0;
	pale3Droit3e.position.y=2;
	pale3Droit3e.position.z=0;
	pale3Droit3e.rotation.y=-2*(Math.PI/3.0);
	axeDroit3e.add(pale3Droit3e);

	var p3ale1C = new THREE.Object3D();

	var pale1Central3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale1C, name: 'pale1Central3e'});
	pale1Central3e.position.x=0;
	pale1Central3e.position.y=2;
	pale1Central3e.position.z=0;
	axeCentra3l.add(pale1Central3e);

	var p3ale2C = new THREE.Object3D();

	var pale2Central3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale2C, name: 'pale2Central3e'});
	pale2Central3e.position.x=0;
	pale2Central3e.position.y=2;
	pale2Central3e.position.z=0;
	pale2Central3e.rotation.y=2*(Math.PI/3.0);
	axeCentra3l.add(pale2Central3e);

	var p3ale3C = new THREE.Object3D();

	var pale3Central3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale3C, name: 'pale3Central3e'});
	pale3Central3e.position.x=0;
	pale3Central3e.position.y=2;
	pale3Central3e.position.z=0;
	pale3Central3e.rotation.y=-2*(Math.PI/3.0);
	axeCentra3l.add(pale3Central3e);

	var p3ale1G = new THREE.Object3D();

	var pale1Gauch3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale1G, name: 'pale1Gauch3e'});
	pale1Gauch3e.position.x=0;
	pale1Gauch3e.position.y=2;
	pale1Gauch3e.position.z=0;
	axeGauch3e.add(pale1Gauch3e);

	var p3ale2G = new THREE.Object3D();

	var pale2Gauch3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale2G, name: 'pale2Gauch3e'});
	pale2Gauch3e.position.x=0;
	pale2Gauch3e.position.y=2;
	pale2Gauch3e.position.z=0;
	pale2Gauch3e.rotation.y=2*(Math.PI/3.0);
	axeGauch3e.add(pale2Gauch3e);

	var p3ale3G = new THREE.Object3D();

	var pale3Gauch3e = Loader.load({filename: 'assets/helico/pale2.obj', node: p3ale3G, name: 'pale3Gauch3e'});
	pale3Gauch3e.position.x=0;
	pale3Gauch3e.position.y=2;
	pale3Gauch3e.position.z=0;
	pale3Gauch3e.rotation.y=-2*(Math.PI/3.0);
	axeGauch3e.add(pale3Gauch3e);



	//Particules
	var config = new THREE.Object3D();
	config.textureFile = 'assets/particles/particle.png' ;
	config.particlesCount = 2000 ;
	config.blendingMode = THREE.AdditiveBlending;

	var partiGauche = new ParticleSystem.Engine_Class(config);

	var particleLifetime = 0.1;
    var particleSize = 1.0;

	var configCone = new THREE.Object3D();
	configCone.cone = {
		center: new THREE.Vector3(0,0,0.2),
				height: new THREE.Vector3(0,-1,0),
				radius: 0.1,
				flow: 	300
	};
	// Description of the particles characteristics
	configCone.particle = {
		 speed:    new MathExt.Interval_Class(5,10),
		 mass: 	   new MathExt.Interval_Class(0.1,0.3),
		 size:	   new MathExt.Interval_Class(1.0,particleSize),
		 lifeTime: new MathExt.Interval_Class(0.1,particleLifetime),
	};

	var cone = new ParticleSystem.ConeEmitter_Class(configCone);
	partiGauche.addEmitter(cone);

	var life = new ParticleSystem.LifeTimeModifier_Class();
	partiGauche.addModifier(life);

	var weight = new ParticleSystem.ForceModifier_Weight_Class();
	partiGauche.addModifier(weight);

	var euler = new ParticleSystem.PositionModifier_EulerItegration_Class();
	partiGauche.addModifier(euler);

	var opa = new ParticleSystem.OpacityModifier_TimeToDeath_Class(new Interpolators.Linear_Class(1, 0));
	partiGauche.addModifier(opa);

	var couleurDepart = new THREE.Color( 0xffe66b);
    var couleurFin = new THREE.Color( 0xa02828);
    var col = new ParticleSystem.ColorModifier_TimeToDeath_Class(couleurDepart, couleurFin);
	partiGauche.addModifier(col);

	var partiDroite = new ParticleSystem.Engine_Class(config);
	partiDroite.addEmitter(cone);
	partiDroite.addModifier(life);
	partiDroite.addModifier(weight);
	partiDroite.addModifier(euler);
	partiDroite.addModifier(opa);
	partiDroite.addModifier(col);

	//Avion controlable
	turbineGauch3e.add(partiGauche.particleSystem);
	turbineDroit3e.add(partiDroite.particleSystem);

	//Avion machine
	var partiGaucheMachine = new ParticleSystem.Engine_Class(config);

	var particleLifetimeMachine = 2.0;
    var particleSizeMachine = 2.0;

	var configConeMachine = new THREE.Object3D();
	configConeMachine.cone = {
		center: new THREE.Vector3(0,0,0.2),
				height: new THREE.Vector3(0,-1,0),
				radius: 0.1,
				flow: 	300
	};
	// Description of the particles characteristics
	configConeMachine.particle = {
		 speed:    new MathExt.Interval_Class(5,10),
		 mass: 	   new MathExt.Interval_Class(0.1,0.3),
		 size:	   new MathExt.Interval_Class(1.0,particleSizeMachine),
		 lifeTime: new MathExt.Interval_Class(0.1,particleLifetimeMachine),
	};


	var coneMachine = new ParticleSystem.ConeEmitter_Class(configConeMachine);
	partiGaucheMachine.addEmitter(coneMachine);

	var lifeMachine = new ParticleSystem.LifeTimeModifier_Class();
	partiGaucheMachine.addModifier(lifeMachine);

	var weightMachine = new ParticleSystem.ForceModifier_Weight_Class();
	partiGaucheMachine.addModifier(weightMachine);

	var eulerMachine = new ParticleSystem.PositionModifier_EulerItegration_Class();
	partiGaucheMachine.addModifier(eulerMachine);

	var opaMachine = new ParticleSystem.OpacityModifier_TimeToDeath_Class(new Interpolators.Linear_Class(1, 0));
	partiGaucheMachine.addModifier(opaMachine);

    var colMachine = new ParticleSystem.ColorModifier_TimeToDeath_Class(couleurDepart, couleurFin);
	partiGaucheMachine.addModifier(colMachine);

	var partiDroiteMachine = new ParticleSystem.Engine_Class(config);
	var coneMachine = new ParticleSystem.ConeEmitter_Class(configConeMachine);
	partiDroiteMachine.addEmitter(coneMachine);

	var lifeMachine = new ParticleSystem.LifeTimeModifier_Class();
	partiDroiteMachine.addModifier(lifeMachine);

	var weightMachine = new ParticleSystem.ForceModifier_Weight_Class();
	partiDroiteMachine.addModifier(weightMachine);

	var eulerMachine = new ParticleSystem.PositionModifier_EulerItegration_Class();
	partiDroiteMachine.addModifier(eulerMachine);

	var opaMachine = new ParticleSystem.OpacityModifier_TimeToDeath_Class(new Interpolators.Linear_Class(1, 0));
	partiDroiteMachine.addModifier(opaMachine);

    var colMachine = new ParticleSystem.ColorModifier_TimeToDeath_Class(couleurDepart, couleurFin);
	partiDroiteMachine.addModifier(colMachine);

	turbineGauche.add(partiGaucheMachine.particleSystem);
	turbineDroite.add(partiDroiteMachine.particleSystem);

	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', RC.scene, 'sky',4000);

	var NAVVoiture = new navPlaneSet(
					new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01	
	NAVVoiture.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02		
	NAVVoiture.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03		
	NAVVoiture.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04		
	NAVVoiture.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05		
	NAVVoiture.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06		
	NAVVoiture.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07		
	NAVVoiture.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08		
	NAVVoiture.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09		
	NAVVoiture.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10		
	NAVVoiture.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11		
	NAVVoiture.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12		
	NAVVoiture.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13 		
	NAVVoiture.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14		
	NAVVoiture.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15		
	NAVVoiture.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16	
	NAVVoiture.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17	
	NAVVoiture.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18	
	NAVVoiture.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19	
	NAVVoiture.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20	
	NAVVoiture.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21		
	NAVVoiture.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22		
	NAVVoiture.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23		
	NAVVoiture.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24		
	NAVVoiture.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25		
	NAVVoiture.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26		
	NAVVoiture.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27	
	NAVVoiture.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28	
	NAVVoiture.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29	
	NAVVoiture.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30*/			
	NAVVoiture.setPos(CAR2x,CAR2y,CAR2z); 
	NAVVoiture.initActive();


	var NAVAvion = new navPlaneSet(
					new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01	
	NAVAvion.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02		
	NAVAvion.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03		
	NAVAvion.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04		
	NAVAvion.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05		
	NAVAvion.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06		
	NAVAvion.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07		
	NAVAvion.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08		
	NAVAvion.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09		
	NAVAvion.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10		
	NAVAvion.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11		
	NAVAvion.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12		
	NAVAvion.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13 		
	NAVAvion.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14		
	NAVAvion.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15		
	NAVAvion.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16	
	NAVAvion.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17	
	NAVAvion.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18	
	NAVAvion.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19	
	NAVAvion.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20	
	NAVAvion.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21		
	NAVAvion.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22		
	NAVAvion.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23		
	NAVAvion.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24		
	NAVAvion.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25		
	NAVAvion.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26		
	NAVAvion.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27	
	NAVAvion.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28	
	NAVAvion.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29	
	NAVAvion.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30*/			
	NAVAvion.setPos(CAR3x,CAR3y,CAR3z); 
	NAVAvion.initActive();

	// DEBUG
	//NAVVoiture.debug();
	//var navMesh = NAVVoiture.toMesh();
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

	function lookAte (camera, targetPosition) {
	    var targetPos = camera.worldToLocal(targetPosition.clone());
	    var rotationAxis = new THREE.Vector3().crossVectors(new THREE.Vector3(0, -1, 0),targetPos).normalize();
	    var angle = new THREE.Vector3(0, -1, 0).angleTo(targetPos.normalize().clone());
	    camera.rotateOnAxis(rotationAxis, angle);
	}

	function interpolatorBezier() {
		if (pas < 0){
				pas = 1;
				zone++;
				if (zone ==7){
					zone =0;
					lapAvionAuto++;
				}
 		}

		var endroit = tabCurves[zone].getPoint(pas);

		if(endroit.y> 119.5 &&  endroit.y<120.5){
			if(lapAvionAuto>0){
				tempsTourAvionAuto = clockAvionAuto.getDelta ().toPrecision(4);
				document.getElementById('tempsTourAvionAuto').textContent =tempsTourAvionAuto;
			}
			clockAvionAuto.start();
			nbToursAvionAuto = lapAvionAuto;
			document.getElementById('nbToursAvionAuto').textContent =nbToursAvionAuto;

	
		}
		endroit.x = endroit.x +220;
		lookAte(corpsHelico, tabCurves[zone].getPoint(pas+0.1));//,lerpo);
		corpsHelico.position.x = endroit.x;
		corpsHelico.position.y= endroit.y;
		corpsHelico.position.z = endroit.z;
		pas-=0.008;
	}

	function animationParticules() {
		partiGaucheMachine.animate(0.05);
		partiDroiteMachine.animate(0.05);
		partiGauche.animate(0.05);
		partiDroite.animate(0.05);
	}

	function rotatoPales() {
		var rotationIncrement = 0.005 ;
		
		var speedPale = Math.sqrt(Math.pow(avion.speed.x,2)+Math.pow(avion.speed.y,2)+Math.pow(avion.speed.y,2));

		var tourne = Math.min(rotationIncrement*speedPale, Math.PI/6);

		axeGauch3e.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), tourne) ;
		axeDroit3e.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), tourne) ;
		axeCentra3l.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), tourne) ;
	}

	function rotatoPalesAuto() {
		var rotationIncrement = 0.05 ;
		
		var speedPale = 10;

		var tourne = Math.min(rotationIncrement*speedPale, Math.PI/6);

		axeGauche.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), tourne) ;
		axeDroite.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), tourne) ;
		axeCentral.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), tourne) ;
	}

	function finDeCourse(){

	}

	function handleKeys() {

		//emotiv
		let socketUrl = 'wss://localhost:6868'
		let user = {
			"license":"", //can be empty
			"clientId":"wCw3FvcO0JGR1a3KxY0PM2Z5lMHfnFePsaN0raoZ",  //add your clientId for your cortex App
			"clientSecret":"IyuUHMKWfguSpIUBpzsD8Np6whsWK7BQZTVLgORe53acrBn61Zfmj5K7UOx0TuQULAaZsIYTRCiY9mGUADpLc1RwtSMnZid9aJpnhrMFx9xd9QYmMB0yhWAl5G8qDgRV",  //add the client secret
			"debit":0
		}
		let c = new Cortex(user, socketUrl)
		c.live('lift', 0.35) //change to a different command you've trained and change sensitivity level that trigger the command
	  
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			RC.scene.traverse(function(o){
			});
		}	
		  // Chart
		  var command1 = new TimeSeries();
		  var command2 = new TimeSeries();
		  setInterval(function() {
			if (c.currentAction[0]=='lift') {command2.append(new Date(c.currentAction[2] * 1000), c.currentAction[1])} else {command2.append(new Date(c.currentAction[2] * 1000), 0)};
			if (c.currentAction[0]=='pull') {command1.append(new Date(c.currentAction[2] * 1000), c.currentAction[1])} else {command1.append(new Date(c.currentAction[2] * 1000), 0)};
			console.log(c.currentAction);
			// after making threejs game, we have to control it like this. Refer mouse triggers in threejs
			if(c.currentAction[0] == "drop")
			{
				avion.brake(100);
			particleLifetime = Math.max(particleLifetime - 0.1, 0);
            cone.lifeTimeInterval = new MathExt.Interval_Class(0.1, particleLifetime);
            particleSize = Math.max(particleSize - 0.1, 0);
            cone.sizeInterval = new MathExt.Interval_Class(1.0, particleSize);
			}
			if(c.currentAction[0] == "push")
			{

			avion.goFront(200,200);
		 	particleLifetime = Math.min(particleLifetime + 0.1, 2.0);
		 	particleSize = Math.min(particleSize + 0.1, 2.0);
		 	cone.lifeTimeInterval = new MathExt.Interval_Class(0.1, particleLifetime);
            cone.sizeInterval = new MathExt.Interval_Class(1.0, particleSize);
			}
			if(c.currentAction[0] == "left")
			{

			avion.turnLeft(200) ;
			}
			if(c.currentAction[0] == "right")
			{
		
			avion.turnRight(200) ;	
			}
		  }, 500);

		  //keyboard
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			RC.scene.traverse(function(o){
			});
		}		
		if (currentlyPressedKeys[68]) // (D) Right	
			avion3.add(RC.camera) ;
		if (currentlyPressedKeys[76]) // (L) Right
			voitureAuto3.add(RC.camera) ;
		if (currentlyPressedKeys[77]) // (M) Right
			corpsHelico.add(RC.camera) ;	
		if (currentlyPressedKeys[68]) // (D) Right
		{
			avion.turnRight(1000) ;	s
		}
		if (currentlyPressedKeys[65]) // (A) Left 
		{		
			avion.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[87]) // (W) Up
		{
		 	avion.goFront(1200,1200);
		 	particleLifetime = Math.min(particleLifetime + 0.1, 2.0);
		 	particleSize = Math.min(particleSize + 0.1, 2.0);
		 	cone.lifeTimeInterval = new MathExt.Interval_Class(0.1, particleLifetime);
            cone.sizeInterval = new MathExt.Interval_Class(1.0, particleSize);
	
		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			avion.brake(100);
			particleLifetime = Math.max(particleLifetime - 0.1, 0);
            cone.lifeTimeInterval = new MathExt.Interval_Class(0.1, particleLifetime);
            particleSize = Math.max(particleSize - 0.1, 0);
            cone.sizeInterval = new MathExt.Interval_Class(1.0, particleSize);
		}
	}

	//	window resize
	function  onWindowResize() {RC.onWindowResize(window.innerWidth,window.innerHeight);}
	function  goVoitureAuto(){
		var voitureAutomatique = RC.scene.getObjectByName( "voitureAuto0" );
		var posVoitureAuto = NAVVoiture.findActive(voitureAutomatique.position.x,voitureAutomatique.position.y);
		var vitmax = 1200;
		if (posVoitureAuto == 0  || posVoitureAuto == 4 ||  posVoitureAuto == 6 
			|| posVoitureAuto == 7 || posVoitureAuto == 9
			|| posVoitureAuto == 13	|| posVoitureAuto == 17
			|| posVoitureAuto == 23 || posVoitureAuto == 27){
			voitureAuto.goFront(vitmax, vitmax);
		}
		if (posVoitureAuto == 21){
			voitureAuto.goFront(100, 100) ;
		}
		if (posVoitureAuto == 15){
			if(lapVoitureAuto >=1){
				voitureAuto.goFront(1050, 1050) ;
			}
			else{
				voitureAuto.goFront(vitmax, vitmax) ;
			}
		}
		if (posVoitureAuto == 22 ){
			if(lapVoitureAuto >=1){
				voitureAuto.brake(70) ;
				voitureAuto.turnLeft(600) ;
				voitureAuto.goFront(100, 100) ;
			}
			else{
				voitureAuto.brake(20) ;
				voitureAuto.turnLeft(150) ;
				voitureAuto.goFront(100, 100) ;
			}	

		}
		if (posVoitureAuto == 19 ||posVoitureAuto == 18){
			voitureAuto.brake(24) ;
			voitureAuto.turnLeft(100) ;
		}
		if (posVoitureAuto == 28 ){
			if(lapVoitureAuto >=1){
				voitureAuto.goFront(vitmax, vitmax);
			}
			else{
				voitureAuto.goFront(vitmax, vitmax);
				voitureAuto.turnLeft(220) ;
			}
		}
		if (posVoitureAuto == 29){
			if(lapVoitureAuto >=1){
				if(lapVoitureAuto ==1){
					voitureAuto.goFront(vitmax, vitmax);
					voitureAuto.turnLeft(20);
				}
				if(lapVoitureAuto >1){
					voitureAuto.goFront(vitmax, vitmax);
					voitureAuto.turnRight(80);
				}
			}
			else{
				voitureAuto.goFront(vitmax, vitmax);
			}
		}
		if (posVoitureAuto == 1){
			if(lapVoitureAuto >=1){
				voitureAuto.brake(45) ;
				voitureAuto.turnRight(100) ;
			}
			else{
				voitureAuto.brake(20) ;
				voitureAuto.turnRight(100) ;
			}
		}
		if (posVoitureAuto == 5|| posVoitureAuto == 10 || posVoitureAuto == 11 
			|| posVoitureAuto == 14 || posVoitureAuto == 24	|| posVoitureAuto == 25){
			voitureAuto.brake(20) ;
			voitureAuto.turnRight(100) ;

		}
		if (posVoitureAuto == 12){
			if(lapVoitureAuto >=1){
				if (lapVoitureAuto ==1){
					voitureAuto.brake(20) ;
					voitureAuto.turnRight(145) ;
				}
				if(lapVoitureAuto >1){
					voitureAuto.brake(20) ;
					voitureAuto.turnRight(165) ;
				}
			}
			else{
				voitureAuto.brake(20) ;
				voitureAuto.turnRight(100) ;
			}
		}
		if (posVoitureAuto == 2 || posVoitureAuto == 8){
			voitureAuto.goFront(vitmax, vitmax) ;
			voitureAuto.turnLeft(200) ;
		}
		if (posVoitureAuto == 20){
			voitureAuto.goFront(vitmax, vitmax) ;
			voitureAuto.turnLeft(210) ;
		}
		if (posVoitureAuto == 26){
			if(lapVoitureAuto >=1){
				voitureAuto.goFront(vitmax, vitmax) ;
				voitureAuto.turnRight(95) ;
			}
			else{
				voitureAuto.goFront(vitmax, vitmax) ;
				voitureAuto.turnRight(170) ;
			}
		}
		if (posVoitureAuto == 3 || posVoitureAuto == 16){
			voitureAuto.goFront(vitmax, vitmax) ;
			voitureAuto.turnRight(200) ;
		}
		if(posVoitureAuto != currentAreaVoitureAuto){
			prevAreaVoitureAuto = currentAreaVoitureAuto;
			currentAreaVoitureAuto = posVoitureAuto;
			if(prevAreaVoitureAuto == 0 && currentAreaVoitureAuto == 1){
				if(lapAvionAuto>0){
					tempsTourVoitureAuto = clockVoitureAuto.getDelta ().toPrecision(4);
					document.getElementById('tempsTourVoitureAuto').textContent =tempsTourVoitureAuto;
				}
				clockVoitureAuto.start();
				lapVoitureAuto++;
				nbToursVoitureAuto= lapVoitureAuto;
				document.getElementById('nbToursVoitureAuto').textContent =nbToursVoitureAuto;
			}
		}
	}

	function render() { 
		id = requestAnimationFrame( render );
		handleKeys();
		interpolatorBezier();
		goVoitureAuto();
		animationParticules();
		rotatoPales();
		rotatoPalesAuto();

		//Voiture auto

		// Vehicle stabilization 
		voitureAuto.stabilizeSkid(50) ; 
		voitureAuto.stabilizeTurn(1000) ;
		var oldPositionVoitureAuto = voitureAuto.position.clone() ;
		voitureAuto.update(1.0/60) ;
		var newPositionVoitureAuto = voitureAuto.position.clone() ;
		newPositionVoitureAuto.sub(oldPositionVoitureAuto) ;

		// NAVVoiture
		NAVVoiture.move(newPositionVoitureAuto.x, newPositionVoitureAuto.y, 150,10) ;

		// VoitureAuto
		voitureAuto0.position.set(NAVVoiture.x, NAVVoiture.y, NAVVoiture.z) ;
		// Updates the VoitureAuto
		voitureAuto.position.x = NAVVoiture.x ;
		voitureAuto.position.y = NAVVoiture.y ;
		// Updates VoitureAuto1
		voitureAuto1.matrixAutoUpdate = false;		
		voitureAuto1.matrix.copy(NAVVoiture.localMatrix(CAR2x,CAR2y));
		// Updates VoitureAuto2
		voitureAuto2.rotation.z = voitureAuto.angles.z-Math.PI/2.0 ;


		//Avion

		// Vehicle stabilization 
		avion.stabilizeSkid(50) ; 
		avion.stabilizeTurn(1000) ;
		var oldPositionAvion = avion.position.clone() ;
		avion.update(1.0/60) ;
		var newPositionAvion = avion.position.clone() ;
		newPositionAvion.sub(oldPositionAvion) ;

		// NAVVoiture
		NAVAvion.move(newPositionAvion.x, newPositionAvion.y, 150,10) ;

		// VoitureAuto
		avion0.position.set(NAVAvion.x, NAVAvion.y, NAVAvion.z) ;
		// Updates the VoitureAuto
		avion.position.x = NAVAvion.x ;
		avion.position.y = NAVAvion.y ;
		// Updates VoitureAuto1
		avion1.matrixAutoUpdate = false;		
		avion1.matrix.copy(NAVAvion.localMatrix(CAR3x,CAR3y));
		// Updates VoitureAuto2
		avion2.rotation.z = avion.angles.z-Math.PI/2.0 ;

		var Avion = RC.scene.getObjectByName( "avion0" );
		var posAvion = NAVAvion.findActive(Avion.position.x,Avion.position.y);
		var meshMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );

		if(posAvion != currentAreaAvion){
			prevAreaAvion = currentAreaAvion;
			currentAreaAvion = posAvion;

			if(prevAreaAvion == 0 && currentAreaAvion == 1){
				if(lapAvion >-1){
					avion3.remove(RC.scene.getObjectByName( 'vide'+lapAvion ));
					avion3.remove(RC.scene.getObjectByName( 'temps'+lapAvion ));
				}
				lapAvion++;
				var vide = new THREE.Object3D();
				vide.name = 'vide'+lapAvion;
				avion3.add(vide) ;
				vide.position.x = -20.0 ;
				vide.position.z = 23.0 ;
				vide.position.y = 0.0 ;
				vide.rotation.x = 100.0*3.14159/180.0 ;
				if(lapAvion==3){
					var text = new THREE.TextGeometry( "Finished",{size:2,height:1,curveSegments: 2});			
					var textMesh = new THREE.Mesh(text,meshMaterial);
					vide.add(textMesh);
					cancelAnimationFrame( id );
				}
				else{
				var text = new THREE.TextGeometry( "Laps : " +lapAvion,{size:2,height:1,curveSegments: 2});			
				var textMesh = new THREE.Mesh(text,meshMaterial);
				vide.add(textMesh);
				}
				var temps = new THREE.Object3D();
				temps.name = 'time'+lapAvion;
				avion3.add(temps) ;
				temps.position.x = 7.0 ;
				temps.position.z = 23.0 ;
				temps.position.y = 0.0 ;
				temps.rotation.x = 100.0*3.14159/180.0 ;
				var nb = clockAvion.getDelta ();
				var n = nb.toPrecision(4); 
				var text = new THREE.TextGeometry( "Temps : " + n,{size:2,height:1,curveSegments: 2});			
				var textMesh = new THREE.Mesh(text,meshMaterial);
				if(lapAvion!=0){
					temps.add(textMesh);
				}
				clockAvion.start();
			}
		}
		// Rendering
		RC.renderer.render(RC.scene, RC.camera); 
	};
	render();
}