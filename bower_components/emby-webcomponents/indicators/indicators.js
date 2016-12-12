define(["css!./indicators.css","material-icons"],function(){"use strict";function enableProgressIndicator(item){return"Video"===item.MediaType&&"TvChannel"!==item.Type}function getProgressHtml(pct,options){var containerClass="itemProgressBar";return options&&options.containerClass&&(containerClass+=" "+options.containerClass),'<div class="'+containerClass+'"><div class="itemProgressBarForeground" style="width:'+pct+'%;"></div></div>'}function getProgressBarHtml(item,options){if(enableProgressIndicator(item)){if("Recording"===item.Type&&item.CompletionPercentage)return getProgressHtml(item.CompletionPercentage,options);var userData=options?options.userData||item.UserData:item.UserData;if(userData){var pct=userData.PlayedPercentage;if(pct&&pct<100)return getProgressHtml(pct,options)}}return""}function enablePlayedIndicator(item){if("Video"===item.MediaType&&"TvChannel"!==item.Type)return!0;if("Audio"===item.MediaType){if("AudioPodcast"===item.Type)return!0;if("AudioBook"===item.Type)return!0}return"Series"===item.Type||"Season"===item.Type||"BoxSet"===item.Type||"Game"===item.MediaType||"Book"===item.MediaType||"Recording"===item.MediaType}function getPlayedIndicator(item){if(enablePlayedIndicator(item)){var userData=item.UserData||{};if(userData.UnplayedItemCount)return'<div class="countIndicator indicator">'+userData.UnplayedItemCount+"</div>";if(userData.PlayedPercentage&&userData.PlayedPercentage>=100||userData.Played)return'<div class="playedIndicator indicator"><i class="md-icon indicatorIcon">&#xE5CA;</i></div>'}return""}function getCountIndicatorHtml(count){return'<div class="countIndicator indicator">'+count+"</div>"}function getChildCountIndicatorHtml(item,options){var minCount=0;return options&&(minCount=options.minCount||minCount),item.ChildCount&&item.ChildCount>minCount?getCountIndicatorHtml(item.ChildCount):""}function getTimerIndicator(item){var status;if("SeriesTimer"===item.Type)return'<i class="md-icon timerIndicator indicatorIcon">&#xE062;</i>';if(item.TimerId||item.SeriesTimerId)status=item.Status||"Cancelled";else{if("Timer"!==item.Type)return"";status=item.Status}return item.SeriesTimerId?"Cancelled"!==status?'<i class="md-icon timerIndicator indicatorIcon">&#xE062;</i>':'<i class="md-icon timerIndicator timerIndicator-inactive indicatorIcon">&#xE062;</i>':'<i class="md-icon timerIndicator indicatorIcon">&#xE061;</i>'}function getSyncIndicator(item){return 100===item.SyncPercent?'<div class="syncIndicator indicator fullSyncIndicator"><i class="md-icon indicatorIcon">file_download</i></div>':null!=item.SyncPercent?'<div class="syncIndicator indicator emptySyncIndicator"><i class="md-icon indicatorIcon">file_download</i></div>':""}return{getProgressBarHtml:getProgressBarHtml,getPlayedIndicatorHtml:getPlayedIndicator,getChildCountIndicatorHtml:getChildCountIndicatorHtml,enableProgressIndicator:enableProgressIndicator,getTimerIndicator:getTimerIndicator,enablePlayedIndicator:enablePlayedIndicator,getSyncIndicator:getSyncIndicator}});