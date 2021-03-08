//////////////////////////////////////////////////
// makers musicales mustakis
// 2021/02
// @coyarzunroa
//
//////////////////////////////////////////////////
//this version: add csv
//to do: organice, define objects
//
//////////////////////////////////////////////////
var canvas;
var table;
var audioNodes;
////////////////////
var showGUI = true;
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
function makeFilterButton(i){
  var k = i==0? 'Q' : i==1? 'W': i==2? 'E': i==3? 'R': i==4? 'T' : 'Y';
  toggleBPF[i] = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">['+k+'] Band Pass Filter '+(i+1)+'</p>');
  toggleBPF[i].position(8, 72+6*18+i*18);
  toggleBPF[i].class("GUI");
  toggleBPFbox[i] = createP('');
  toggleBPFbox[i].style("cursor", "pointer");
  toggleBPFbox[i].style("width", "8px");
  toggleBPFbox[i].style("height","8px");
  toggleBPFbox[i].style("outline","white solid thin");
  toggleBPFbox[i].class("GUI");
  toggleBPFbox[i] .position(104+16*3+4, 72+6*18+i*18-4);//-4+72+index*18);
  
  toggleBPF[i].mousePressed(function(){      audioLayer[i].toggleFilter();    });
  toggleBPFbox[i].mousePressed(function(){      audioLayer[i].toggleFilter();    });
  kcounter++;
  if(kcounter==6)doRestOfGUI();
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
function AudioNode(i){
  //, n, f1, f2

  this.index           = i;
  this.name            = table.getString(this.index, 0);
  this.author          = table.getString(this.index, 1);
  this.filename1       = table.getString(this.index, 2);
  this.filename2       = table.getString(this.index, 3);

  this.master = new AudioLayer(this.filename1, 2*i,   this);
  this.warp2  = new AudioLayer(this.filename2, 2*i+1, this);

  var areLoaded = false; var countLoaded = 0;

  this.update = function(){

  }
  this.draw = function(){

  }
  this.audioLoaded = function(){
    countLoaded++;
    console.log("loaded "+ countLoaded+" at audionode "+this.index);
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





