let balance = 0;
let level = 1;
let pointsToNextLevel = 1000;
let developers = 0;
let telegramId = null;
let userId = null;

function vibrateOnClick() {
  if ("vibrate" in navigator) {
    window.navigator.vibrate(100);
  }
}

function incrementScore(x, y) {
  balance++;
  document.getElementById('balance').textContent = balance;
  showClickAnimation(x, y);
  checkLevelUp();
  updateProgressBar();
}

function showClickAnimation(x, y) {
  const clickText = document.createElement('div');
  clickText.textContent = '+1';
  clickText.className = 'click-animation';
  clickText.style.left = `${x - 18}px`;
  clickText.style.top = `${y - 50}px`;
  document.body.appendChild(clickText);
  setTimeout(() => {
    clickText.remove();
  }, 500);
}

function checkLevelUp() {
  if (developers >= pointsToNextLevel) {
    level++;
    pointsToNextLevel = Math.floor(pointsToNextLevel * 1.5);
    document.getElementById('level').textContent = 'Уровень: ' + level;
    updateProgressBar(true);
  }
}

function updateProgressBar(reset = false) {
  const progress = reset ? 0 : Math.min((developers / pointsToNextLevel) * 100, 100);
  document.getElementById('progress').style.width = progress + '%';
}

function handleTouchStart(event) {
  event.preventDefault();
  const coin = document.getElementById('coin');
  const rect = coin.getBoundingClientRect();
  const touches = event.touches;
  if (touches.length <= 2) {
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        coin.classList.add('active');
      }
    }
  }
}

function handleTouchEnd(event) {
  event.preventDefault();
  const coin = document.getElementById('coin');
  const rect = coin.getBoundingClientRect();
  const changedTouches = event.changedTouches;
  if (changedTouches.length <= 2) {
    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i];
      if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        incrementScore(touch.clientX, touch.clientY);
        vibrateOnClick();
      }
    }
    coin.classList.remove('active');
  }
}

document.getElementById('coin').addEventListener('touchstart', handleTouchStart);
document.getElementById('coin').addEventListener('touchend', handleTouchEnd);

window.addEventListener('load', () => {
  fetchInitialData();
  fetchPlayerRanking();
});

if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.setBackgroundColor("#2E3E54");
  window.Telegram.WebApp.setHeaderColor("#182A42");

  Telegram.WebApp.expand();
  Telegram.WebApp.enableClosingConfirmation();
  const initData = Telegram.WebApp.initDataUnsafe;
  if (initData && initData.user) {
    telegramId = initData.user.id;
    fetchInitialData();
  } else {
    alert("initData.user is undefined");
  }

  Telegram.WebApp.onEvent('viewportChanged', function(event) {
    if (event.isStateStable && !Telegram.WebApp.isExpanded) {
      Telegram.WebApp.expand();
    }
  });
} else {
  alert("Telegram Web App not detected");
}

function fetchInitialData() {
  const url = `/api/getUserDataByTelegramId?telegram_id=${telegramId}`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data && data.data) {
      const user = data.data;
      setInitialData(user.balance, user.level, user.developers, user.id);
    }
  })
  .catch(error => {
    console.error('Ошибка при получении данных пользователя:', error);
  });
}

function setInitialData(initialBalance, initialLevel, initialDevelopers, initialUserId) {
    balance = initialBalance;
    level = initialLevel;
    developers = initialDevelopers;
    userId = initialUserId;
    document.getElementById('balance').textContent = balance;
    document.getElementById('level').textContent = 'Уровень: ' + level;
    document.getElementById('developers').textContent = 'Разработчики: ' + developers;
    updateProgressBar();
    startAutoUpdate();
  }
  
  function startAutoUpdate() {
    setInterval(() => {
      const url = '/api/updateUserData';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          item_id: userId,
          data: {
            balance: balance,
            level: level,
            developers: developers
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('User data updated successfully');
      })
      .catch(error => {
        console.error('Ошибка при обновлении данных пользователя:', error);
      });
    }, 5000); // 5 секунд
  }
  
  function fetchPlayerRanking() {
    const url = '/api/getUserData';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.data) {
        const players = data.data;
        displayRanking(players);
      }
    })
    .catch(error => {
      console.error('Ошибка при получении рейтинга:', error);
    });
  }
  
  function displayRanking(players) {
    const rankingContainer = document.getElementById('ranking');
    rankingContainer.innerHTML = '';
  
    players.sort((a, b) => b.balance - a.balance);
  
    players.slice(0, 100).forEach((player, index) => {
      const rankingItem = document.createElement('div');
      rankingItem.className = 'ranking-item';
  
      const playerInfo = document.createElement('div');
      playerInfo.className = 'info';
  
      const playerName = document.createElement('div');
      playerName.className = 'name';
      playerName.textContent = player.username;
  
      const playerFollowers = document.createElement('div');
      playerFollowers.className = 'followers';
      playerFollowers.textContent = player.balance.toLocaleString();
  
      const playerRank = document.createElement('div');
      playerRank.className = 'rank';
      playerRank.textContent = index + 1;
  
      playerInfo.appendChild(playerName);
      playerInfo.appendChild(playerFollowers);
      rankingItem.appendChild(playerInfo);
      rankingItem.appendChild(playerRank);
  
      rankingContainer.appendChild(rankingItem);
    });
  }