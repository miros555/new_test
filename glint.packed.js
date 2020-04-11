/*************************************************************
 * This script is developed by Arturs Sosins aka ar2rsawseen, http://webcodingeasy.com
 * Feel free to distribute and modify code, but keep reference to its creator
 *
 * Glint effect provides you an ability to add glint effect 
 * to different HTML objects, which can append canvas element
 *
 * For more information, examples and online documentation visit: 
 * http://webcodingeasy.com/JS-classes/Javascript-glint-effect
**************************************************************/
(function( $ ){
	$.fn.glint = function(options) {
		var conf = {
			//how many pixels per interval to move
			speed: 3,
			//how often to move glint
			interval: 10,
			//pause after glint before another one
			pause: 1000,
			//size of glint
			size: 100,
			//red channel
			r: 255,
			//green channel
			g: 255,
			//blue channel
			b: 255,
			//angle of glint
			angle: 45,
			//density/maximal alpha channel
			density: 255,
			//horizontal or vertical
			horizontal: true,
			//from left to right or backward
			forward: true,
			onerror: null
		};
		//copy settings
		if ( options ) { 
			$.extend( conf, options );
		}
		//check orientation
		if(!conf.horizontal)
		{
			var orient = {
				offsize: "outerHeight",
				offspace: "outerWidth",
				move: "y",
				pos: "x"
			};
		}
		else
		{
			var orient = {
				offsize: "outerWidth",
				offspace: "outerHeight",
				move: "x",
				pos: "y"
			};
		}
		//fix types
		conf.size = parseInt(conf.size);
		conf.angle = parseInt(conf.angle);
		conf.speed = parseInt(conf.speed);
		conf.pause = parseInt(conf.pause);
		conf.interval = parseInt(conf.interval);
		//fix angle
		conf.angle = (conf.angle > 0 && conf.angle < 180) ? conf.angle : 90;
		//fix density
		conf.density = (conf.density > 0 && conf.density < 255) ? conf.density : 255;
		//apply to each element
		return this.each(function() {        
			var c = document.createElement('canvas');
			//check canvas support
			if(c.getContext)
			{
				var $this = $(this);
				var position = new Object();
				position.x = 0;
				position.y = 0;
				if($this.css("position") == "static")
				{
					$this.css("position", "relative");
				}
				var glint_size = Math.round(conf.size + Math.abs($this[orient.offspace]()/Math.tan((conf.angle/180)*Math.PI)));
				var canvas = $(c);
				canvas.css({
					'position':'absolute',
					'top':0,
					'left':0
				});
				c.setAttribute("width", $this.outerWidth() + "px");
				//set canvas height
				c.setAttribute("height", $this.outerHeight() + "px");
				var p = document.createElement('canvas');
				if(conf.horizontal)
				{
					p.setAttribute("width", glint_size + "px");
					p.setAttribute("height", $this.outerHeight() + "px");
				}
				else
				{
					p.setAttribute("width", $this.outerWidth() + "px");
					p.setAttribute("height", glint_size + "px");
				}
				$this.append(c);
				var main = c.getContext("2d");
				var ctx = p.getContext("2d");
				position[orient.move] = -glint_size;
				position[orient.top] = 0;
				var size = (!conf.horizontal) ? $this.outerHeight() : $this.outerWidth();
				var draw_pixels = function(){
					//calculate offset
					var offset = glint_size-conf.size;
					//create image
					if(conf.horizontal)
					{
						var data = ctx.createImageData(glint_size, $this.outerHeight());
					}
					else
					{
						var data = ctx.createImageData($this.outerWidth(), glint_size);
					}
					//calculate density coeficient
					var half = Math.round(conf.size/2);
					var coef = conf.density/half;
					//rotate through pixels
					for(var i = 0; i < data.width; i++)
					{
						for(var j = 0; j < data.height; j++)
						{
							//check pixel type
							if(conf.horizontal)
							{
								if(conf.angle > 90)
								{
									var check = Math.round(j*(offset/$this.outerHeight()));
								}
								else
								{
									var check = offset - Math.round(j*(offset/$this.outerHeight()));
								}
								var e = i-check;
							}
							else
							{
								if(conf.angle > 90)
								{
									var check = Math.round(i*(offset/$this.outerWidth()));
								}
								else
								{
									var check = offset - Math.round(i*(offset/$this.outerWidth()));
								}
								var e = j-check;
							}
							//if pixel should be colored
							if(e >= 0 && e <= conf.size)
							{
								// Index of the pixel in the array
								var idx = (i + j * data.width) * 4;
								// The RGB values
								data.data[idx + 0] = conf.r;
								data.data[idx + 1] = conf.g;
								data.data[idx + 2] = conf.b;
								//calculate alpha
								data.data[idx + 3] = (e <= half) ? parseInt(coef*e) : Math.abs(conf.density - (parseInt(coef*e)-conf.density));
							}
						}
					}
					//save image
					ctx.putImageData(data, 0, 0);
				};
				var do_glint = function(){
					//clear previous image
					if(conf.horizontal)
					{
						main.clearRect(position.x, position.y, Math.abs(glint_size), $this.outerHeight());
					}
					else
					{
						main.clearRect(position.x, position.y, $this.outerWidth(), Math.abs(glint_size));
					}
					//draw new image
					main.drawImage(p, position.x, position.y);
					//calculate positions
					if(conf.forward)
					{
						position[orient.move] += conf.speed;
						if(size < position[orient.move])
						{
							position[orient.move] = -glint_size;
							setTimeout(do_glint, conf.pause);
						}
						else
						{
							setTimeout(do_glint, conf.interval);
						}
					}
					else
					{
						position[orient.move] -= conf.speed;
						if(-glint_size > position[orient.move])
						{
							position[orient.move] = size+glint_size;
							setTimeout(do_glint, conf.pause);
						}
						else
						{
							setTimeout(do_glint, conf.interval);
						}
					}
				};
				draw_pixels();
				do_glint();
			}
			else if(conf.onerror)
			{
				conf.onerror();
			}
		});
	};
})( jQuery );