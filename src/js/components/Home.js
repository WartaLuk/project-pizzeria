/* eslint-disable no-undef */
import { templates, select, classNames } from '../settings.js';
class Home {
    constructor(element) {
      const thisHome = this;
  
      thisHome.render(element);
    }

    render(element) {
      const thisHome = this;
  
      const generatedHTML = templates.home();
  
      thisHome.dom = {};
  
      thisHome.dom.wrapper = element;
  
      thisHome.dom.wrapper.innerHTML = generatedHTML;

      thisHome.pages = document.querySelector(select.containerOf.pages).children;
      thisHome.navLinks = document.querySelectorAll(select.nav.links);
      thisHome.homeLinks = document.querySelectorAll(select.nav.homeLinks);
      console.log(thisHome.homeLinks);
  
      const idFromHash = window.location.hash.replace('#/', '');
  
      let pageMatchingHash = thisHome.pages[0].id;
  
      for (let page of thisHome.pages) {
        if (page.id == idFromHash) {
          pageMatchingHash = page.id;
          break;
        }
      }
  
      thisHome.activatePage(pageMatchingHash);
      for (let link of thisHome.homeLinks) {
        link.addEventListener('click', function (event) {
          const clickedElement = this;
          event.preventDefault();
          const id = clickedElement.getAttribute('href').replace('#', '');
  
          thisHome.activatePage(id);
          window.location.hash = '#/' + id;
        });
      }
    }
    activatePage(pageId) {
      const thisHome = this;
      for (let page of thisHome.pages) {
        page.classList.toggle(classNames.pages.active, page.id == pageId);
      }
      for (let link of thisHome.navLinks) {
        link.classList.toggle(
          classNames.nav.active,
          link.getAttribute('href') == '#' + pageId
        );
      }
    }
}

export default Home;