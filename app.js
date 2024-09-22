let my_width = window.innerWidth - 20;
let my_height = window.innerHeight - 20;

let config = {
  type: Phaser.AUTO,
  width: my_width,
  height: my_height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('bush', 'assets/bush.png');
  this.load.image('orange', 'assets/orange.png');
  this.load.image('pelican', 'assets/pelican.png', {
    frameWidth: 64,
    frameHeight: 96,
  });
  this.load.image('capybara', 'assets/capy.png', {
    frameWidth: 64,
    frameHeight: 96,
  });
}

let gameOver = false;
let road;
let bush;
let isGameStarted = false;
let pause = false;
let cursors;
let score = 0;
let count = 0;
let orange;
let oranges;
let inputPopup;
let answer = 0;
let capybara;
let random1 = 0;
let random2 = 0;
var inputLabel;

function create() {
  const sky = this.add
    .image(0, 0, 'sky')
    .setOrigin(0, 0)
    .setDisplaySize(my_width, my_height);

  bush = this.add
    .tileSprite(0, my_height - 225, my_width, 150, 'bush')
    .setOrigin(0, 0);

  road = this.add
    .tileSprite(0, my_height - 100, my_width, 100, 'road')
    .setOrigin(0, 0);

  this.physics.add.existing(road, true);

  capybara = this.physics.add
    .sprite(my_width / 2, 200, 'capybara')
    .setScale(0.08);
  pelican = this.physics.add.sprite(-100, 200, 'pelican').setScale(0.13);
  capybara.setCollideWorldBounds(true);

  capybara.body.setGravityY(300);
  pelican.body.setGravityY(300);

  this.physics.add.collider(
    capybara,
    road,
    () => (gameOver = true),
    null,
    this
  );

  this.physics.add.collider(capybara, pelican, () => (gameOver = true));

  cursors = this.input.keyboard.createCursorKeys();
  oranges = this.physics.add.group();

  messageToPlayer = this.add.text(
    my_width / 2 - 200,
    250,
    'Capybara Math Adventures\nPress Space to Play',
    {
      fontSize: '32px',
      fill: '#000',
    }
  );

  inputPopup = document.getElementById('textInputPopup');
  var inputElement = document.getElementById('textInput');
  var submitButton = document.getElementById('submitButton');
  inputLabel = document.getElementById('inputLabel');

  submitButton.addEventListener('click', function () {
    var inputValue = parseInt(inputElement.value);
    if (inputValue === answer) {
      score++;
      pelican.x -= 150;
    }
    inputElement.value = '';
    inputPopup.style.display = 'none';
    pause = false;
  });
}

function spawnOrange(scene) {
  let orange = oranges
    .create(my_width, Phaser.Math.Between(100, my_height - 100), 'orange')
    .setScale(0.1)
    .setVelocityX(-100);

  scene.physics.add.collider(capybara, orange, () => {
    pause = true;
    random1 = Math.floor(Math.random() * 10);
    random2 = Math.floor(Math.random() * 10);
    inputLabel.textContent = random1 + ' + ' + random2 + ' = ';
    answer = random1 + random2;
    inputPopup.style.display = 'block';
    orange.destroy();
  });
}

function update() {
  // press space to start game
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    messageToPlayer.setText('');
    messageToPlayer.setPosition(25, 25);
  }

  //capybara fly
  if (cursors.up.isDown && !gameOver && !pause) {
    capybara.setVelocityY(-160);
    pelican.setVelocityY(-160);
  }

  //game not started yet
  if (!isGameStarted) {
    capybara.setVelocityY(-6);
    pelican.setVelocityY(-6);
  }

  // game start and road moves and update score
  if (isGameStarted && !gameOver && !pause) {
    road.tilePositionX += 6;
    bush.tilePositionX += 5;
    pelican.setVelocityX(25);
    messageToPlayer.setText('Score: ' + score);
    count++;
    if (count % 400 === 0) {
      spawnOrange(this);
    }
  }

  //pause the game
  if (pause) {
    capybara.setVelocityX(0);
    capybara.setVelocityY(-6);
    pelican.setVelocityX(0);
    pelican.setVelocityY(-6);
  }

  if (gameOver) {
    capybara.destroy();
    pelican.setVelocityY(-160);
    if(orange){
        oranges.children.iterate(function (orange) {
            orange.destroy();
          });
    }
  }
}
