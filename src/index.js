import Phaser from "phaser";

window.onload = function () {
  var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [menu, playGame]
  }
  const game = new Phaser.Game(config);
  game.scene.start('menu');
}

var cursors;

class menu extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' })
  }
  preaload() {
    this.load.image('button1', 'src/assets/button1.png');
  }
  create() {
    this.add.text(0, 0, "Appuyer sur la touche espace pour commencer", { fontSize: '2em', fontStyle: 'bold', boundsAlignH: "center", boundsAlignV: "middle" });
    const play = document.querySelector('#start');
    play.addEventListener('click', () => {
      this.game.scene.stop('menu');
      this.game.scene.start('playGame');
    })

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();


  }
  update() {
    if (cursors.space.isDown) {
      this.game.scene.stop('menu');
      this.game.scene.start('playGame');
      console.log('i');
    }
  }
}

class playGame extends Phaser.Scene {
  constructor() {
    super({ key: 'playGame' })
  }

  preload() {
    // IMAGE
    this.load.image('treasure', 'src/assets/treasure.png');
    this.load.image('button1', 'src/assets/button1.png');
    this.load.image('button2', 'src/assets/button2.png');
    this.load.image('button3', 'src/assets/button3.png');
    this.load.image('button4', 'src/assets/button4.png');
    this.load.image('background', 'src/assets/background.jpg')
    this.load.image('bravo', 'src/assets/bravo.png');

    // AUDIO
    this.load.audio('bip', 'src/assets/bip.wav');
    this.load.audio('error', 'src/assets/error.wav');
    this.load.audio('success', 'src/assets/success.mp3')
  }

  create() {
    var code = 0;
    var codeToCheck = "";
    var treasure;

    // Générer aléatoirement le code du coffre
    for (let i = 0; i < 4; i++) {
      const random = Math.floor(Math.random() * 4) + 1;
      code = code + (random * Math.pow(10, i));
      console.log(code);
    }

    console.log(this);
    this.add.text(0, 0, "Rentrez code: " + code);
    treasure = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'treasure').setInteractive();
    var button1 = this.add.image(250, 500, 'button1');
    var button2 = this.add.image(350, 500, 'button2');
    var button3 = this.add.image(450, 500, 'button3');
    var button4 = this.add.image(550, 500, 'button4');

    var buttons = [button1, button2, button3, button4];

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].setInteractive();

      buttons[i].on('clicked', function () {
        // Appel la fonction onClickButton en réassignant le contexte
        onClickButton.apply(this, [(i + 1).toString()]);
      }, this);
    }

    //  If a Game Object is clicked on, this event is fired.
    //  We can use it to emit the 'clicked' event on the game object itself.
    this.input.on('gameobjectup', function (pointer, gameObject) {
      gameObject.emit('clicked', gameObject);
    }, this);


    // Dire sur quel objet travaillé pour le rendre déplaçable
    this.input.setDraggable(treasure);
    // Possible d'utiliser dragstart et dragend en déplacement pour effectuer des actions 
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    // Vérification du code
    function onClickButton(numberButton) {
      this.sound.play('bip');
      treasure.clearTint();
      codeToCheck += numberButton;
      console.log(codeToCheck);

      if (codeToCheck.length === 4) {
        if (codeToCheck == code) {
          // Supprime l'objet de la scène
          treasure.destroy();
          this.sound.play('success');
          this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'bravo').setScale(0.7);

        } else {
          this.sound.play('error');
          // Effet rouge sur l'image
          treasure.setTint(0xff0000);
          codeToCheck = "";
        }
      }
    }

  }
  update() { }
}
