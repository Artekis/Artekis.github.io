//////////////////////////////////////////////////
// makers musicales mustakis
// 2021/02
// @coyarzunroa
//
//////////////////////////////////////////////////
//this version: 
// do all from almost zero
//
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
  canvas = createCanvas(windowWidth, windowHeight);//, WEBGL);//600, 400, WEBGL);
  
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
//////////////////////////////////////////////////7
function draw(){
  background(0);//240, 255, 255*16*audioLayer[5].amplitude.getLevel());
	doDraw();
}
function doDraw(){
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].update();
    audioNodes[i].draw();
  }
}
function mousePressed(){
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].mousePressed();
  }
}
function mouseReleased(){
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].mouseReleased();
  }
}
function keyPressed() {
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].keyPressed();
  }
}
//////////////////////////////
var padW = 128, padH = 64;
/////////////////////////////////////////////////////////////////////////////////
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

  this.particle = new Particle(i);


  this.draw = function(){
    //this,particle.draw();
    push();
    translate(this.particle.x, this.particle.y);
    rectMode(CENTER);
    rect(0,0,padW,padH,4);
    //rectMode(CORNER);
    push();
    translate(-padW/4,-padH/4+2);
    rect(-(padW-6)/6,0,(padW-6)/8,(padH-6)/2.4);
    rect(          0,0,(padW-6)/8,(padH-6)/2.4);
    rect(+(padW-6)/6,0,(padW-6)/8,(padH-6)/2.4);
    pop();
    push();
    translate(-padW/4, padH/4);
    rect(0,0,(padW-6)/2.2,(padH-6)/2.4);
    pop();

    translate(padW/4,0);
    rect(0,0,(padW-6)/2.2,(padW-6)/2.2);

    pop();
  }
  this.update = function(){
    this.particle.update();
  }
  this.mousePressed = function(){
    this.particle.mousePressed();
  }
  this.mouseReleased = function(){
    this.particle.mouseReleased();
  }
  this.keyPressed = function(){

  }
  /////////////////////////////////////////////////////////////////////
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

/////////////////////////////
function AudioLayer(f, i, p, n, w){
  var filename = f;
  var index    = i;
  var parent   = p;
  var label    = n;
  var me = this;
  var isWarpped = w;


  this.amplitude = new p5.Amplitude();
  this.filter    = new p5.BandPass();
  
  this.doFilter  = false;
  
  this.updateMeter = function(){
    
  }
  this.doMeter = function(){
    var w = 200*this.amplitude.getLevel();
   
  }

  this.soundLoaded = function(s){
    
    parent.audioLoaded();
  }

  this.soundError = function(err){
    console.log(err);
  }
  this.soundLoading = function(status){
    console.log(status);

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
///////////////////////////////////////////////////////
class Particle {
////https://p5js.org/examples/simulate-particles.html
// this class describes the properties of a single particle.
  constructor(i){
    this.index = i;
    this.x = random(0,width);
    this.y = random(28,height-38);
    this.w = padW/2;
    this.h = padH/2;//random(10,80);
    this.xSpeed = 0;//random(-2,2);
    this.ySpeed = 0;//random(-1,1);

    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?

    this.offsetX = 0;
    this.offsetY = 0;    // Mouseclick offset
  }

  update() {
    if (mouseX>this.x-this.w && 
        mouseX<this.x+this.w && 
        mouseY>this.y-this.h && 
        mouseY<this.y+this.h) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
      this.xSpeed = this.x - this.px;
      this.ySpeed = this.y - this.py;
    }else{
      if(this.x < this.w || this.x > width-this.w){
        this.xSpeed*=-1;
      }
      if(this.y < this.h || this.y > height-this.h){
        this.ySpeed*=-1;
      }
      this.x+=this.xSpeed; 
      this.y+=this.ySpeed;
      this.xSpeed *= 0.98;
      this.ySpeed *= 0.98;
    }

    this.px = this.x;
    this.py = this.y;

    this.x      = constrain(this.x, this.w, width-this.w);
    this.y      = constrain(this.y, this.h, height-this.h);

    this.xSpeed = constrain(this.xSpeed,-2, 2);
    this.ySpeed = constrain(this.ySpeed,-1, 1);
  }
  mousePressed(){
      // Did I click on ?
    if (mouseX>this.x-this.w && 
        mouseX<this.x+this.w && 
        mouseY>this.y-this.h && 
        mouseY<this.y+this.h) {
      this.dragging = true;
    // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x-mouseX;
      this.offsetY = this.y-mouseY;
      for(var i=0; i<audioNodes.length; i++){
        if(i!=this.index)audioNodes[i].particle.mouseReleased();
      }
    }
  }
  mouseReleased() {
    // Quit dragging
    this.dragging = false;
  }
}




