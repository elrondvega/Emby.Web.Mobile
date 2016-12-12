define(["dom","scroller","browser","registerElement","css!./emby-tabs","scrollStyles"],function(dom,scroller,browser){"use strict";function getBoundingClientRect(elem){return elem.getBoundingClientRect?elem.getBoundingClientRect():{top:0,left:0}}function animtateSelectionBar(bar,start,pos,duration,onFinish){var endTransform=pos?"translateX("+Math.round(pos)+"px)":"none",startTransform=start?"translateX("+Math.round(start)+"px)":"none";if(!duration||!bar.animate)return bar.style.transform=endTransform,void(onFinish&&onFinish());bar.style.transform=startTransform;var keyframes=[{transform:"translateX("+start+"px)",offset:0},{transform:endTransform,offset:1}];bar.animate(keyframes,{duration:duration,iterations:1,easing:"linear",fill:"forwards"}),setTimeout(onFinish,duration)}function moveSelectionBar(tabs,newButton,oldButton,animate){var selectionBar=tabs.selectionBar;selectionBar&&(selectionBar.style.width=newButton.offsetWidth+"px",selectionBar.classList.remove("hide"));var tabsOffset=getBoundingClientRect(tabs),startOffset=tabs.currentOffset||0;oldButton&&(startOffset=tabs.scroller?tabs.scroller.getCenterPosition(oldButton):getBoundingClientRect(oldButton).left-tabsOffset.left);var endPosition;if(tabs.scroller)endPosition=tabs.scroller.getCenterPosition(newButton);else{var tabButtonOffset=getBoundingClientRect(newButton);endPosition=tabButtonOffset.left-tabsOffset.left}var delay=animate?100:0;tabs.currentOffset=endPosition;var onAnimationFinish=function(){newButton.classList.add(activeButtonClass),selectionBar&&selectionBar.classList.add("hide")};selectionBar?animtateSelectionBar(selectionBar,startOffset,endPosition,delay,onAnimationFinish):onAnimationFinish()}function onClick(e){var tabs=this,current=tabs.querySelector("."+activeButtonClass),tabButton=dom.parentWithClass(e.target,buttonClass);if(tabButton&&tabButton!==current){current&&current.classList.remove(activeButtonClass);var previousIndex=current?parseInt(current.getAttribute("data-index")):null;moveSelectionBar(tabs,tabButton,current,!0);var index=parseInt(tabButton.getAttribute("data-index"));tabs.dispatchEvent(new CustomEvent("beforetabchange",{detail:{selectedTabIndex:index,previousIndex:previousIndex}})),setTimeout(function(){tabs.selectedTabIndex=index,tabs.dispatchEvent(new CustomEvent("tabchange",{detail:{selectedTabIndex:index,previousIndex:previousIndex}}))},120),tabs.scroller&&tabs.scroller.toCenter(tabButton,!1)}}function initScroller(tabs){if(!tabs.scroller){var contentScrollSlider=tabs.querySelector(".emby-tabs-slider");contentScrollSlider?(tabs.scroller=new scroller(tabs,{horizontal:1,itemNav:0,mouseDragging:1,touchDragging:1,slidee:contentScrollSlider,smart:!0,releaseSwing:!0,scrollBy:200,speed:120,elasticBounds:1,dragHandle:1,dynamicHandle:1,clickBar:1,hiddenScroll:!0,requireAnimation:!browser.safari}),tabs.scroller.init()):tabs.classList.add("hiddenScrollX")}}function initSelectionBar(tabs){if(browser.animate){var contentScrollSlider=tabs.querySelector(".emby-tabs-slider");if(contentScrollSlider&&"false"!==tabs.getAttribute("data-selectionbar")){var elem=document.createElement("div");elem.classList.add("emby-tabs-selection-bar"),contentScrollSlider.appendChild(elem),tabs.selectionBar=elem}}}var EmbyTabs=Object.create(HTMLDivElement.prototype),buttonClass="emby-tab-button",activeButtonClass=buttonClass+"-active";EmbyTabs.createdCallback=function(){this.classList.contains("emby-tabs")||(this.classList.add("emby-tabs"),dom.addEventListener(this,"click",onClick,{passive:!0}),initSelectionBar(this))},EmbyTabs.refresh=function(){this.scroller&&this.scroller.reload()},EmbyTabs.attachedCallback=function(){initScroller(this);var current=this.querySelector("."+activeButtonClass),currentIndex=current?parseInt(current.getAttribute("data-index")):0,newTabButton=this.querySelectorAll("."+buttonClass)[currentIndex];newTabButton&&moveSelectionBar(this,newTabButton,current,!1)},EmbyTabs.detachedCallback=function(){this.scroller&&(this.scroller.destroy(),this.scroller=null),dom.removeEventListener(this,"click",onClick,{passive:!0}),this.selectionBar=null},EmbyTabs.selectedIndex=function(selected,triggerEvent){var tabs=this;if(null==selected)return tabs.selectedTabIndex||0;var current=tabs.selectedIndex();tabs.selectedTabIndex=selected;var tabButtons=tabs.querySelectorAll("."+buttonClass);if(current===selected||triggerEvent===!1){tabs.dispatchEvent(new CustomEvent("beforetabchange",{detail:{selectedTabIndex:selected}})),tabs.dispatchEvent(new CustomEvent("tabchange",{detail:{selectedTabIndex:selected}}));var currentTabButton=tabButtons[current];moveSelectionBar(tabs,tabButtons[selected],currentTabButton,!1),current!==selected&&currentTabButton&&currentTabButton.classList.remove(activeButtonClass)}else tabButtons[selected].click()},EmbyTabs.triggerBeforeTabChange=function(selected){var tabs=this;tabs.dispatchEvent(new CustomEvent("beforetabchange",{detail:{selectedTabIndex:tabs.selectedIndex()}}))},EmbyTabs.triggerTabChange=function(selected){var tabs=this;tabs.dispatchEvent(new CustomEvent("tabchange",{detail:{selectedTabIndex:tabs.selectedIndex()}}))},document.registerElement("emby-tabs",{prototype:EmbyTabs,extends:"div"})});