var canvas;
var audioNodes;

function preload(){
  
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);//600, 400, WEBGL);
  
  canvas.position(0, 0);
  canvas.class("buffer");

  colorMode(HSB, 256);
	
  audioNodes = new Array(
  new AudioNode(  0,
                  "Tropical Massiel",
                  "media/audio/master/MASTER TROPICAL (MASSIEL).mp3",
                  "media/audio/warp2/WARP 2 TROPICAL.mp3"),
  new AudioNode(  1,
                  "Piano Medieval",
                  "media/audio/master/MASTER PIANO MEDIEVAL (ASTROFOX).mp3",
                  "media/audio/warp2/WARP 2 PIANO MEDIEVAL.mp3"),
  new AudioNode(  2,
                  "Piano Campanas",
                  "media/audio/master/MASTER PIANO _ CAMPANAS (JUAN).mp3",
                  "media/audio/warp2/WARP 2 PIANO _ CAMPANAS.mp3"),
  new AudioNode(  3,
                  "Melodía en Piano",
                  "media/audio/master/MASTER MELODÍA EN PIANO.mp3",
                  "media/audio/warp2/WARP 2 MELODÍA EN PIANO.mp3"),
  new AudioNode(  4,
                  "Melodía Atardecer",
                  "media/audio/master/MASTER MELODÍA ATARDECER (MARÍA JOSÉ VILLEGAS).mp3",
                  "media/audio/warp2/WARP 2 MELODÍA ATARDECER.mp3"),
  new AudioNode(  5,
                  "Melodía Aninal",
                  "media/audio/master/MASTER MELODÍA ANIMAL.mp3",
                  "media/audio/warp2/WARP 2 MELODÍA ANIMAL.mp3"),
  new AudioNode(  6,
                  "Improvisación",
                  "media/audio/master/MASTER IMPROVISACIÓN.mp3",
                  "media/audio/warp2/WARP 2 IMPROVISACIÓN.mp3"),
  new AudioNode(  7,
                  "Futuro",
                  "media/audio/master/MASTER FUTURO.mp3",
                  "media/audio/warp2/WARP 2 FUTURO.mp3"),
  new AudioNode(  8,
                  "Dubstep",
                  "media/audio/master/MASTER DUBSTEP.mp3",
                  "media/audio/warp2/WARP 2 DUBSTEP.mp3"),
  new AudioNode(  9,
                  "Batería y Piano",
                  "media/audio/master/MASTER BATERÍA _ PIANO.mp3",
                  "media/audio/warp2/WARP 2 BATERÍA Y PIANO.mp3"),
  new AudioNode(  10,
                  "Bajo Sonidos",
                  "media/audio/master/MASTER BAJO _ SONIDOS.mp3",
                  "media/audio/warp2/WARP 2 BAJOS _ SONIDOS.mp3")
  );
}

function hideShowGUI(){
  showGUI = !showGUI;
  var guis = selectAll('.GUI');
  
  for (var i = 0; i < guis.length; i++) {
    if(!showGUI)
    guis[i].hide();
    else
    guis[i].show();
  }
}
//////////////////////////////////////////////////7
function draw(){
  //updateMeters();
	doDraw();
}
function doDraw(){
  background(0);//240, 255, 255*16*audioLayer[5].amplitude.getLevel());
	push();
//
	rotateY(PI/2);//radians(frameCount));
	rotateZ(PI/2);//radians(frameCount));
	rotateX(radians(frameCount));
  box(200);
	pop();
}
function keyPressed() {
  //if (key=='1') audioLayer[0].trigger();
}
//////////////////////////////
function AudioNode(i, n, f1, f2){
  
  var index     = i;
  var name      = n;
  var filename1 = f1;
  var filename2 = f2;

  this.master = new AudioLayer(f1, 2*i,   this);
  this.warp2  = new AudioLayer(f2, 2*i+1, this);
  var areLoaded = false; var countLoaded = 0;

  this.update = function(){

  }
  this.draw = function(){

  }
  this.audioLoaded = function(){
    countLoaded++;
    console.log("loaded "+ countLoaded+" at audionode "+index);
    areLoaded = (countLoaded==2);
  }
}
//////////////////////////////
function AudioLayer(f, i, p){
  var filename = f;
  var index    = i;
  var parent   = p;

  var loadingbar = createP('');
  loadingbar.position(4, 54+index*18);
  loadingbar.class("GUI");
  
  var buttonbar = createP('');
  buttonbar.position(4, 54+index*18);
  buttonbar.class("GUI");
  
  this.amplitude = new p5.Amplitude();
  this.filter    = new p5.BandPass();
  
  this.doFilter  = false;
  
  this.updateMeter = function(){
    this.vuMeter.remove();
    if(showGUI)this.doMeter();
    //this.vuMeter.class("GUI");
  }
  this.doMeter = function(){
    var w = 200*this.amplitude.getLevel();
    this.vuMeter    = createP('');
    this.vuMeter.style("width", w+"px");
	  this.vuMeter.style("height","8");
	  this.vuMeter.style("background","white");
    this.vuMeter.position(136+16*2, -4+72+index*18);
    this.vuMeter.class("GUI");
  }
  this.soundLoaded = function(s){
    buttonbar.remove();
    buttonbar = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">['+(index+1)+'] '+filename+'</p>');
    buttonbar.position(8, 72+index*18);
    buttonbar.class("GUI");
    buttonbar.mousePressed(function(){
      console.log("mousePressed!");
      if(s.isPlaying())s.pause();
      else s.loop();
    });
    //console.log("yeah!");
    //makeFilterButton(index);
    s.loop();
    parent.audioLoaded();
  }
  this.soundError = function(err){
    console.log(err);
  }
  this.soundLoading = function(status){
    console.log(status);
    buttonbar.remove();
    buttonbar = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:wait">['+nf(status*100,2,0)+'%] '+filename+'</p>');
    buttonbar.position(8, 72+index*18);
  }
  this.trigger = function(){
    if(this.sound.isPlaying())this.sound.pause();
    else 
    this.sound.loop();
  }
  this.toggleFilter = function(){
    this.doFilter = !this.doFilter;
    if(!this.doFilter){
      this.sound.disconnect();
      this.sound.connect();
      this.amplitude.setInput(this.sound);
    }else{
      this.sound.disconnect();
      this.sound.connect(this.filter);
      this.amplitude.setInput(this.filter);
    }

	  if(this.doFilter) toggleBPFbox[index].style("background","white");
	  else   toggleBPFbox[index].style("background","rgba(255,0,0,  0)");

  }
  this.randomFilterValues = function(){
    if(this.doFilter)
      this.filter.freq(random(40,1000));
  }
  
  this.doMeter();
  this.sound = loadSound(f, this.soundLoaded, this.soundError, this.soundLoading);
  this.amplitude.setInput(this.sound);
  this.doFilter = false;
}





