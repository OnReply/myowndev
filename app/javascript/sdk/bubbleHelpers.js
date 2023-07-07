import { addClasses, removeClasses, toggleClass } from './DOMHelpers';
import { IFrameHelper } from './IFrameHelper';
import { isExpandedView } from './settingsHelper';

export const bubbleSVG = [
  "M145.59,175a29,29,0,0,0-15-6.07,32.43,32.43,0,0,0-16.17,1.89,26.13,26.13,0,0,0-12,9.57,31.12,31.12,0,0,0-5.39,15.09,27.21,27.21,0,0,0,14.28,27.22,31.28,31.28,0,0,0,17.92,3.78,28.31,28.31,0,0,0,26.15-21.84,29.38,29.38,0,0,0-.81-16.71A28.57,28.57,0,0,0,145.59,175Z",
  "M191.23,222.73a31.3,31.3,0,0,0,17.93,3.78,28.31,28.31,0,0,0,26.14-21.84,29.21,29.21,0,0,0-.81-16.71,28.57,28.57,0,0,0-9-12.93,28.93,28.93,0,0,0-15-6.07,32.43,32.43,0,0,0-16.17,1.89,26.13,26.13,0,0,0-12,9.57A31.12,31.12,0,0,0,177,195.51a27.21,27.21,0,0,0,14.28,27.22Z",
  "M333,297.39V168.68H280V279.21a18.18,18.18,0,0,1-18.19,18.18H74a18.18,18.18,0,0,1-18.18-18.18V168.68H0V297.39a53.77,53.77,0,0,0,53.77,53.77h148L285.85,416v-65.3A53.75,53.75,0,0,0,333,300.15c.05-.9.07-1.83.07-2.76Z",
  "M165.15,153.84a2.61,2.61,0,1,0,0-5.21h-7.58a2.61,2.61,0,1,0,0,5.21Z",
  "M183.4,148.63a2.61,2.61,0,1,0,0,5.21h7.73a2.61,2.61,0,1,0,0-5.21Z",
  "M95.34,122.21V139.8a14,14,0,0,0,14,14h30a2.61,2.61,0,1,0,0-5.21h-30a8.83,8.83,0,0,1-8.81-8.83v-80a8.83,8.83,0,0,1,8.81-8.83H223.71a8.83,8.83,0,0,1,8.81,8.83v80a8.83,8.83,0,0,1-8.81,8.83H209.38a2.61,2.61,0,1,0,0,5.21h14.33a14,14,0,0,0,14-14V122.21a22.61,22.61,0,0,0,0-44.86V59.77a14,14,0,0,0-14-14.05H169.14V27.83a14,14,0,1,0-5.21,0V45.72H109.36a14,14,0,0,0-14,14.05V77.35a22.61,22.61,0,0,0,0,44.86Zm142.39-39.6a17.4,17.4,0,0,1,0,34.35Z",
  "M157.71,14a8.83,8.83,0,1,1,8.83,8.82A8.83,8.83,0,0,1,157.71,14Z",
  "M95.34,82.61V117a17.4,17.4,0,0,1,0-34.35Z",
  "M209.15,86.69A12.25,12.25,0,1,0,196.9,98.93,12.24,12.24,0,0,0,209.15,86.69Zm-19.28,0a7,7,0,0,1,7-7h0a7,7,0,1,1-7,7Z",
  "M136.17,74.44a12.25,12.25,0,1,0,12.25,12.25A12.24,12.24,0,0,0,136.17,74.44Zm0,19.28a7,7,0,1,1,0-14.07h0a7,7,0,0,1,0,14.08Z",
  "M188.69,127.38a2.61,2.61,0,0,0-2.61-2.61H147a2.61,2.61,0,0,0,0,5.22h39.08A2.61,2.61,0,0,0,188.69,127.38Z"
];
export const body = document.getElementsByTagName('body')[0];
export const widgetHolder = document.createElement('div');

export const bubbleHolder = document.createElement('div');
export const chatBubble = document.createElement('button');
export const closeBubble = document.createElement('button');
export const notificationBubble = document.createElement('span');

export const setBubbleText = bubbleText => {
  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.getElementById('woot-widget--expanded__text');
    textNode.innerText = bubbleText;
  }
};

export const createBubbleIcon = ({ className, path, target }) => {
  let bubbleClassName = `${className} woot-elements--${window.$chatwoot.position}`;
  const bubbleIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  bubbleIcon.setAttributeNS(null, 'id', 'woot-widget-bubble-icon');
  bubbleIcon.setAttributeNS(null, 'width', '24');
  bubbleIcon.setAttributeNS(null, 'height', '24');
  bubbleIcon.setAttributeNS(null, 'viewBox', '0 0 450 450');
  bubbleIcon.setAttributeNS(null, 'fill', 'none');
  bubbleIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 333.07 416.03");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs);

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = ".cls-1{fill:#fff;}";
  defs.appendChild(style);

  const g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g1.setAttribute("id", "Layer_2");
  g1.setAttribute("data-name", "Layer 2");
  svg.appendChild(g1);

  const g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g2.setAttribute("id", "Layer_1-2");
  g2.setAttribute("data-name", "Layer 1");
  g1.appendChild(g2);

  for (const pathData of path) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "cls-1");
    path.setAttribute("d", pathData);
    g2.appendChild(path);
  }

  
  bubbleIcon.appendChild(svg);
  target.appendChild(bubbleIcon);

  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.createElement('div');
    textNode.id = 'woot-widget--expanded__text';
    textNode.innerText = '';
    target.appendChild(textNode);
    bubbleClassName += ' woot-widget--expanded';
  }

  target.className = bubbleClassName;
  target.title = 'Open chat window';
  return target;
};

export const createBubbleHolder = hideMessageBubble => {
  if (hideMessageBubble) {
    addClasses(bubbleHolder, 'woot-hidden');
  }
  addClasses(bubbleHolder, 'woot--bubble-holder');
  body.appendChild(bubbleHolder);
};

export const createNotificationBubble = () => {
  addClasses(notificationBubble, 'woot--notification');
  return notificationBubble;
};

export const onBubbleClick = (props = {}) => {
  const { toggleValue } = props;
  const { isOpen } = window.$chatwoot;
  if (isOpen !== toggleValue) {
    const newIsOpen = toggleValue === undefined ? !isOpen : toggleValue;
    window.$chatwoot.isOpen = newIsOpen;

    toggleClass(chatBubble, 'woot--hide');
    toggleClass(closeBubble, 'woot--hide');
    toggleClass(widgetHolder, 'woot--hide');
    IFrameHelper.events.onBubbleToggle(newIsOpen);

    if (!newIsOpen) {
      chatBubble.focus();
    }
  }
};

export const onClickChatBubble = () => {
  bubbleHolder.addEventListener('click', onBubbleClick);
};

export const addUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  addClasses(holderEl, 'has-unread-view');
};

export const removeUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  removeClasses(holderEl, 'has-unread-view');
};
