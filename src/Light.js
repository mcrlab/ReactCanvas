function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function lerp(a, b, u){
    return Math.floor((1-u) * a + u * b);
  };


const LIGHT_WIDTH = 100;
const LIGHT_HEIGHT = 100;

export default class Light {

    constructor(id, color, position){
        this.id = id;
        this.color = color;
        this.targetColor = color;
        this.position = position;
        this.animationTime = 0;
        this.animationDelay = 0;
        this.lastUpdateTime = new Date().getTime();
        this.isTouching = false;
        this.img = new Image();
        this.img.src = "light.png";
    }


    update(color, position, animationTime, animationDelay){
      this.targetColor = color;
      this.animationTime = animationTime || 0;
      this.animationDelay = animationDelay  || 0
      this.position = position;
      this.lastUpdateTime = new Date().getTime();
    }

    setColor(color, time){
      fetch(`/lights/${this.id}`,{
          method : "PUT",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            "color": color,
            "time": time || 0
          })
        })
        .then(response=> response.json());
  }

    setPosition(update){
        this.color = update.color;
        fetch(`/lights/position/${this.id}`,{
            method : "PUT",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(update)
            })
          .then(response=> response.json());
    }

    paint(ctx){
        const now = new Date().getTime();

        const animationStartTime = this.lastUpdateTime + this.animationDelay;
        const animationEndTime = animationStartTime + this.animationTime;
        const elapsedTime = now - animationStartTime;

        let object = {};
        if(now < animationStartTime){
          object = hexToRgb(this.color);  
        } else if(now > animationStartTime && now < animationEndTime){

          let r = lerp( hexToRgb(this.color).r, hexToRgb(this.targetColor).r, elapsedTime / this.animationTime);
          let g = lerp( hexToRgb(this.color).g, hexToRgb(this.targetColor).g, elapsedTime / this.animationTime);
          let b = lerp( hexToRgb(this.color).b, hexToRgb(this.targetColor).b, elapsedTime / this.animationTime);
          object = {r,g,b};
        } else {

          this.color = this.targetColor;
          object = hexToRgb(this.color);         
        }


        ctx.beginPath();
        let opacity = 1
        let radius = LIGHT_WIDTH * 0.22;
        var sizeWidth = ctx.canvas.clientWidth;
        var sizeHeight = ctx.canvas.clientHeight;

        let location = {
            x: sizeWidth * this.position.x,
            y: sizeHeight * this.position.y 
        };



        var gradient = ctx.createRadialGradient(location.x, location.y, 0, location.x, location.y, radius);
        gradient.addColorStop(0, "rgba("+object.r+", "+object.g+", "+object.b+", "+opacity+")");
        gradient.addColorStop(0.5, "rgba("+object.r+", "+object.g+", "+object.b+", "+opacity+")");
        gradient.addColorStop(1, "rgba("+object.r+", "+object.g+", "+object.b+", 1)");
    
        if(!this.isTouching){
          ctx.fillStyle = gradient;
          ctx.arc(location.x, location.y, radius, Math.PI*2, false);
          ctx.fill();
          ctx.drawImage(this.img, location.x - (LIGHT_WIDTH * 0.5), location.y-(LIGHT_HEIGHT * 0.35), LIGHT_WIDTH, LIGHT_HEIGHT);
        }
    }
}
