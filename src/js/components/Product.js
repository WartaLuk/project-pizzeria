import { select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);


    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

  

    const menuContainer = document.querySelector(select.containerOf.menu);

  
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(
      select.menuProduct.clickable
    );
    thisProduct.form = thisProduct.element.querySelector(
      select.menuProduct.form
    );

    thisProduct.formInputs = thisProduct.form.querySelectorAll(
      select.all.formInputs
    );

    thisProduct.cartButton = thisProduct.element.querySelector(
      select.menuProduct.cartButton
    );
    thisProduct.priceElem = thisProduct.element.querySelector(
      select.menuProduct.priceElem
    );
    thisProduct.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    );
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    );
  }

  initAccordion() {
    const thisProduct = this;

 
    thisProduct.accordionTrigger.addEventListener('click', function (event) {
   
      event.preventDefault();

  
      const activeProduct = document.querySelector(
        select.all.menuProductsActive
      );
  

      if (activeProduct != null && activeProduct != thisProduct.element) {
        activeProduct.classList.remove('active');
     
      }

      
      thisProduct.element.classList.toggle('active');
     
    });
  }
  initOrderForm() {
    const thisProduct = this;
 

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;
  

    const formData = utils.serializeFormToObject(thisProduct.form);
   
    let price = thisProduct.data.price;

    for (let paramId in thisProduct.data.params) {
      
      const param = thisProduct.data.params[paramId];
    
      for (let optionId in param.options) {
       
        const option = param.options[optionId];
       
        const categoryOptionSelector = '.' + paramId + '-' + optionId;
      
        let correctImage = thisProduct.imageWrapper.querySelector(categoryOptionSelector);
      
        const optionSelected = formData[paramId].includes(optionId);
   
        if (!option.default && optionSelected) {
   
          price += option.price;
        
        } else if (option.default && !optionSelected) {
          price -= option.price;
      
        }

        if (correctImage != null) {
          if (optionSelected) {
          
            correctImage.classList.add(classNames.menuProduct.imageVisible);
           
          } else {
            correctImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    
    let multiplePrice = price * thisProduct.amountWidget.value;
   
    thisProduct.priceSingle = price;
    thisProduct.multiplePrice = multiplePrice;
    
    thisProduct.priceElem.innerHTML = multiplePrice;
  }
  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;


    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });
    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.multiplePrice,
      params: thisProduct.prepareCartProductParams(),
    };
    return productSummary;
  }

  prepareCartProductParams() {
    const thisProduct = this;
  

    const formData = utils.serializeFormToObject(thisProduct.form);

    const params = {};
   
    for (let paramId in thisProduct.data.params) {
     
      const param = thisProduct.data.params[paramId];
      
      params[paramId] = {
        label: param.label,
        options: {},
      };

     
      for (let optionId in param.options) {
       
        const option = param.options[optionId];
       
        const optionSelected = formData[paramId].includes(optionId);
       
        if (optionSelected) {
          const selectOpt = { [optionId]: option.label };

          Object.assign(params[paramId].options, selectOpt);
        }
      }
    }
    return params;
  }
}

export default Product;