document.addEventListener('DOMContentLoaded', () => new App());
class App {
   constructor() {
      this.menu_control = false;
      this.nav_bar = document.querySelectorAll(".nav-tabs");
      this.menu_bar = document.querySelector(".menu-bars");
      this.theme = document.querySelector("#theme-toggler");
      this.skills = document.getElementById("skills");
      this.height = window.innerHeight;
      this.styles = [];
      this.download = document.querySelector('#download_cv');

      this.modal = document.querySelector('#modal');
      this.modal_open = document.querySelectorAll('.interests');
      this.modal_close = document.querySelector('#modal');

      this.run();
   }

   run() {
      this.events();
      this.bars();
   }

   dynamic_menu() {
      if (this.menu_control) {
         document.getElementById("nav").classList = "";
         this.menu_control = false;
      } else {
         document.getElementById("nav").classList = "responsive";
         this.menu_control = true;
      }
   }

   select_menu(e) {
      e.classList = "";
      this.menu_control = false;
   }

   theme_toggler(e) {
      $(e).toggleClass('fa-sun');
      $('body').toggleClass('dark-theme');
   }

   events() {
      this.menu_bar.addEventListener('click', () => this.dynamic_menu());
      this.nav_bar.forEach(navTab => {
         navTab.addEventListener('click', e => this.select_menu(e.target));
      });
      this.theme.addEventListener('click', e => this.theme_toggler(e.target));
      window.addEventListener('scroll', () => this.bars());
      this.download.addEventListener('click', () => window.open('src/docs/Curriculum.pdf', '_blank'));

      $('a.nav-tabs').on('click', e => {
         e.preventDefault();
         $('html, body').animate({
            scrollTop: $($(e.target).attr('href')).offset().top,
         }, 500, 'linear');
      });


      this.modal_open.forEach(modal => {
         modal.addEventListener('click', e => this.modal_content(e.target));
      });
      this.modal_close.addEventListener('click', () => this.modal.style.display = 'none');
      window.addEventListener('click', event => event.target === modal ? this.style.display = 'none' : null);
   }

   bars() {
      const distancia_skills = this.height - this.skills.getBoundingClientRect().top;
      if (distancia_skills >= 300 && distancia_skills <= 1400) {
         fetch('src/script/json/progress.json')
            .then(response => response.json())
            .then(data => {
               for (const category in data) {
                  document.querySelectorAll('.skill').forEach(skill => {
                     const category = skill.getAttribute('data-category');
                     if (data.hasOwnProperty(category)) {
                        const percent = data[category].percent;
                        const animationDuration = data[category].animationDuration;
                        const style = document.createElement('style');
                        style.textContent = `
                        .skills .skill[data-category="${category}"] .progress {
                           width: 0%; animation: ${animationDuration}s ${category} forwards;
                        }
                        @keyframes ${category} {
                           0% {  width: 0%; } 100% { width: ${percent}%; }
                        }`;
                        document.head.appendChild(style);
                        this.styles.push(style);
                        const progressValue = skill.querySelector('.progress span');
                        if (!isNaN(percent) && percent >= 0 && percent <= 100) {
                           progressValue.textContent = percent + '%';
                        }
                     }
                  });
               }

            }).catch(error => console.error('Erro ao carregar o arquivo JSON:', error));

      } else {
         this.styles.forEach(style => style.parentNode ? style.parentNode.removeChild(style) : null);
         this.styles.length = 0;
      }
   }

   modal_content(e) {
      this.modal.style.display = 'block';
      const category = e.dataset.category;
      switch (category) {
         case 'twitch':

            document.querySelector('#content').innerHTML = `
            <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/67DosyY9MtTA2TJ0jpVFKH?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            `
            break;

         default:
            break;
      }
   }

}