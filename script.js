const pubSub = () => {

  const _events = {}

  const subscribe = (eventName, fn) => {
    _events[eventName] = fn || [];
    _events[eventName].push(fn);
  }

  const unsubscribe = (eventName, fn) => {
    if (_events[eventName]) {
      for (let i = 0; i <= _events[eventName].length; i++) {
        if (_events[eventName][i] === fn) {
          _events[eventName].splice(i, 1);
          break;
        }
      }
    }
    }


  const publish = (eventName, arg) => {
    if (_events[eventName]) {
      for (let i = 0; i <= _events[eventName].length; i++) {
        _events[eventName](arg);
      }
    }
  }

  return {
    subscribe,
    unsubscribe,
    publish
  }
}

const getInformation = (() => {

  // DOM Cache
  const _overlay = document.querySelector('.overlay');
  const _startGameContainer = _overlay.querySelector('.start-game');
  const _sliderContainer = _startGameContainer.querySelector('.slider-container');
  const _playerOneContainer = _sliderContainer.querySelector('#player-1-container');
  const _playerTwoContainer = _sliderContainer.querySelector('#player-2-container');

  // Player One Cache
  const _playerOneNameContainer = _playerOneContainer.querySelector('.name-container');
  const _playerOneName = _playerOneNameContainer.querySelector('#player-1-name');
  const _playerOneMarkerContainer = _playerOneContainer.querySelector('.marker-container');
  const _playerOneMarkerSelection = _playerOneMarkerContainer.querySelector('.marker-select');
  const _playerOneMarkers = _playerOneMarkerSelection.querySelectorAll('.image-container');

  // Player Two Cache
  const _playerTwoNameContainer = _playerTwoContainer.querySelector('.name-container');
  const _playerTwoName = _playerTwoNameContainer.querySelector('#player-2-name');
  const _aiCheck = _playerTwoNameContainer.querySelector('#play-as-ai');
  const _playerTwoMarkerContainer = _playerTwoContainer.querySelector('.marker-container');
  const _playerTwoMarkerSelection = _playerTwoMarkerContainer.querySelector('.marker-select');
  const _playerTwoMarkers = _playerTwoMarkerSelection.querySelectorAll('.image-container');

  // Buttons
  const _buttonContainer = _startGameContainer.querySelector('.buttons-container');
  const _startButton = _buttonContainer.querySelector('#start-game-button');

  // Declare Players
  let playerOne;
  let playerTwo;


  // Player Prototype
  const _playerPrototype = (playerName, playerMarker) => {

    let gamesWon = 0;

    return {
      playerName,
      playerMarker,
      gamesWon
    }
  }

  const _humanPlayer = (playerName, playerMarker) => {
    // Human Functions
    const doHumanThings = () => {
      console.log('Human Things');
    }
    return Object.assign({}, _playerPrototype(playerName, playerMarker), { doHumanThings })
  }

  // AI Player
  const _aiPlayer = (playerName, playerMarker) => {
    // AI Functions
    const doAIThings = () => {
      console.log('AI Things')
    }

    return Object.assign({}, _playerPrototype(playerName, playerMarker), { doAIThings })
  }

  // Create Player
  const _createPlayer = (playerName, playerMarker) => {
    if (playerName !== 'A.I') { 
      return _humanPlayer(playerName, playerMarker)
     } else {
      return _aiPlayer(playerName, playerMarker);
     }
  }

  const _getPlayerNameSelection = player => {
    if (player === "playerOne") {
      return _playerOneName.value;
    } else {
      if (!(_playerTwoName.value) && _aiCheck.checked) {
        return 'A.I';
      } else {
        return _playerTwoName.value;
      }
    }
  }

  const _getPlayerMarkerSelection = player => {
    let markerContainer;

    if (player === "playerOne") {

      _playerOneMarkers.forEach( cell => {

        if (cell.classList.contains('selected')) {
          markerContainer = cell;
        }

      })

    } else {
        if (!(_playerTwoName.value) && _aiCheck.checked) {

          let i = 0;
          let unSelected = false;

          _playerTwoMarkers.forEach( cell => {

            if (cell.classList.contains('selected')) { 
              i++ 
            }
            if (i === 0) { 
              unSelected = true 
            }
          })

          if (unSelected) {
            let j = Math.floor(Math.random() * _playerTwoMarkers.length - 1);
            if (j < 0) { j += 1 }
            markerContainer = _playerTwoMarkers[j];
          }
        } else {
          _playerTwoMarkers.forEach( cell => {
            if (cell.classList.contains('selected')) { 
              markerContainer = cell 
            }
          })
        }
      }
      return markerContainer.firstElementChild.src;
    }

  // Get Player Name Selection 
  const _getPlayerInformation = () => {
    const playerOneName = _getPlayerNameSelection('playerOne')
    const playerOneMarker = _getPlayerMarkerSelection('playerOne');
    let playerTwoName =_getPlayerNameSelection('playerTwo');
    let playerTwoMarker = _getPlayerMarkerSelection('playerTwo');

    return {
      playerOneName,
      playerOneMarker,
      playerTwoName,
      playerTwoMarker
    }
  }

  // Add Selected to Image
  const _addSelectedClass = event => {

    // Remove all selected if you want to select another
    let playerMarkers = event.target.parentElement.parentElement
    playerMarkers = [...playerMarkers.childNodes];
    playerMarkers = playerMarkers.filter(node => { return (node.nodeName !== '#text') })
    playerMarkers.forEach(node => { node.classList.remove('selected') });

    // Get target
    let target = event.target;
    playerMarkers.forEach(cell => {
      cell.classList.remove('selected');
    })
    if (target.nodeName === 'IMG') {
      target = event.target.parentElement;
    }

    // Add Selected Class
    target.classList.add('selected');
  }

  // Get Player Name
  const getPlayerName = player => {player.playerName};

  // Get Player Marker
  const getPlayerMarker = player => {player.playerMarker};

  _playerOneMarkers.forEach(cell => {
    cell.addEventListener('click', _addSelectedClass.bind(cell));
  })

  _playerTwoMarkers.forEach(cell => {
    cell.addEventListener('click', _addSelectedClass.bind(cell, cell));
  })

  // Event Listener to Capture Information

  _startButton.addEventListener('click', () => {
    const playerInformation = _getPlayerInformation();
    playerOne = _createPlayer(playerInformation.playerOneName, playerInformation.playerOneMarker);
    playerTwo = _createPlayer(playerInformation.playerTwoName, playerInformation.playerTwoMarker);
    clearScreen();
    displayController.render();
    statsModule.render();
  })

  const clearScreen = () => {
    _overlay.classList.add('hide-overlay');
    _startGameContainer.classList.add('hide-start-game')
  }

  return {
    getPlayerName,
    getPlayerMarker
  }
})()

const displayController = (() => {

  const gameBoardArray = {
    1: [1, 2, 3],
    2: [1, 2, 3],
    3: [1, 2, 3]
  }

  const render = () => {
    const body = document.querySelector('body');
    console.log(body);
    const playGameBoardContainer = document.createElement('div');
    playGameBoardContainer.classList.add('play-game-board-container');
    const statsBoardContainer= document.createElement('div');
    statsBoardContainer.classList.add('stats-board-container')
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board-container');
    const gameGridContainer = document.createElement('div');
    gameGridContainer.classList.add('game-grid-container')

    body.append(playGameBoardContainer);
    playGameBoardContainer.append(gameBoardContainer);


    return {
      playGameBoardContainer
    }
  }

  return {
    gameBoardArray,
    render,
  }

})()

const statsModule = (() => {

  const render = () => {

  }

  return {
    render,
  }
})()