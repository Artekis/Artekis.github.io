//////////////////////////////////////////////////
// makers musicales mustakis
// 2021/03
// @coyarzunroa
//
//////////////////////////////////////////////////
//this version: 
// to do: 
// do sound some again
// update css mood
// z-sort
//////////////////////////////////////////////////
var canvas;
var table;
var audioNodes;
var allLoaded = true, countAudioNodesLoaded = 0;
////////////////////
var showGUI = true, isFS = false;
var gText;
var xgui;
var bottomText = "";
var icon;
var flatEric = "media/img/Flat_Eric_pose_2.jpg";
////////////////////
function preload(){
  //table = loadTable('data/20210216_mmm_data - Hoja 1.csv', 'csv');//, 'header');
  table = loadTable('data/20210301_mmm_data - Hoja 1.csv', 'csv');
  icon = loadImage(flatEric);//media/img/thumbnail/sample.gif");
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);//, WEBGL);//600, 400, WEBGL);
  
  canvas.position(0, 0);
  canvas.class("buffer");

  colorMode(HSB, 256);

  //gText = createDiv('<p style="color:white;font-family:Monospace;font-size:12px;"><strong>Makers Musicales</strong><br>Protoype 002<br>202102</p>')
  //gText.position(8, -6);
  xgui = new TopGUI();
  parseCSV();
  //console.log(icon);
}
function parseCSV(){
  audioNodes = [];
  for (let r = 0; r < table.getRowCount(); r++){
    audioNodes[r] = new AudioNode(r); 
  }
}
//////////////////////////////////////////////////7
function draw(){
  background(255,0);//240, 255, 255*16*audioLayer[5].amplitude.getLevel());
	doDraw();
  doTopGUI();
  //image(icon,0,0,100,100);
}
function doDraw(){
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].update();
    audioNodes[i].draw();
  }
}
function doTopGUI(){
  xgui.update();
  xgui.draw();  
}
function mousePressed(){
  var pleaseDoZsort = false;
  var pleaseDoItAt = -1;

  for(var i=audioNodes.length-1; i>=0; i--){
    audioNodes[i].mousePressed();
    if(audioNodes[i].particle.dragging && i!=audioNodes.length-1){
      pleaseDoZsort = true;
      pleaseDoItAt  = i;
      break;
    }
  }
  if(pleaseDoZsort)  zSort(pleaseDoItAt);

  xgui.mousePressed();
}
function mouseReleased(){
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].mouseReleased();
  }
  xgui.mouseReleased();
}
function doubleClicked() {
  //console.log("still not?");
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].doubleClicked();
  }
}
function keyPressed() {
  for(var i=0; i<audioNodes.length; i++){
    audioNodes[i].keyPressed();
  }
  xgui.keyPressed();
}
/////////////////////////////////////////////////////////////////////////////////
function zSort(f){
  /*
    var last = (audioNodes[f]);
    audioNodes.splice(f,1);
    audioNodes.push(last);
    console.log(">>> "+last+" "+f);
    */
}
/////////////////////////////////////////////////////////////////////////////////
var padW = 128, padH = 64;
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
function AudioNode(i){

  this.index           = i;
  this.author          = table.getString(this.index, 0);
  this.name            = table.getString(this.index, 1);
  this.filename1       = table.getString(this.index, 2);//natural
  this.filename2       = table.getString(this.index, 3);//warp
  this.filename3       = table.getString(this.index, 4);//thumb
  this.filename4       = table.getString(this.index, 5);//bg

  this.gainVals          = [];
  this.panVals           = [];
  
  for(var j=0; j<5; j++){
    this.gainVals[j] = table.getString(this.index, 6+2*j);//
    this.panVals[j]  = table.getString(this.index, 6+2*j+1);//
  }

  this.master = new AudioLayer(this.filename1, 2*i,   this, this.name+"_master", false);
  this.warp2  = new AudioLayer(this.filename2, 2*i+1, this, this.name+"_warp2",  true);

  var areLoaded = false; var countLoaded = 0;

  this.particle = new Particle(i);

  this.b1       = new Hitzone(-padW/4-(padW-6)/6,-padH/4+2,(padW-6)/8,(padH-6)/2.4, this);
  this.b2       = new Hitzone(-padW/4           ,-padH/4+2,(padW-6)/8,(padH-6)/2.4, this);
  this.b3       = new Hitzone(-padW/4+(padW-6)/6,-padH/4+2,(padW-6)/8,(padH-6)/2.4, this);

  this.b4       = new Hitzone(-padW/4           , padH/4  ,(padW-6)/2.2,(padH-6)/2.4, this);
  this.b5       = new Hitzone(+padW/4           , 0       ,(padW-6)/2.2,(padW-6)/2.2, this);

  
  this.topBar  = new Hitzone( 0                 , -padH/2-padH/16  ,padW        ,padH/8      , this);

  this.buttons = [this.b1,this.b2,this.b3,this.b4,this.b5];   

  this.minimize = false;

  this.gain = 0;//
  this.pan  = 0;//

  this.icon = loadImage(flatEric);//this.filename3, this.loadIcon);

  this.draw = function(){
    var meta = "Node "+nf(this.index,2)+" / "+this.name+" by "+this.author;

    push();
    translate(this.particle.x, this.particle.y);
    rectMode(CENTER);
    if(!this.minimize){
      rect(0,-padH/16,padW,padH+padH/8,4);
      imageMode(CENTER);
      image(this.icon,this.buttons[4].x,this.buttons[4].y,60,60);

      for(var i=0; i<this.buttons.length; i++){
        this.buttons[i].draw();
        //if(this.buttons[i].pressed)console.log("Hitting zone "+i+" at index "+this.index);
        if(this.buttons[i].rollover)bottomText=meta;//"Node "+nf(this.index,2)+" / "+this.name+" by "+this.author;
      }
    }

    push();fill(0);
    translate(this.buttons[3].x-0.5*(padH-6)/2.4, this.buttons[3].y);
    scale(0.8);
    triangle(0,-padH/8,0,padH/8,2*padH/8,0);
    rectMode(CENTER);
    translate(3*padH/8, 0);
    rect(0,0,padH/16, padH/4);
    pop();

    this.topBar.draw();
    pop();


    if(this.particle.rollover || this.topBar.rollover) bottomText=meta;
    if(this.particle.dragging) bottomText = meta+" Gain: "+nf(this.gain,1,2)+" Pan: "+nf(this.pan,1,2);
  }
  this.update = function(){
    this.particle.update();
    for(var i=0; i<this.buttons.length; i++){
      this.buttons[i].update();
    }
    this.topBar.update();

    //setups
    this.gain = map(this.particle.y, padH/2+padH/6+this.particle.h/2, height-padH/2-this.particle.h/2, 1, 0);
    this.pan  = map(this.particle.x, this.particle.w, width-this.particle.w, -1, 1);
  }
  this.mousePressed = function(){
    this.particle.mousePressed();
    for(var i=0; i<this.buttons.length; i++){
      this.buttons[i].mousePressed();
    }
    this.topBar.mousePressed();
  }
  this.doubleClicked = function(){
    //console.log("checking double");
    if(this.topBar.rollover){
      //console.log("double click on top bar");
      this.minimize = !this.minimize;
    }
  }
  this.mouseReleased = function(){
    this.particle.mouseReleased();
    for(var i=0; i<this.buttons.length; i++){
      this.buttons[i].mouseReleased();
    }
    this.topBar.mouseReleased();
  }
  this.keyPressed = function(){

  }
  /////////////////////////////////////////////////////////////////////
  this.audioLoaded = function(){
    countLoaded++;
    console.log("loaded "+ countLoaded+" at audionode "+this.index);
    bottomText =  "Loaded "+ countLoaded+" at audionode "+this.index;
    areLoaded = (countLoaded==2);
    if(areLoaded)countAudioNodesLoaded++;
    if(countAudioNodesLoaded==audioNodes.length){
      areLoaded=true;
      console.log("all audios loaded!!!");
      bottomText =  "All audio files loaded OK";
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
    bottomText = "Loading "+filename+" "+(status*100)+"%";
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
class Particle {//add if its draggable??
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
        mouseY>this.y-this.h-padH/8+padH/2 && 
        mouseY<this.y+this.h*(audioNodes[this.index].minimize?-1:1)-padH/2) {
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
    this.y      = constrain(this.y, this.h+padH/8+padH/2, height-this.h-padH/2);

    this.xSpeed = constrain(this.xSpeed,-2, 2);
    this.ySpeed = constrain(this.ySpeed,-1, 1);
  }
  mousePressed(){
      // Did I click on ?
    if (mouseX>this.x-this.w && 
        mouseX<this.x+this.w && 
        mouseY>this.y-this.h-padH/8 && 
        mouseY<this.y+this.h*(audioNodes[this.index].minimize?-1:1)) {
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
///////////////////////////////////////////////////////
class Hitzone {
  constructor(x,y,w,h,p){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rollover = false;
    this.pressed = false;
    this.parent = p;
    this.xx = this.x+this.parent.particle.x;
    this.yy = this.y+this.parent.particle.y;
  }
  update() {
    this.xx = this.x+this.parent.particle.x;
    this.yy = this.y+this.parent.particle.y;
    if (mouseX>this.xx-this.w/2 && 
        mouseX<this.xx+this.w/2 && 
        mouseY>this.yy-this.h/2 && 
        mouseY<this.yy+this.h/2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }
  mousePressed(){
    if (mouseX>this.xx-this.w/2 && 
        mouseX<this.xx+this.w/2 && 
        mouseY>this.yy-this.h/2 && 
        mouseY<this.yy+this.h/2) {
      //console.log("a button checking");
      this.pressed = true;
    }
  }
  mouseReleased() {
    this.pressed = false;
  }
  draw(){
    push();
    translate(this.x, this.y);
    fill(0, this.pressed? 96 : this.rollover? 64 : 0 );//<<
    rectMode(CENTER);
    rect(0,0,this.w,this.h);
    pop();
  }
}
//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class XHitzone {
  constructor(x,y,w,h,p){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rollover = false;
    this.pressed = false;
    this.parent = p;
  }
  update() {
    this.xx = this.x;//+this.parent.particle.x;
    this.yy = this.y;//+this.parent.particle.y;
    if (mouseX>this.xx-this.w/2 && 
        mouseX<this.xx+this.w/2 && 
        mouseY>this.yy-this.h/2 && 
        mouseY<this.yy+this.h/2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }
  mousePressed(){
    if (mouseX>this.xx-this.w/2 && 
        mouseX<this.xx+this.w/2 && 
        mouseY>this.yy-this.h/2 && 
        mouseY<this.yy+this.h/2) {
      //console.log("a button checking");
      this.pressed = true;
    }
  }
  mouseReleased() {
    this.pressed = false;
  }
  draw(){
    push();
    translate(this.x, this.y);
    fill(this.pressed? 196 : this.rollover? 128 : 255 );
    rectMode(CENTER);
    rect(0,0,this.w,this.h);
    pop();
  }
}
//////////////////////////////////////////////////////////////////////////////
function TopGUI(){

  this.b1       = new XHitzone(width-padW-2, padH/4,
                                (padW),(padH)/2.4, this);
  this.b2       = new XHitzone(width-padW-2-padW/2-28, padH/4,
                                (padW)/4,(padH)/2.4, this);
  this.b3       = new XHitzone(width-padW-2-padW/2-28-padW/4-2, padH/4,
                                (padW)/4,(padH)/2.4, this);

  this.otherButtons = [];
  for(var i=0; i<5; i++){
    this.otherButtons[i] = new XHitzone( width-padW-2-padW/2-28-2*(padW/4-2) - i*padH/4*1.2 - padH,
                                         padH/4,
                                         padH/4, padH/4
                                          );
  }

  this.buttons = [this.b1, this.b2, this.b3];   

  this.playAll = false, this.oldState = true;

  this.draw = function(){
    push();
    rectMode(CORNER);
    fill(255);//noStroke();
    //stroke(0);
    rect(0,0,width,padH/2);
    rect(0,height-padH/2,width,padH/2);
    fill(0);
    textSize(10); 
    for(var i=0; i<this.buttons.length; i++){
      this.buttons[i].draw();
        //
      if(i==0){

        if(this.buttons[i].pressed){
          this.playAll = !this.playAll;
        }
        

        textAlign(LEFT);
        text(this.playAll? "PAUSE ALL":"PLAY ALL", this.buttons[i].x, this.buttons[i].y+4);
        push();
        translate(this.buttons[i].x-padW/2+padH/4, this.buttons[i].y);
        triangle(0,-padH/8,0,padH/8,2*padH/8,0);
        rectMode(CENTER);
        translate(3*padH/8, 0);
        rect(0,0,padH/16, padH/4);
        pop();
      }else{
        textAlign(CENTER);
        if(i==1)
          text("S", this.buttons[i].x, this.buttons[i].y+4);
        else
          text("F", this.buttons[i].x, this.buttons[i].y+4);
      }
    }
    //fill(0);textAlign(CENTER);
    textSize(8); 
    for(var i=0; i<this.otherButtons.length; i++){
      this.otherButtons[i].draw();
      text('S'+(5-i+1), this.otherButtons[i].x, this.otherButtons[i].y+4);
        //if(this.buttons[i].pressed)console.log("Hitting zone "+i+" at index "+this.index);
    }


    fill(0);
    textSize(16); textAlign(LEFT); text('OBRA COLECTIVA MAKERS MUSICALES', 8, padH/4+6);
    textSize(14); textStyle(ITALIC); textAlign(RIGHT); 
    text(bottomText, width-8, height-padH/4+6);
    pop();  
  }
  this.update = function(){
    for(var i=0; i<this.buttons.length; i++){
      this.buttons[i].update();
    }
    for(var i=0; i<this.otherButtons.length; i++){
      this.otherButtons[i].update();
    }
  }
  this.mousePressed = function(){
    for(var i=0; i<this.buttons.length; i++){
      this.buttons[i].mousePressed();
    }
    for(var i=0; i<this.otherButtons.length; i++){
      this.otherButtons[i].mousePressed();
    }
  }
  this.doubleClicked = function(){

  }
  this.mouseReleased = function(){
    for(var i=0; i<this.buttons.length; i++){
      this.buttons[i].mouseReleased();
    }
    for(var i=0; i<this.otherButtons.length; i++){
      this.otherButtons[i].mouseReleased();
    }
  }
  this.keyPressed = function(){

  }
}





