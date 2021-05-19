// controls
let doodlePen = document.querySelectorAll('.doodle-pen');
let doodleColorPicker = document.querySelector('#control-doodle-select');
let doodlePointerSize = document.querySelector('#doodle-size');
let doodleReset = document.querySelector('#doodle-reset');
let doodleSave = document.querySelector('#doodle-save');
let doodleUndo = document.querySelector('#doodle-undo');
let doodleRedo = document.querySelector('#doodle-redo');
let doodleEraser = document.querySelector('#doodle-eraser');
let doodleResizer = document.querySelector('#doodle-size');
let doodleResizerKey = document.querySelector('#control-size');
doodleResizerKey.value = wbCtx.lineWidth;
let allBtn = document.querySelectorAll('.control-btn');
let controlToggler = document.querySelector('#controls-toggler');

// control's eventListeners
function clearBtnBG(){
    for(let i = 0; i < allBtn.length; i++){
        allBtn[i].parentElement.style.backgroundColor = "#faebd7";
    }
}
function doodlePenSelect(e){
    // pre set all settings
    doodle();
    clearBtnBG();
    this.parentElement.style.backgroundColor = "#d8d7fa";

    let colorValue = this.dataset.pen;
    doodlePointerSize.style.color = colorValue;
    // console.log(colorValue);

    // whiteboard pointer color change
    wbCtx.strokeStyle = colorValue;
}

function doodleColorSelect(e){
    doodle();
    
    let colorValue = this.value;
    doodlePointerSize.style.color = colorValue;
    // console.log(colorValue);

    wbCtx.strokeStyle = colorValue;
}
function openResizer(){
    if(this.dataset.open == 'false'){
        doodleResizer.querySelector('li').classList.add('active');
        this.dataset.open = "true";
    }else{
        doodleResizer.querySelector('li').classList.remove('active');
        this.dataset.open = "false";
    }
}
function updateResizer(){
    document.querySelector('#doodle-size i').style.fontSize = `${Number(this.value)*1.25}px`;
    wbCtx.lineWidth = this.value;
}
 
doodlePen.forEach(pen => pen.addEventListener("click", doodlePenSelect));
allBtn.forEach(btn => btn.addEventListener('click', function() {
    clearBtnBG();
    this.parentElement.style.backgroundColor = "#d8d7fa";
}));

doodleColorPicker.addEventListener('change', doodleColorSelect);
doodleResizerKey.addEventListener('change', updateResizer);
doodleReset.addEventListener('click', resetWhiteboard);
doodleSave.addEventListener('click', saveWhiteBoard);
doodleUndo.addEventListener('click', undoWhiteboard);
doodleRedo.addEventListener('click', redoWhiteboard);
doodleEraser.addEventListener('click', eraser);
doodleResizer.addEventListener('click', openResizer);
controlToggler.addEventListener('click', function(){
    if(this.classList.contains('active')){
        document.querySelector('#whiteboard-controls').classList.remove('active');
        this.classList.remove('active');
    }else{
        document.querySelector('#whiteboard-controls').classList.add('active');
        this.classList.add('active');
    }
});