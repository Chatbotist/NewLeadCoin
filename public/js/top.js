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
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchPlayerRanking();
  });