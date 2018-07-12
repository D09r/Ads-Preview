/**
* * Hey!! p1ngm3 @d09r
*
* * Ads Preview
* * Version 0.0.8
* * Author: Dinesh Kumar
* * https://www.linkedin.com/in/hack3r
* * Repository: https://github.com/d09r
*
*/

function refresh() {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		chrome.tabs.reload(tabs[0].id);
	});
}

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
//	console.log(condition);
}

function render_input() {
	var el, val, w, h, html, posID, posConf, pos;
	$sf.host.nuke();
	el 	= $sf.lib.dom.elt("html_input");
	val = (el && el.value) || "";
	val = $sf.lib.lang.trim(val);
	if (!val) {
		alert("Ad tag wasn't found on SafeFrame!");
		return;
	}
	html = val;
	el	= $sf.lib.dom.elt("width_input");
	val = (el && el.value) || "";
	val = $sf.lib.lang.cnum(val,0);
	if (val <= 0) {
		alert("Width must be a valid number from 1 to 9999 pixels");
		return;
	}
	w = val;
	el	= $sf.lib.dom.elt("height_input");
				val = (el && el.value) || "";
				val = $sf.lib.lang.cnum(val,0);
	if (val <= 0) {
		alert("Height must be a valid number from 1 to 9999 pixels");
		return;
	}
	h 	= val;
	posID	 = "test_" + w + "x" + h;
	posConf	 = new $sf.host.PosConfig({id:posID,w:w,h:h,dest:"tgtLREC"});
	pos		 = new $sf.host.Position(posID, html);
	$sf.host.render(pos);
}

$(document).ready(function() {
	var plat = [];
	var platformsContainer = {};
	var editPlatformsContainer = {};
//	console.log(editPlatformsContainer);
	var isOnline = $('#isOnline');
	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
	
	var platforms = {};
	var adPreview = {};
	
	chrome.storage.sync.get(null, function(i) {
		if (jQuery.isEmptyObject(i) == true) {
//			console.log(jQuery.isEmptyObject(i));
			$('#platform input').attr("disabled", "disabled");
			$('#inputsCr').attr("disabled", "disabled");
			$('#loadCr').attr("disabled", "disabled");
//			$('#editPlatformBtn').attr("disabled", "disabled");
		} else {
			$('#editPlatformBtn').show();
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
		
		$('#platform input[type=radio][name=platforms]').change(function() {
			$('#inputsCr').val("");
		});
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
			refresh();
		});
//		$('#modalAddPlatform').modal('show');
	});
	
	$('#inputsCr').focusin(function() {
		$('#totalCr').empty();
	});
		$('#loadCr').click(function() {
			if ($('#inputsCr').val() == "") {
//				alert("Please enter the Ads (Creatives) IDs and try again!");
				$('#modalInvalidInput').modal('show');
				throw new Error();
			}
//			setTimeout(function() {
//				$('#isOnline').css('display','none');
//			}, 16000);
			
		var choosenPlatform, choosenPlatformURL;
		choosenPlatformURL = $("input[name='platforms']:checked").val();
		choosenPlatform = $("input[name='platforms']:checked").attr("data-id");
//		console.log("choosenPlatform: " + choosenPlatform + ";" + choosenPlatformURL);
		var lines = $('#inputsCr').val().split('\n');
		console.log(lines);
		var nlines = lines.length;
		var crRow = nlines/3;
		crRow = Math.ceil(crRow);
//		console.log("crRow: " + crRow);
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
					
					// check invalid input
					var isValidInput = /^[a-zA-Z0-9]+$/i.test(item);
					console.log(isValidInput);
					if (isValidInput == false) {
						$('#modalInvalidInput').modal('show');
						throw new Error();
					}
					
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
		$('#totalCr').append("<h5 class='card-title'>Total Ads: " + lines.length+"</h5>");
	});
	
	$('#settingsPlat').click(function() {
		$('#settingsModal .modal-title').text("Add Platform Name & Preview Links");
		var setPlat = $('#settingsModal');
		var isDef = $('#platform input').attr('data-id');
		if (isDef == 'default') {
			$('#settingsModal .modal-title').text();
//			$('#settingsModal .modal-body').append("");
		}
		setPlat.modal('show');
	});
	
	$('#editPlatformBtn').click(function() {
		var editLen = 0;
		$('#editPlatformBtn').text('Save');
		$('#editPlatformBtn').attr('class','btn btn-primary btn-medium');
		$('#editPlatformBtn').hide();
		$('#adPrevLink').hide();
		$('#editPlatformSave').show();
		$('#settingsModal .modal-title').text("Edit Platform Name & Preview Links");
		chrome.storage.sync.get(null, function(i) {
			if (jQuery.isEmptyObject(i) == true) {
				console.log(jQuery.isEmptyObject(i));
			} else {
				$('#platform').empty();
			}
			$('#editPlatform table').empty();
			for (key in i) {
				if (key.length > 0) {
					plat.push(key);
					editLen++;
					var bag = [];
					for (p in i[key]) {
							bag.push(i[key][p]);
						}
						if (!/^(f|ht)tps?:\/\//i.test(bag[1])) {
							$('#editPlatform table').append("<tr><td style='width:16%'><input disabled style='width:100%' type='text' value='"+bag[1]+"'></input></td><td style='width: 60%'><input style='width:100%' type='url' value='"+bag[0]+"'></input></td></tr>");
						   } else {
							   $('#editPlatform table').append("<tr><td style='width:16%'><input disabled style='width:100%' type='text' value='"+bag[0]+"'></input></td><td style='width:60%'><input style='width:100%' type='url' value='"+bag[1]+"'></input></td></tr>");
						}
					}
			}
			var editPlatforms = {};
//				console.log("editPlatforms: ", editPlatforms);
			var editPlatTable = $('#editPlatform table');
			var editPlatTableTr = $('#editPlatform table tr');
				var editTableLength = $('#editPlatform table tr').length;
			
			$('#editPlatformSave').click(function() {
				var td1 = [];
				var td2 = [];
//			console.log("editPreview: ", editPlatformsContainer);
	//			chrome.storage.sync.get(null, function(i) {});
				for (i=0; i< editTableLength;i++) {
					td1.push(editPlatTableTr[i].children[0].children[0].value.toUpperCase());
					td2.push(editPlatTableTr[i].children[1].children[0].value);
//					console.log(td1[i], td2[i]);
					
					//						var platformName = "";
//						var platformLink = "";
//						editPlatforms.platformName = editPlatTableTr[i].children[0].children[0].value.toUpperCase();
//						editPlatforms.platformLink = editPlatTableTr[i].children[1].children[0].value;
//						console.log(editPlatforms);
//						console.log(platformsContainer[platformName]);
//						platformsContainer[platformName] = editPlatforms;
//						console.log(platformsContainer);
////						editPlatformsContainer[platformName] = platformsContainer;
//						chrome.storage.sync.get(platformName, function(i) {
//							console.log(i);
//							i.platformName = editPlatforms.platformName;
//							i.platformLink = editPlatforms.platformLink;
//							console.log(i);
//							platformsContainer[i.platformName] = i;
//							chrome.storage.sync.set(platformsContainer);
//						});
//					
//					if (plat[i] == platformName) {
//						console.log("MATCH: ", plat[i]);
//
////						console.log(editPlatformsContainer);
//					} else {
//						console.log("NO MATCH: ", plat[i]);
//						chrome.storage.sync.remove(key);
////						var platformName = "";
////						var platformLink = "";
//						editPlatforms.platformName = editPlatTableTr[i].children[0].children[0].value.toUpperCase();
//						editPlatforms.platformLink = editPlatTableTr[i].children[1].children[0].value;
//						console.log(editPlatforms);
//						editPlatformsContainer[plat[i]] = editPlatforms;
//						console.log(editPlatformsContainer);
//						chrome.storage.sync.get(null, function(i) {
//							console.log(i);
//						});
//					}
				}
//				console.log(td1,td2);
				chrome.storage.sync.get(null, function(items) {
//					console.log(items);
					for (i=0; i<td1.length;i++) {
						for (key in items) {
//							console.log(key);
							if (key != td1[i]) {
//								console.log("No Match: ", td1[i], key);
//								var platformName  = td1[i];
//								var platformLink = "";
//								items[key].platformName = td1[i];
//								items[key].platformLink = td2[i];
//								console.log(items);
								chrome.storage.sync.set(items);
								chrome.storage.sync.remove(key);
							} else {
//								console.log(items[key], td1[i], td2[i]);
								var platformName  = td1[i];
								var platformLink = "";
								items[key].platformName = td1[i];
								items[key].platformLink = td2[i];
								chrome.storage.sync.set(items);
							}
						}	
					}
				});
				$('#settingsModal').modal('toggle');
				refresh();
			});
        });
		
		$('#addPlatform').hide(300);
		$('#editPlatform').show(300);
	});
	
	$('#settingsModal').on('hidden.bs.modal', function() {
		refresh();
	});
	
	if (isCrWinClose) {
//		console.log("Adblocker detected!");
		updateAdBlockStatus('adBlock');
	} else {
//		updateAdBlockStatus('noAdBlock');
		
//		$.ajax({url: "/js/ads.js", type: 'GET'});
	}
	
	$('#renderAdTag').click(function () {
		try {
			render_input();
		}
		
		catch(err) {
			$('#err_csp').css('display','block');
			$('#err_csp').empty();
			$('#err_csp').append("<div class='alert alert-warning' role='alert'>"+err.message+"</div>");
		}
		
		finally {
			$('#err_csp').css('display','block');
			$('#err_csp').empty();
			$('#err_csp').append("<div class='alert alert-warning' role='alert'>Error: Refused to load the script, because it violates the following Content Security Policy directive: 'script-src 'self'</div>");
		}
	});
	
//	$('#sfhostnuke').click(function () {
//		$sf.host.nuke();
//	});
//	
//	(function() {
//				var conf	= new $sf.host.Config({
//					renderFile:		"html/r.html",
//					positions:
//					{
//						"LREC":
//						{
//							id:		"LREC",
//							dest:	"tgtLREC",
//							w:		0,
//							h:		0
//						}
//					}
//				});
//
//				var posMeta		= new $sf.host.PosMeta(null,"rmx",{foo:"bar",bar:"foo"});
//				var pos			= new $sf.host.Position("LREC", "", posMeta);
//
//				$sf.host.render(pos);
//			})();
	
	// promote extensions
	$('#extPromoDiv').click(function() {
		$('#extPromo').modal('show');
	});
	
	$('[data-toggle="tooltip"]').tooltip(); //tooltip
	
	// prevent context menu
	$(document).contextmenu(function() {
		return false;
	});
});