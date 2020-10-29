import Phaser from "phaser";

window.onload = function () {
  var config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      width: window.innerWidth,
      height: window.innerHeight
    },
    backgroundColor: '#b0b2ad',
    scene: [menu, playGame, nextLevel]
  }
  const game = new Phaser.Game(config);
  game.scene.start('menu');

}

var cursors;

class menu extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' })
  }

  preload() {
    this.load.image('play', 'src/assets/play.png');
  }

  create() {
    this.add.text(0, 0, "Appuyer sur la touche espace pour commencer", { fontSize: '2em', fontStyle: 'bold' });

    var playButton = this.add.image(0, 0, 'play').setScale(0.3);
    var text = this.add.text(0, 0, 'Play', { fontSize: '10em', color: 'black', fontStyle: 'bold' }).setOrigin(0.5);

    // Permet de centré dans la scène
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // Ajout d'un container qui contient l'image playButton et le texte à l'intérieur
    var container = this.add.container(screenCenterX, screenCenterY, [playButton, text]);

    // Ajout d'une "hit aera" qui permet d'activer l'animation lorsque la souris et proche du texte 'Play'
    container.setInteractive(new Phaser.Geom.Circle(0, 0, 120), Phaser.Geom.Circle.Contains);

    // Permet de faire l'animation sur le texte PLAY
    this.tweens.add({
      targets: text,
      alpha: 0.5,
      duration: 1000,
      ease: 'Sine.easeOut',
      yoyo: true,
      repeat: -1
    });

    container.on('pointerover', function () {
      playButton.setTint(0x44ff44);
    });

    container.on('pointerout', function () {
      playButton.clearTint();
    });

    // Lance la scène playGame quand on clique sur l'image
    container.on('pointerup', () => {
      this.game.scene.stop('menu');
      this.game.scene.start('playGame');
    })

    //  Montre la zone cliquable pour lancer la scène
    var graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00ffff, 1);
    graphics.strokeCircle(container.x, container.y, container.input.hitArea.radius);

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

  }

  update() {
    if (cursors.space.isDown) {
      this.game.scene.stop('menu');
      this.game.scene.start('playGame');
    }
  }

}

class playGame extends Phaser.Scene {
  constructor() {
    super({ key: 'playGame' })
  }

  preload() {
    // IMAGE
    this.load.image('coffre', 'src/assets/coffre.png');
    this.load.image('open', 'src/assets/opencoffre.png');
    this.load.image('button1', 'src/assets/button1.png');
    this.load.image('button2', 'src/assets/button2.png');
    this.load.image('button3', 'src/assets/button3.png');
    this.load.image('button4', 'src/assets/button4.png');
    this.load.image('env', 'src/assets/env.png');

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
    treasure = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'coffre').setInteractive();
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
          // Supprime le coffre et les boutons interactif de la scène
          treasure.destroy();
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].destroy();
          }
          this.sound.play('success');

          // Affichage du coffre ouvert
          setTimeout(() => {
            this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'open');
          }, 1000);

          // Affichage du popup
          setTimeout(() => {
            let popup = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'env').setScale(0.5).setInteractive();

            this.tweens.add({
              targets: popup,
              alpha: 0.5,
              y: 300,
              duration: 1000,
              ease: 'Sine.easeOut',
              yoyo: true,
              repeat: -1
            });

            popup.on('clicked', () => {
              this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, "Vous avez trouvé le code, bravo !", { fontSize: '5em', fontStyle: 'bold', color: 'red' }).setOrigin(0.5);

              let replay = this.add.text(0, 0, 'REJOUER', { fontSize: '10em', color: 'black', fontStyle: 'bold' }).setInteractive();

              replay.on('pointerup', () => {
                this.game.scene.start('playGame');
              })
            })
          }, 2000);

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

class nextLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'nextLevel' })
  }

  preload() {

  }

  create() {
    this.add.text(0, 0, 'LEVEL 2');
  }

  update() {

  }
}