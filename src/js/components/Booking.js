import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element) {
    const thisBooking = this;
    
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = element;

    element.innerHTML = generatedHTML;

    thisBooking.dom = {
      peopleAmount: element.querySelector(select.booking.peopleAmount),
      hoursAmount: element.querySelector(select.booking.hoursAmount),
      datePicker: element.querySelector(select.widgets.datePicker.wrapper),
      hourPicker: element.querySelector(select.widgets.hourPicker.wrapper),
    };
  }
  initWidgets() {
    const thisBooking = this;
    console.log( thisBooking.peopleAmountWidget,  thisBooking.dom.hoursAmount);
    thisBooking.peopleAmountWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
      );

    thisBooking.hoursAmountWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
      );

    thisBooking.datePickerWidget = new DatePicker(
      thisBooking.dom.dataPicker
      );

    thisBooking.hourPicker = new HourPicker(
      thisBooking.dom.hourPicker
      );

    thisBooking.dom.peopleAmount.addEventListener('updated', function () {});

    thisBooking.dom.hoursAmount.addEventListener('updated', function () {});
    
    thisBooking.dom.dataPicker.addEventListener('updated', function () {});

    thisBooking.dom.hourPicker.addEventListener('updated', function () {});

  }
}

export default Booking;