google.load("feeds", "1");
		
function Agrogate(){
	$(".agrogator").each(function(){
		var agrogator = this;
		$(agrogator).find(".agrogator_container").html('');
		$(agrogator).find(".agrogator_enclosure").each(function(){
			var feed_uri = $(this).data('uri');
			var feed = new google.feeds.Feed(feed_uri);
			feed.setNumEntries(20);
			feed.load(function(result){
				if (!result.error){
					var agrogator_container = $(agrogator).find(".agrogator_container");
					for (var i = 0; i < result.feed.entries.length; i++) {
						var entry = result.feed.entries[i];
						var date=new Date(entry.publishedDate);
						date = Math.floor(date / 1000);
						var story="<div class=\"story_container\" data-pubdate=\""+date+"\"><b><a href=\""+entry.link+"\" target=\"_blank\">"+strip_tags(entry.title)+"</a></b>\n <i>"+strip_tags(result.feed.title)+"</i>\n ";
						
						if(!(
							(entry.contentSnippet == 'Comments')||
							(entry.contentSnippet.includes("submitted by"))

						)){
							story = story + "<p>"+strip_tags(entry.contentSnippet)+"</p>";
						}
						
						story = story + "</div>";
						
						agrogator_container.append(story);
					}
					
					agrogator_container.find('div').sort(function (b, a) {
						return +a.getAttribute('data-pubdate') - +b.getAttribute('data-pubdate');
					})
					.appendTo(agrogator_container);

				}else{
					$(this).html('Error Loading Feed');
				}
			});
		});
	});
}

google.setOnLoadCallback(Agrogate);

function strip_tags(input, allowed){
  allowed = (((allowed || '') + '')
	  .toLowerCase()
	  .match(/<[a-z][a-z0-9]*>/g) || [])
	.join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
	commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
	.replace(tags, function($0, $1) {
	  return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}
