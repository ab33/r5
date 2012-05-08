/* HTML5 videos revealer. <ab33@gmx.com> */

chrome.extension.onRequest.addListener(
	function(req, sender, sendResponse) {
		var response = '{result:' + decorate() + '}';
		sendResponse(response);
	}
);

function decorate() {

	var digged = 0;
	var videos = document.getElementsByTagName('video');

	for(var i = 0; i < videos.length; i++) {

		var sources = new Array();

		var nodes = videos[i].childNodes;
		for(var n = 0; n < nodes.length; n++) {
			if (nodes[n].tagName == 'SOURCE') {
				var o = new Object();

				o.url	= nodes[n].src;
				o.mime	= nodes[n].type == 'undefined' || !nodes[n].type.length ? '' : nodes[n].type;
				if (o.mime.length > 16) o.mime = o.mime.substring(0, 16) + '...';

				var loc = document.createElement('a');
				loc.href = o.url;
				var ext = loc.pathname.split('.').pop();
				o.ext = (ext.length > 0 && ext.length < 5) ? ext : '';

				sources.push(o);
			}
		}

		if (!sources.length && videos[i].src != '') {
			var o = new Object();
			o.url	= videos[i].src;
			o.mime  = '';	// mo MIME for <video src=".. ???

			var loc  = document.createElement('a');
			loc.href = o.url;
			var ext  = loc.pathname.split('.').pop();
			o.ext = (ext.length > 0 && ext.length < 8) ? ext : '';

			sources.push(o);
		}

		if (sources.length) {

			var left = videos[i].offsetLeft;
			var top  = videos[i].offsetTop;
			var prev_off = videos[i].offsetParent ? videos[i].offsetParent : videos[i].parentElement;
			while (prev_off) {
				left += prev_off.offsetLeft;
				top  += prev_off.offsetTop;
				prev_off = prev_off.offsetParent;
			}

			if (top <= 0) top = 5 + (i * 70);

			var id_name = 'x-reveal5-video-';
			var id_str	=  id_name + i;
			var id_elem	= document.getElementById(id_str);

			if (!id_elem) {

				var x = null;
				var y = '';

				if (i) {
					var prev_str  = id_name + (i - 1);
					var prev_elem = document.getElementById(id_str);
					x = document.getElementById(prev_str);
					y = 'afterend';

				} else {
					x = document.getElementsByTagName('body')[0];
					y = 'afterbegin';
				}


				x.insertAdjacentHTML(y,
					  '<div id="' + id_str + '" '
					+  'style="border: solid 2px #000000; margin: 2px; background-color: #ffffaa; '
							+ 'font-size: 12px; font-family: arial; '
							+ 'color: #000000; padding: 5px; text-align: left; '
							+ 'position: absolute; top: ' + top + 'px; left: ' + left + 'px; height: 50px; z-index: 9999;"'
					+ '></div>');

				id_elem = document.getElementById(id_str);
			}

			var line = "";
			
			line += '<div>';
			line += '<span style="float: right; margin: 0px 3px 0px 6px;"><b> [<a href="javascript:void();" onclick="javascript:document.getElementById(\'' + id_str + '\').style.display = \'none\';" style="font-weight: bold; color: #000000;">x</a>] </b></span>';
			line += '<span style="color: #cccccc; font-size: 20px; font-weight: bold; float: left; padding: 0px 10px 0px 0px; margin: 0px 0px 0px 3px;">HTML5 Video</span>';
			
			for(var n = 0; n < sources.length; n++) {

				line += '<span style="float: left; border: solid 1px #aaaaaa; padding: 5px 10px 2px 5px; background-color: #ffffcc; margin: 0px 5px 0px 0px;">'
				line +=   '<span><a href="' + sources[n].url + '" style="font-weight: bold; color: #000000;">Source ' + (n + 1) + '</a></span>';
				if (o.ext.length) line += '<span style="font-size: 9px; color: #999999;"> (.' + sources[n].ext + ')</span>';
				line += '<br>';
				line +=  sources[n].mime.length ? '<span style="font-size: 9px; color: #999999;">MIME: &quot;' + sources[n].mime + '&quot;</span>' : '&nbsp;';
				line += '</span>';

			}
			line += '</div>';

			id_elem.innerHTML = line;
			id_elem.style.display = 'block';
			digged++;
		}

	}	
	return digged;
}
