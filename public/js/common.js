function setActiveButton(buttonId) {
    document.querySelectorAll('.menu button').forEach(button => {
      button.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    setActiveButton(`${page}Button`);
  });