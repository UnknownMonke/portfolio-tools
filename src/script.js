/**
 *
 */
(function() {

  if(sessionStorage.getItem('theme')) {
    if(sessionStorage.getItem('theme') === 'dark') {

      document.documentElement.setAttribute('data-theme', 'dark');

    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

  } else {

    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {

      document.documentElement.setAttribute('data-theme', 'dark');

    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  function setTheme() {
    console.log('init');

    const themeNode = document.getElementById('theme');

    if(sessionStorage.getItem('theme')) {
      const theme = sessionStorage.getItem('theme');

      if(themeNode) {
        if(theme && theme !== 'default') {
          themeNode.href = 'theme-' + theme + '.css';
        } else {
          if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
            themeNode.href = 'theme-dark.css';
          } else {
            themeNode.href = 'theme-light.css';
          }
        }
      }
    } else {

      if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeNode.href = "theme-dark.css";
      } else {
        themeNode.href = "theme-light.css";
      }
    }
  }

  setTheme();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(event) {

    if(sessionStorage.getItem('theme')) {
      if(sessionStorage.getItem('theme') === 'dark') {

        document.documentElement.setAttribute('data-theme', 'dark');

      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }

    } else {

      if(window.matchMedia('(prefers-color-scheme: dark)').matches) {

        document.documentElement.setAttribute('data-theme', 'dark');

      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }

    setTheme();
  });



})();
