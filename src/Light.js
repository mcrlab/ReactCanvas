function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


export default class Light {

    constructor(id, color, position){

        let object = hexToRgb(color);
        this.id = id;
        this.r = object.r;
        this.g = object.g;
        this.b = object.b;
        this.position = position;
    }


    setPosition(position){
        fetch("/lights/position/LIGHT_ID",{
            method : "PUT",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(position)
            })
          .then(response=> response.json())
          .then(json => console.log(json));
    }
    
    paint(ctx){
        ctx.beginPath();
        let opacity = 1
        let radius = 30;
        var sizeWidth = ctx.canvas.clientWidth;
        var sizeHeight = ctx.canvas.clientHeight;

        let location = {
            x: sizeWidth * this.position.x,
            y: sizeHeight * this.position.y 
        };

        var gradient = ctx.createRadialGradient(location.x, location.y, 0, location.x, location.y, radius);
        gradient.addColorStop(0, "rgba("+this.r+", "+this.g+", "+this.b+", "+opacity+")");
        gradient.addColorStop(0.5, "rgba("+this.r+", "+this.g+", "+this.b+", "+opacity+")");
        gradient.addColorStop(1, "rgba("+this.r+", "+this.g+", "+this.b+", 0)");
    
        ctx.fillStyle = gradient;
        ctx.arc(location.x, location.y, radius, Math.PI*2, false);
        ctx.fill();
    }
}
