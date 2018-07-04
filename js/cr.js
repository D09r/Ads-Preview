/**
* * Hey!! p1ngm3 @d09r
*
* * Ads Preview
* * Version 0.0.7
* * Author: Dinesh Kumar
* * https://www.linkedin.com/in/hack3r
* * Repository: https://github.com/d09r
*
*/

function updateCall(choosenPlatform,item) {
	$(document).ready(function(){
		$('#'+choosenPlatform+item).on('click', function() {
			$('#modal'+item).modal('show');$('#modal'+item).css('display','block');
		});
	});
}

function srcCode(choosenPlatform,choosenPlatformURL,item) {
	$('#srcCodeViewerDiv').append("<div class='modal fade' id='modal"+item+"' tabindex='-1' role='dialog' aria-labelledby='srcCodeViewerLabel"+item+"' aria-hidden='true' style='display: none'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h4 class='modal-title' id='srcCodeViewerLabel"+item+"'>Ad tag for "+choosenPlatform+"&nbsp;"+item+"</h4></div><div class='modal-body'><p><pre data-lllanguage='html' data-llstyle='dark' id='srcCodeViewer"+item+"'></pre></p></div><div class='modal-footer'><button id='dismissModal' type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button></div></div></div></div>");
	
	$.ajax({
		url: choosenPlatformURL + item,
		type: 'GET',
		dataType: 'html'
	}).done(function(html) {
		$('#srcCodeViewer' + item).text(html);
		$('pre#srcCodeViewer' + item).litelighter({
			style: 'dark',
			language: 'html'
		});
		updateCall(choosenPlatform,item);
	});
}

function updateAdBlockStatus(isAdBlock) {
	var isOnline = $('#isOnline');
	if (isAdBlock == 'adBlock') {
		$('#isOnline').css('display','block');
		isOnline.removeClass('online');
		isOnline.addClass('offline');
		isOnline.text("Ad Blocker detected!").css('font-weight','400');
	} else {
		isOnline.removeClass('offline');
		isOnline.addClass('online');
		isOnline.text("Ad Blocker uninstalled!");
		setTimeout(function() {
			$('#isOnline').css('display','none');
		}, 3000);
	}
}
	
function updateOnlineStatus(event) {
	var isOnline = $('#isOnline');
	var condition = navigator.onLine ? "online" : "offline";
	if (condition == 'online') {
		isOnline.removeClass('offline');
		isOnline.addClass('online');
		isOnline.text("Back " + condition.toUpperCase());
		setTimeout(function(){ 
                    $('#isOnline').css('display','none');
                }, 6000);
	} else {
		isOnline.css('display','block');
		isOnline.removeClass('online');
		isOnline.addClass('offline');
		isOnline.text(condition.toUpperCase() + "! There is no Internet connection");
	}
	console.log(condition);
}

$(document).ready(function() {
	var isOnline = $('#isOnline');
	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
	
	var platforms = {};
	var adPreview = {};
	
	chrome.storage.sync.get(null, function(i) {
		if (jQuery.isEmptyObject(i) == true) {
			console.log(jQuery.isEmptyObject(i));
			$('#platform input').attr("disabled", "disabled");
			$('#inputsCr').attr("disabled", "disabled");
			$('#loadCr').attr("disabled", "disabled");
		} else {
			$('#platform').empty();
		}
            for (key in i) {
				if (key.length > 0) {					
					var bag = [];
					for (p in i[key]) {
						bag.push(i[key][p]);
					}
					if (!/^(f|ht)tps?:\/\//i.test(bag[1])) {
						$('#platform').append("<div class='radio'><label><input type='radio' name='platforms' value='"+bag[0]+"' data-id='"+bag[1]+"' checked> "+bag[1]+"</label></div>");
					   } else {
						   $('#platform').append("<div class='radio'><label><input type='radio' name='platforms' value='"+bag[1]+"' data-id='"+bag[0]+"' checked> "+bag[0]+"</label></div>");
					}
				}
			}
		
        });
	
	var platformName = $('#adPrevPlatName').val().toUpperCase();
	var platformLink = $('#adPrevPlatLink').val();
	
	if ((platformName || platformLink) == "") {
		$('#adPrevLink').attr("disabled", "disabled");
	} 
	
	$('#adPrevPlatLink').on('keyup', function() {
		if ((platformName || platformLink) == "") {
			$('#adPrevLink').attr("disabled", "disabled");
		}
		$('#adPrevLink').removeAttr("disabled");
	});
	
	$('#adPrevLink').click(function() {
		var platformName = $('#adPrevPlatName').val().toUpperCase();
		var platformLink = $('#adPrevPlatLink').val();
		platforms.platformName = platformName;
		platforms.platformLink = platformLink;
		adPreview[platforms.platformName] = platforms;
		
		chrome.storage.sync.set(adPreview, function () {
			$('#modalAddPlatform')
			$('#modalAddPlatform').modal('show');
		});
	});
	
	$('#inputsCr').focusin(function() {
		$('#totalCr').empty();
	});
		$('#loadCr').click(function() {
			if ($('#inputsCr').val() == "") {
				alert("Please enter the Ads (Creatives) IDs and try again!");
				throw new Error();
			}
//			setTimeout(function() {
//				$('#isOnline').css('display','none');
//			}, 16000);
			
		var choosenPlatform, choosenPlatformURL;
		choosenPlatformURL = $("input[name='platforms']:checked").val();
		choosenPlatform = $("input[name='platforms']:checked").attr("data-id");
		console.log("choosenPlatform: " + choosenPlatform + ";" + choosenPlatformURL);
		var lines = $('#inputsCr').val().split('\n');
		console.log(lines);
		var nlines = lines.length;
		var crRow = nlines/3;
		crRow = Math.ceil(crRow);
		console.log("crRow: " + crRow);
		$('#billboard').empty();
		$('#billboard').append("<table class='table' id='crTable' style='background-color: #f5f5f5'></table>");
		var i = 0, n = 3;
		var table = $("#crTable");
		for (j = 0; j < crRow; j++) {
			var valueToBeAppended = '<tr>';
			for(i; i < n; i++) {
				if (i==-1) {
					console.log("Invalid input!");
				} else {
					var item = lines[i];
					if (item != undefined) {
						var frameSrc = choosenPlatformURL + item;
//						console.log(frameSrc, choosenPlatform);
						
						valueToBeAppended += "<td><a href='" + frameSrc + "' target='_blank'>"+ choosenPlatform + "&nbsp;" + item + "&nbsp;<img src='icons/link-external.svg' class='svg_code' /></a>&nbsp;<span id='cc"+item+"' title='Trace Ad HTTP request & response' disabled style='cursor:not-allowed'><img src='icons/search.svg' class='svg_code' /></span>&nbsp;<i id='"+choosenPlatform+item+"' title='View Ad tag for "+ item + "'><img src='icons/file-code.svg' class='svg_code' /></i><br><iframe src='" + frameSrc + "' id='iframe"+item+"' ></iframe></td>";
						srcCode(choosenPlatform,choosenPlatformURL,item);
					}
				}
			}
			n = n+3;
			valueToBeAppended += '</tr>';
			table.append(valueToBeAppended);
		}
		$("#billboard").append(table);
		$('#totalCr').empty();
		$('#totalCr').append("<h5 class='card-title'>Total creatives: " + lines.length+"</h5>");
	});
	
	if (isCrWinClose) {
		console.log("Adblocker detected!");
		updateAdBlockStatus('adBlock');
	} else {
//		updateAdBlockStatus('noAdBlock');
		
//		$.ajax({url: "/js/ads.js", type: 'GET'});
	}
		
	document.addEventListener('contextmenu', event => event.preventDefault());
});