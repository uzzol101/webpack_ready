import './style.scss';
import './style - Copy.scss';
import './css/styles.css';
import './css/bootstrap.css';
import './user.html'


import { foo } from './helper';

let elem = document.getElementById('output');
elem.innerHTML = `Output: ${foo()}`;
