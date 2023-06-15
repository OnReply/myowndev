import { addClasses, removeClasses, toggleClass } from './DOMHelpers';
import { IFrameHelper } from './IFrameHelper';
import { isExpandedView } from './settingsHelper';

export const bubbleSVG =
  'M237.5,115.85a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm0,0a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2ZM360.71,0H123.63A123.63,123.63,0,0,0,0,123.63V360.71A123.62,123.62,0,0,0,123.63,484.32H360.71A123.62,123.62,0,0,0,484.34,360.71V123.63A123.63,123.63,0,0,0,360.71,0ZM171,111.49V93.93a14,14,0,0,1,14-14.06h54.56V62a14,14,0,1,1,5.22,0v17.9h54.56a14.06,14.06,0,0,1,14,14.06v17.56a22.61,22.61,0,0,1,0,44.87v17.58a14.06,14.06,0,0,1-14,14.06H285a2.61,2.61,0,0,1,0-5.22h14.33a8.83,8.83,0,0,0,8.8-8.84v-80a8.84,8.84,0,0,0-8.8-8.85H185a8.85,8.85,0,0,0-8.83,8.85v80a8.84,8.84,0,0,0,8.83,8.84H215a2.61,2.61,0,1,1,0,5.22H185a14,14,0,0,1-14-14.06V156.36a22.61,22.61,0,0,1,0-44.87Zm59.61,73.9a2.61,2.61,0,0,1,2.61-2.61h7.59a2.61,2.61,0,0,1,0,5.22H233.2A2.61,2.61,0,0,1,230.59,185.39Zm.46,53.44a28.27,28.27,0,0,1-26.13,21.82A31.07,31.07,0,0,1,187,256.87a27.11,27.11,0,0,1-14.29-27.22,31.31,31.31,0,0,1,5.38-15.08,26.2,26.2,0,0,1,12-9.57,32.33,32.33,0,0,1,16.18-1.9,29.24,29.24,0,0,1,15,6.07,28.46,28.46,0,0,1,9,12.93A29.11,29.11,0,0,1,231.05,238.83Zm-8.43-74.69a2.61,2.61,0,0,1,0-5.22h39.09a2.61,2.61,0,0,1,0,5.22ZM211.8,133.08A12.25,12.25,0,1,1,224,120.83,12.26,12.26,0,0,1,211.8,133.08Zm48.47-12.25a12.26,12.26,0,1,1,12.27,12.25A12.26,12.26,0,0,1,260.27,120.83Zm9.1,64.56a2.61,2.61,0,0,1-2.61,2.61H259a2.61,2.61,0,0,1,0-5.22h7.74A2.61,2.61,0,0,1,269.37,185.39Zm-16.79,44.26A31.21,31.21,0,0,1,258,214.57,26.23,26.23,0,0,1,270,205a32.41,32.41,0,0,1,16.19-1.9,29.14,29.14,0,0,1,14.95,6.07,28.67,28.67,0,0,1,9,12.93,29.45,29.45,0,0,1,.79,16.73,28.21,28.21,0,0,1-26.14,21.82,31.09,31.09,0,0,1-17.91-3.78,27.16,27.16,0,0,1-14.29-27.22Zm156,104.65a53.74,53.74,0,0,1-47.14,50.58v65.29L277.42,385.3h-148a53.77,53.77,0,0,1-53.76-53.75V202.83h55.86V313.36a18.2,18.2,0,0,0,18.19,18.19H337.39a18.2,18.2,0,0,0,18.19-18.19V202.83h53V331.55h.08C408.7,332.47,408.68,333.4,408.62,334.3Zm-129-213.47a7.07,7.07,0,0,0-7-7v0a7,7,0,1,0,7,7ZM251,48.18A8.82,8.82,0,1,0,242.17,57,8.82,8.82,0,0,0,251,48.18Zm-39.19,65.6v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm0,0v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Zm65.7,2.07a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm0,0a7,7,0,0,0-5-2.07v0a7,7,0,1,0,5,2Zm-65.7-2.07v0a7,7,0,1,0,7,7v0A7,7,0,0,0,211.8,113.78Z';

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

  const bubblePath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  bubblePath.setAttributeNS(null, 'd', path);
  bubblePath.setAttributeNS(null, 'fill', '#FFFFFF');

  bubbleIcon.appendChild(bubblePath);
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
