//////////////////////////////////////////////////
// makers musicales mustakis
// 2021/02
// @coyarzunroa
//
//////////////////////////////////////////////////
//this version: add csv
//to do: organice, define objects
//replace filenames
//aad vumetters
//////////////////////////////////////////////////
var canvas;
var table;
var audioNodes;
var allLoaded = true, countAudioNodesLoaded = 0;
////////////////////
var showGUI = true, isFS = false;
var gText;
////////////////////
function preload(){
  table = loadTable('data/20210216_mmm_data - Hoja 1.csv', 'csv');//, 'header');
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);//600, 400, WEBGL);
  
  canvas.position(0, 0);
  canvas.class("buffer");

  colorMode(HSB, 256);

  gText = createDiv('<p style="color:white;font-family:Monospace;font-size:12px;"><strong>Makers Musicales</strong><br>Protoype 000<br>202102</p>')
  gText.position(8, -6);

  parseCSV();
}
function parseCSV(){
  audioNodes = [];

  for (let r = 0; r < table.getRowCount(); r++){
    audioNodes[r] = new AudioNode(r); 
    //particles.push(new Particle(r));
  }
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
function doFS(){
  var fs = fullscreen();fullscreen(!fs); 
}



//////////////////////////////////////////////////7
function draw(){
  //updateMeters();
	doDraw();
  //updatePans();
  updateMeters();
  //updateFilters();
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
function updatePans(){
  /*
  if(isStereo){
    audioLayer[0].sound.pan(sin(radians(frameCount)));
    audioLayer[1].sound.pan(sin(PI+radians(2*frameCount)));
    //audioLayer[2].sound.pan(0.0);
    audioLayer[3].sound.pan(sin(PI/2+radians(3*frameCount)));
    //audioLayer[4].sound.pan(0.0);
    audioLayer[5].sound.pan(sin(2*PI/2+radians(4*frameCount)));
  }else{
    audioLayer[0].sound.pan(0.0);
    audioLayer[1].sound.pan(0.0);
    audioLayer[2].sound.pan(0.0);
    audioLayer[3].sound.pan(0.0);
    audioLayer[4].sound.pan(0.0);
    audioLayer[5].sound.pan(0.0);
  }*/
}
function updateFilters(){
  /*audioLayer[0].randomFilterValues();
  audioLayer[1].randomFilterValues();
  audioLayer[2].randomFilterValues();
  audioLayer[3].randomFilterValues();
  audioLayer[4].randomFilterValues();
  audioLayer[5].randomFilterValues();*/
}
function updateMeters(){
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].updateMeter();
  }
  
}
//////////////////////////////
function AudioNode(i){
  //, n, f1, f2

  this.index           = i;
  this.name            = table.getString(this.index, 0);
  this.author          = table.getString(this.index, 1);
  this.filename1       = table.getString(this.index, 2);
  this.filename2       = table.getString(this.index, 3);

  this.master = new AudioLayer(this.filename1, 2*i,   this, this.name+"_master", false);
  this.warp2  = new AudioLayer(this.filename2, 2*i+1, this, this.name+"_warp2",  true);

  var areLoaded = false; var countLoaded = 0;

  this.update = function(){

  }
  this.draw = function(){

  }
  this.audioLoaded = function(){
    countLoaded++;
    console.log("loaded "+ countLoaded+" at audionode "+this.index);
    areLoaded = (countLoaded==2);
    if(areLoaded)countAudioNodesLoaded++;
    if(countAudioNodesLoaded==audioNodes.length){
      areLoaded=true;
      console.log("all audios loaded!!!");
    }
  }
  this.updateMeter = function(){
    this.master.updateMeter();
    this.warp2.updateMeter();
  }
}
//////////////////////////////
function AudioLayer(f, i, p, n, w){
  var filename = f;
  var index    = i;
  var parent   = p;
  var label    = n;
  var me = this;
  var isWarpped = w;

  var loadingbar = createP('');
  loadingbar.position(4, 54+index*18);
  loadingbar.class("GUI");
  
  var buttonbar = createP('');
  buttonbar.position(4, 54+index*18);
  buttonbar.class("GUI");

  var toggleBPF, toggleBPFbox;
  
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
    this.vuMeter.position(136+16*2+20, -4+72+index*18);
    this.vuMeter.class("GUI");
  }

  this.soundLoaded = function(s){
    buttonbar.remove();
    buttonbar = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">['+(index+1)+'] '+label+'</p>');
    buttonbar.position(8, 72+index*18);
    buttonbar.class("GUI");
    
    buttonbar.mousePressed(function(){//por mientras
      console.log("mousePressed!");
      if(s.isPlaying())s.pause();
      else s.loop();
    });
    //console.log("yeah!");
    toggleBPF = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer"> Band Pass Filter '+(i+1)+'</p>');
    toggleBPF.position(200+100, 72+index*18);
    toggleBPF.class("GUI");
    toggleBPFbox = createP('');
    toggleBPFbox.style("cursor", "pointer");
    toggleBPFbox.style("width", "8px");
    toggleBPFbox.style("height","8px");
    toggleBPFbox.style("outline","white solid thin");
    toggleBPFbox.class("GUI");
    toggleBPFbox.position(320+100+8, 72+index*18-4);//-4+72+index*18);
  
    toggleBPF.mousePressed(function(){      me.toggleFilter();    });
    toggleBPFbox.mousePressed(function(){   me.toggleFilter();    });
    //s.loop();
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
    console.log("toggle filter?");
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

	  if(this.doFilter) toggleBPFbox.style("background","white");
	  else   toggleBPFbox.style("background","rgba(255,0,0,  0)");

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





