function TiroInimigo(context, nave, x, y) {
   this.context = context;
   this.nave = nave;
   this.imagem = imagens.tiroInimigo;
   this.escala = .9;
   this.sprite = new Spritesheet(this.context, this.imagem, 1, 1);
   this.largura = this.imagem.width;
   this.altura = this.imagem.height;
   this.velocidade = 500;
   this.imgExplosao = imagens.explosao;
   this.x = x || (this.nave.position.x + (this.nave.largura()/2 - this.imagem.width/this.escala/2));
   this.y = y || (this.nave.position.y + this.nave.imagem.height/this.nave.escala);
   sons.tiro.currentTime = 0.0;
   sons.tiro.volume = 0.02;
   sons.tiro.play();
}
TiroInimigo.prototype = {
   atualizar: function() {
      this.y += this.velocidade * this.animacao.decorrido / 1000;
      if (this.y > 600) {
         this.animacao.excluirSprite(this);
         this.colisor.excluirSprite(this);
      }
   },

   desenhar: function() {
      this.sprite.desenhar({x: this.x, y: this.y - this.imagem.height }, this.escala);      
   },

   retangulosColisao: function() {
      var rets = 
      [ 
         {x: this.x, y: this.y, largura: this.imagem.width/this.escala, altura: -this.imagem.height/this.escala},
      ];
      
      if ( this.colisor.desenharQuadrados() ) {
         var ctx = this.context;
         
         for (var i in rets) {
            ctx.save();
            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(rets[i].x, rets[i].y, rets[i].largura, 
                           rets[i].altura);
            ctx.restore();
         }
      }
      
      return rets;
   },

   colidiuCom: function(outro) {
      if (outro instanceof Player) {
         this.animacao.excluirSprite(this);
         this.animacao.excluirSprite(outro);
         this.colisor.excluirSprite(this);
         this.colisor.excluirSprite(outro);
         var exp = new Explosao(this.context, this.imgExplosao,
                                 outro.position.x, outro.position.y);
         this.animacao.novoSprite(exp);
         outro.morto = true;
      }
   }
}
