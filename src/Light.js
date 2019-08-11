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
        this.id = id;
        this.color = color;
        this.position = position;
    }


    setColor(color, time){
        fetch(`/lights/${this.id}`,{
            method : "PUT",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({color, time})
            })
          .then(response=> response.json());
    }

    setPosition(position){
        fetch(`/lights/position/${this.id}`,{
            method : "PUT",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(position)
            })
          .then(response=> response.json());
    }

    paint(ctx){
        ctx.beginPath();
        let opacity = 1
        let radius = 50;
        var sizeWidth = ctx.canvas.clientWidth;
        var sizeHeight = ctx.canvas.clientHeight;

        let location = {
            x: sizeWidth * this.position.x,
            y: sizeHeight * this.position.y 
        };

        let object = hexToRgb(this.color);

        var gradient = ctx.createRadialGradient(location.x, location.y, 0, location.x, location.y, radius);
        gradient.addColorStop(0, "rgba("+object.r+", "+object.g+", "+object.b+", "+opacity+")");
        gradient.addColorStop(0.5, "rgba("+object.r+", "+object.g+", "+object.b+", "+opacity+")");
        gradient.addColorStop(1, "rgba("+object.r+", "+object.g+", "+object.b+", 0)");
    
        ctx.fillStyle = gradient;
        ctx.arc(location.x, location.y, radius, Math.PI*2, false);
        ctx.fill();
    }
}
