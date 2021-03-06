function Escudo(context, imagem, position) {
	this.context = context;
	this.imagem = imagem;
	this.sprite = new Spritesheet(this.context, this.imagem, 1, 89);
	this.position = position;
	this.escala = 1.7;
	this.sprite.intervalo = 20;	
	this.velocidade = 100;
}

Escudo.prototype = Object.create(Upgrade.prototype);

Escudo.prototype.tocarSom = function () {
	sons.escudo.volume = .4;
	sons.escudo.play();
	sons.escudo.currentTime = 0.0;
};

Escudo.prototype.acao = function () {
	if (!player1.escudo || barrier && barrier.hp == 1 ) {
		if (barrier) barrier.destruir();
		player1.escudo = true;
		this.tocarSom(); 
		barrier = new Barreira(this.context, imagens.barreira, player1.position);
		animacao.novoSprite(barrier);
		colisor.novoSprite(barrier);
	}
}

function Barreira(context, imagem, position) {
	this.context = context;
	this.imagem = imagem;
	this.sprite = new Spritesheet(this.context, this.imagem, 4, 5);
	this.offsetPosition = { x: -70, y: -40};
	this.position = {x: position.x + this.offsetPosition.x, y: position.y + this.offsetPosition.y};
	this.escala = .9;
	this.sprite.intervalo = 50;
	this.sprite.multiLine = true;
  	this.hp = 2;
}

Barreira.prototype = {
	atualizar: function() {
	  this.position = {x: player1.position.x + this.offsetPosition.x, y: player1.position.y + this.offsetPosition.y}
	},
	desenhar: function() {
	  this.sprite.desenhar(this.position, this.escala);
	  this.sprite.proximoQuadro();
	},

	colidiuCom: function (outro) {
		if (outro instanceof TiroInimigo) {
			if ( this.hp > 0) {
			sons.escudoAtingido.volume = .2;
			sons.escudoAtingido.currentTime = 0.0;
			sons.escudoAtingido.play();
			animacao.excluirSprite(outro);
			colisor.excluirSprite(outro);
			this.hp--;
			if (this.hp == 0) {
				sons.escudoAtingido.volume = 0.2;
				sons.escudoAtingido.currentTime = 0.0;
				sons.fimEscudo.play();
				this.destruir();
			}
		}
		}
	},

	destruir: function () {
		animacao.excluirSprite(this);
		colisor.excluirSprite(this);
		player1.escudo = false;
		barrier = undefined;
	},

	retangulosColisao: function() {
      // Estes valores vão sendo ajustados aos poucos
      var rets = 
      [ 
        {x: this.position.x + 33 , y: this.position.y + 2, largura: (this.imagem.width/this.sprite.numColunas) * (this.escala) - 25, altura: ((this.imagem.height/this.sprite.numLinhas) * this.escala) - 10}
      ];
      
      // Desenhando os retângulos para visualização
      
      if ( colisor.desenharQuadrados() ) {
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
};