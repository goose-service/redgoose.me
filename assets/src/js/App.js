import Index from './Index';
import Mobile from './Mobile';
import View from './View';


// init Class
window.Mobile = Mobile;
window.Index = Index;
window.View = View;


// init mobile
let mobile = new Mobile();
mobile.init();