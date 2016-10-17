define(["browser"],function(browser){"use strict";function canPlayH264(){var v=document.createElement("video");return!(!v.canPlayType||!v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,""))}function canPlayH265(){return!!browser.tizen}function supportsTextTracks(){return null==_supportsTextTracks&&(_supportsTextTracks=null!=document.createElement("video").textTracks),_supportsTextTracks}function canPlayHls(src){return null==_canPlayHls&&(_canPlayHls=canPlayNativeHls()||canPlayHlsWithMSE()),_canPlayHls}function canPlayNativeHls(){var media=document.createElement("video");return!(!media.canPlayType("application/x-mpegURL").replace(/no/,"")&&!media.canPlayType("application/vnd.apple.mpegURL").replace(/no/,""))}function canPlayHlsWithMSE(){return null!=window.MediaSource}function canPlayAudioFormat(format){var typeString;if("flac"===format){if(browser.tizen)return!0;if(browser.edgeUwp)return!0}else if("wma"===format){if(browser.tizen)return!0;if(browser.edgeUwp)return!0}else if("opus"===format)return typeString='audio/ogg; codecs="opus"',!!document.createElement("audio").canPlayType(typeString).replace(/no/,"");return typeString="webma"===format?"audio/webm":"audio/"+format,!!document.createElement("audio").canPlayType(typeString).replace(/no/,"")}function testCanPlayMkv(videoTestElement){if(videoTestElement.canPlayType("video/x-matroska")||videoTestElement.canPlayType("video/mkv"))return!0;var userAgent=navigator.userAgent.toLowerCase();return browser.chrome?!browser.operaTv&&(userAgent.indexOf("vivaldi")===-1&&userAgent.indexOf("opera")===-1):!!browser.tizen||!!browser.edgeUwp}function testCanPlayTs(){return browser.tizen||browser.web0s||browser.edgeUwp}function getDirectPlayProfileForVideoContainer(container,videoAudioCodecs){var supported=!1,profileContainer=container,videoCodecs=[];switch(container){case"asf":supported=browser.tizen||browser.edgeUwp,videoAudioCodecs=[];break;case"avi":supported=browser.tizen||browser.edgeUwp;break;case"mpg":case"mpeg":supported=browser.edgeUwp;break;case"3gp":case"flv":case"mts":case"trp":case"vob":case"vro":supported=browser.tizen;break;case"mov":supported=browser.chrome||browser.edgeUwp,videoCodecs.push("h264");break;case"m2ts":supported=browser.tizen||browser.web0s||browser.edgeUwp,videoCodecs.push("h264");break;case"wmv":supported=browser.tizen||browser.web0s||browser.edgeUwp,videoAudioCodecs=[];break;case"ts":supported=testCanPlayTs(),videoCodecs.push("h264"),profileContainer="ts,mpegts"}return supported?{Container:profileContainer,Type:"Video",VideoCodec:videoCodecs.join(","),AudioCodec:videoAudioCodecs.join(",")}:null}function getMaxBitrate(){if(browser.edgeUwp)return 3e7;if(browser.xboxOne)return 1e7;if(browser.ps4)return 8e6;var userAgent=navigator.userAgent.toLowerCase();return browser.tizen?userAgent.indexOf("tizen 2.3")!==-1?2e7:4e7:1e8}var _supportsTextTracks,_canPlayHls;return function(options){options=options||{};var physicalAudioChannels=options.audioChannels||2,bitrateSetting=getMaxBitrate(),videoTestElement=document.createElement("video"),canPlayWebm=videoTestElement.canPlayType("video/webm").replace(/no/,""),canPlayMkv=testCanPlayMkv(videoTestElement),profile={};profile.MaxStreamingBitrate=bitrateSetting,profile.MaxStaticBitrate=1e8,profile.MusicStreamingTranscodingBitrate=Math.min(bitrateSetting,192e3),profile.DirectPlayProfiles=[];var videoAudioCodecs=[],hlsVideoAudioCodecs=[],supportsMp3VideoAudio=videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.69"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.6B"').replace(/no/,"");(videoTestElement.canPlayType('audio/mp4; codecs="ac-3"').replace(/no/,"")&&!browser.safari||browser.edgeUwp||browser.tizen)&&(options.disableVideoAudioCodecs||[]).indexOf("ac3")==-1&&(videoAudioCodecs.push("ac3"),browser.edge&&browser.touch||hlsVideoAudioCodecs.push("ac3"));var mp3Added=!1;canPlayMkv&&supportsMp3VideoAudio&&(mp3Added=!0,videoAudioCodecs.push("mp3")),videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"').replace(/no/,"")&&(videoAudioCodecs.push("aac"),hlsVideoAudioCodecs.push("aac")),supportsMp3VideoAudio&&(mp3Added||videoAudioCodecs.push("mp3"),hlsVideoAudioCodecs.push("mp3")),browser.tizen&&(videoAudioCodecs.push("dca"),videoAudioCodecs.push("dts")),browser.edgeUwp;var mp4VideoCodecs=[];canPlayH264()&&mp4VideoCodecs.push("h264"),canPlayH265()&&(mp4VideoCodecs.push("h265"),mp4VideoCodecs.push("hevc")),mp4VideoCodecs.length&&profile.DirectPlayProfiles.push({Container:"mp4,m4v",Type:"Video",VideoCodec:mp4VideoCodecs.join(","),AudioCodec:videoAudioCodecs.join(",")}),canPlayMkv&&mp4VideoCodecs.length&&(profile.DirectPlayProfiles.push({Container:"mkv",Type:"Video",VideoCodec:mp4VideoCodecs.join(","),AudioCodec:videoAudioCodecs.join(",")}),browser.edgeUwp&&profile.DirectPlayProfiles.push({Container:"mkv",Type:"Video",VideoCodec:"vc1",AudioCodec:videoAudioCodecs.join(",")})),["m2ts","mov","wmv","ts","asf","avi","mpg","mpeg"].map(function(container){return getDirectPlayProfileForVideoContainer(container,videoAudioCodecs)}).filter(function(i){return null!=i}).forEach(function(i){profile.DirectPlayProfiles.push(i)}),["opus","mp3","aac","flac","webma","wma","wav"].filter(canPlayAudioFormat).forEach(function(audioFormat){profile.DirectPlayProfiles.push({Container:"webma"===audioFormat?"webma,webm":audioFormat,Type:"Audio"}),"aac"===audioFormat&&profile.DirectPlayProfiles.push({Container:"m4a",AudioCodec:audioFormat,Type:"Audio"})}),canPlayWebm&&profile.DirectPlayProfiles.push({Container:"webm",Type:"Video"}),profile.TranscodingProfiles=[],["opus","mp3","aac"].filter(canPlayAudioFormat).forEach(function(audioFormat){profile.TranscodingProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat,Context:"Streaming",Protocol:"http"}),profile.TranscodingProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat,Context:"Static",Protocol:"http"})});var copyTimestamps=!1;browser.chrome&&(copyTimestamps=!0),canPlayMkv&&options.supportsCustomSeeking&&!browser.tizen&&options.enableMkvProgressive!==!1&&profile.TranscodingProfiles.push({Container:"mkv",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Streaming",CopyTimestamps:copyTimestamps}),canPlayHls()&&options.enableHls!==!1&&profile.TranscodingProfiles.push({Container:"ts",Type:"Video",AudioCodec:hlsVideoAudioCodecs.join(","),VideoCodec:"h264",Context:"Streaming",Protocol:"hls",MaxAudioChannels:physicalAudioChannels.toString(),EnableSplittingOnNonKeyFrames:!!browser.safari}),browser.firefox&&profile.TranscodingProfiles.push({Container:"mp4",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Streaming",Protocol:"http"}),canPlayWebm&&profile.TranscodingProfiles.push({Container:"webm",Type:"Video",AudioCodec:"vorbis",VideoCodec:"vpx",Context:"Streaming",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()}),profile.TranscodingProfiles.push({Container:"mp4",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Streaming",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()}),profile.TranscodingProfiles.push({Container:"mp4",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Static",Protocol:"http"}),profile.ContainerProfiles=[],profile.CodecProfiles=[],profile.CodecProfiles.push({Type:"Audio",Conditions:[{Condition:"LessThanEqual",Property:"AudioChannels",Value:"2"}]});var videoAudioChannels=browser.tizen?"8":"6";videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.5"').replace(/no/,"")||profile.CodecProfiles.push({Type:"VideoAudio",Codec:"aac",Conditions:[{Condition:"NotEquals",Property:"AudioProfile",Value:"HE-AAC"},{Condition:"LessThanEqual",Property:"AudioChannels",Value:videoAudioChannels},{Condition:"LessThanEqual",Property:"AudioBitrate",Value:"128000"},{Condition:"Equals",Property:"IsSecondaryAudio",Value:"false",IsRequired:"false"}]}),profile.CodecProfiles.push({Type:"VideoAudio",Conditions:[{Condition:"LessThanEqual",Property:"AudioChannels",Value:videoAudioChannels},{Condition:"Equals",Property:"IsSecondaryAudio",Value:"false",IsRequired:"false"}]});var maxLevel="41";return browser.chrome&&!browser.mobile&&(maxLevel="51"),profile.CodecProfiles.push({Type:"Video",Codec:"h264",Conditions:[{Condition:"NotEquals",Property:"IsAnamorphic",Value:"true",IsRequired:!1},{Condition:"EqualsAny",Property:"VideoProfile",Value:"high|main|baseline|constrained baseline"},{Condition:"LessThanEqual",Property:"VideoLevel",Value:maxLevel}]}),browser.edgeUwp||browser.tizen||browser.web0s||profile.CodecProfiles[profile.CodecProfiles.length-1].Conditions.push({Condition:"NotEquals",Property:"IsAVC",Value:"false",IsRequired:!1}),profile.CodecProfiles.push({Type:"Video",Codec:"vpx",Conditions:[{Condition:"NotEquals",Property:"IsAnamorphic",Value:"true",IsRequired:!1}]}),profile.SubtitleProfiles=[],supportsTextTracks()&&profile.SubtitleProfiles.push({Format:"vtt",Method:"External"}),profile.ResponseProfiles=[],profile.ResponseProfiles.push({Type:"Video",Container:"m4v",MimeType:"video/mp4"}),browser.chrome&&profile.ResponseProfiles.push({Type:"Video",Container:"mov",MimeType:"video/webm"}),profile}});