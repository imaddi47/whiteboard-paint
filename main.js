// whiteboard
let wb = document.querySelector("#whiteboard");
let wbCtx = wb.getContext("2d");

// whiteboard memory
let wbMem = document.createElement("canvas");
let wbCtxMem = wbMem.getContext("2d");

// init whiteboard
function initWhiteboard(){
    wb.width = window.innerWidth;
    wb.height = window.innerHeight;
    wbCtx.lineCap = 'round';
    wbCtx.lineJoin = 'round';
    wbCtx.lineWidth = 10;
}
window.addEventListener('load', initWhiteboard);

// resize 
function adjustWhiteboard(e){
    // store whiteboard previous content to memory to save its state
    wbMem.width = wb.width;
    wbMem.height = wb.height;

    wbCtxMem.lineCap = wbCtx.lineCap;
    wbCtxMem.strokeStyle = wbCtx.strokeStyle;
    wbCtxMem.lineJoin = wbCtx.lineJoin;
    wbCtxMem.lineWidth = wbCtx.lineWidth;

    wbCtxMem.drawImage(wb, 0, 0);

    // resize to window dimensions
    wb.width = window.innerWidth;
    wb.height = window.innerHeight;

    wbCtx.lineWidth = wbCtxMem.lineWidth;
    wbCtx.lineCap = wbCtxMem.lineCap;
    wbCtx.lineJoin = wbCtxMem.lineJoin;
    wbCtx.strokeStyle = wbCtxMem.strokeStyle;

    wbCtx.drawImage(wbMem, 0, 0);
}
window.addEventListener('resize', adjustWhiteboard);

// ------------------ whiteboard controls
// undo/redo
let wbHistory = [];
let currWbHistory = -1;

function undoWhiteboard(){
    if(currWbHistory <= -1) return;

    if(currWbHistory-- == 0){
        wbCtx.clearRect(0, 0, wb.width, wb.height);
        canUndo = false;
        return;
        // disable undo button 
    }
    let mode = wbCtx.globalCompositeOperation;

    wbCtx.globalCompositeOperation = 'source-over';
    wbCtx.clearRect(0, 0, wb.width, wb.height);
    wbCtx.drawImage(wbHistory[currWbHistory], 0, 0);
    
    wbCtx.globalCompositeOperation = mode;
}

function redoWhiteboard(){
    if(currWbHistory >= wbHistory.length - 1) return;

    let mode = wbCtx.globalCompositeOperation;
    wbCtx.globalCompositeOperation = 'source-over';

    wbCtx.clearRect(0, 0, wb.width, wb.height);
    wbCtx.drawImage(wbHistory[++currWbHistory], 0, 0);

    wbCtx.globalCompositeOperation = mode;
}

// pencil/doodle
function doodle(){
    wbCtx.globalCompositeOperation = 'source-over';
}
// eraser
function eraser(){
    wbCtx.globalCompositeOperation = 'destination-out';
}
// download Whiteboard as image
function saveWhiteBoard(){
    let downloader = document.createElement("a");
    downloader.href = `${wb.toDataURL()}`;
    downloader.download = "Whiteboard.jpg";
    downloader.click();
}
// reset Whiteboard
function resetWhiteboard(){
    if(!window.confirm("Confirm to reset(non-recoverable) whiteboard!")) return;
    wbCtx.clearRect(0,0, wb.width, wb.height);
    wbHistory = [];
    currWbHistory = -1;
}

// whiteboard doodle mouse event
let isDrawing = false;
let startX = 0;
let startY = 0;

function drawing(x, y){
    if(!isDrawing) return;

    wbCtx.beginPath();
    wbCtx.moveTo(startX, startY);
    wbCtx.lineTo(x, y);
    wbCtx.stroke();

    startX = x;
    startY = y;
}
function startDrawing(x,y){
    isDrawing = true;
    startX = x;
    startY = y;
}
function stopDrawing(){
    if(isDrawing){
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = wb.width;
        canvas.height = wb.height;
        ctx.drawImage(wb, 0, 0);

        if(wbHistory[++currWbHistory]){
            wbHistory = [...wbHistory.slice(0,currWbHistory), canvas];
        }else{
            wbHistory.push(canvas);
        }
    }
    isDrawing = false;
}

wb.addEventListener('mousedown', (e) => {startDrawing(e.offsetX, e.offsetY)});
wb.addEventListener('touchstart', (e) => {startDrawing(e.touches[0].clientX, e.touches[0].clientY)});

wb.addEventListener('mousemove', (e) => drawing(e.offsetX, e.offsetY));
wb.addEventListener('touchmove', (e) => drawing(e.touches[0].clientX, e.touches[0].clientY));

wb.addEventListener('mouseup', stopDrawing);
wb.addEventListener('mouseout', stopDrawing);
wb.addEventListener('touchcancel', stopDrawing);
wb.addEventListener('touchend', stopDrawing);