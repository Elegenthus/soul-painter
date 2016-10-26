function createPaint(){
	var cx = document.querySelector("#canvas").getContext("2d");
	for (key in controls) {
		controls[key](cx)
	}
}

function relativePos(event, element) {
	var rect = element.getBoundingClientRect();
	return {x: Math.floor(event.clientX - rect.left),
			y: Math.floor(event.clientY - rect.top)}
}

function trackDrag(onMove, onEnd, cx) {
	function end(event) {
		cx.canvas.removeEventListener("mousemove", onMove)
		cx.canvas.removeEventListener("mouseup", end)
		if (onEnd)
			onEnd(event)
	}
	cx.canvas.addEventListener("mousemove", onMove)
	cx.canvas.addEventListener("mouseup", end)
}

var tools = {}
var controls = {}

controls.tool = function(cx){
	var select = 0
	var array = ["Line", "Earse","Text"]
	var icons = document.querySelectorAll(".tool img")
	icons = Array.prototype.slice.call(icons)
	icons[0].style.borderColor = "red"
	icons.forEach(function(item){
		item.addEventListener("click",function(event){
			select = icons.indexOf(event.target)
			icons.forEach(function(item){
				item.style.borderColor = "#999"
			})
			event.target.style.borderColor = "red"
		})
	})
	
	cx.canvas.addEventListener("mousedown", function(event){
		if (event.which == 1) {
			tools[array[select]](event, cx)
		}
		event.preventDefault();
	})
}

tools.Line = function(event, cx, onEnd){
	cx.lineCap = "round"
	var pos = relativePos(event, cx.canvas)
	trackDrag(function(event){
		cx.beginPath()
		cx.moveTo(pos.x, pos.y)
		pos = relativePos(event, cx.canvas)
		cx.lineTo(pos.x, pos.y)
		cx.stroke()
	}, onEnd, cx)
}

tools.Earse = function(event, cx){
	cx.globalCompositeOperation = "destination-out"
	tools.Line(event,cx,function(){
		cx.globalCompositeOperation = "source-over"
	})
}

tools.Text = function(event, cx){
	var text = prompt("Text: ", "")
	if(text){
		pos = relativePos(event, cx.canvas)
		cx.textBaseline = "top"
		cx.font = Math.max(7,cx.lineWidth)+"px san-serif"
		cx.fillText(text,pos.x,pos.y)
	}
}


controls.color = function(cx) {
	var input = document.querySelector("#color")
	input.addEventListener("change",function(event){
		cx.strokeStyle = input.value
	})
}

controls.clear = function(cx){
	var clear = document.querySelector(".clear img")
	clear.addEventListener("click",function(){
		cx.clearRect(0, 0, 500, 500)
	})
}


controls.lineWidth = function(cx) {
	var select = document.querySelector("#lineWidth")
	select.addEventListener("change",function(event){
		cx.lineWidth = select.value
	})
}

createPaint()