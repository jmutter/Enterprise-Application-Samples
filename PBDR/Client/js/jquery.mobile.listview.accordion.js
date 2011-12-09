/*
* jQuery Mobile Framework : listview accordion extension
* 
* Copyright (c) Boris Smus (original) : http://forum.jquery.com/topic/listview-accordion-plugin
* Copyright (c) Lee Young Chan (modify)
* mail to : leeyc09@naver.com
*/
(function($, undefined ) {

$( "[data-role='listview']" ).live( "listviewcreate", function() {
	var list = $( this ),
		listview = list.data( "listview" );	
	var accordionDecorator = function() {
		//accordion-head
		list.find('.ui-li-accordion-head' ).each(function(index, accordion) {
	  		// Format the accordion accordingly:
			// <ul data-role="listview" id="listView">
			// 	<li data-role="list-divider" class="ui-li-accordion-head">Title name</li>
			//	<li>
			//		<div class="ui-li-accordion">
			//			<li>contents1</li>
			//			<li>contents2</li>
			//			<li>contents3</li>
			//		</div>
			//	</li>
			//</ul>
	  		// If you don't want list-divider style, JUST REMOVE IT
	  		// Get the li
	  		var $accordion = $(accordion);
	  		$li = $accordion.closest('li');
	  		//Second li element's padding remove
	  		//It is hide detail row
	  		$(this).next().css('padding', '0');	  		
	  		// Bind click handler to show the accordion
	  		$li.bind('click', function() {
	  			// Check that the current flap isn't already open
	  			var $accordion = list.find('.ui-li-accordion:eq('+index+')');	  			
	  			if ($accordion.css('display') != 'none') {
	  				$accordion.hide();
	  				$(this).removeClass('ui-li-accordion-open');
	  				return;
	  			}
	  			// Close all other accordion flaps
	  			// * I remove silde effect for Speed up.*
	  			list.find('.ui-li-accordion:eq('+index+')').show();
	  			// Open this flap 
	  			$(this).toggleClass('ui-li-accordion-open');
	  		});
	  	});
	  
	  
		//accordion-detail  
		list.find('.ui-li-accordion').each(function(index, accordion) {
  		// Get the li 
  		var $accordion = $(accordion);
  		$li = $accordion.closest('li');
  		// Move the contents of the accordion element to the end of the <li>
  		$li.append($accordion.clone());
  		$accordion.remove();
  		// Unbind all click events
  		$li.unbind('click');
  		// Remove all a elements
  		$li.find('a').remove();
  		// Bind click handler to show the accordion
  		$li.bind('click', function() {
  			// Check that the current flap isn't already open
  			var $accordion = list.find('.ui-li-accordion:eq('+index+')');
  			if ($accordion.css('display') != 'none') {
  				$accordion.hide();
  				$(this).removeClass('ui-li-accordion-open');
  				return;
  			}
  			// Close all other accordion flaps
  			list.find('.ui-li-accordion:eq('+index+')').show();
  			// Open this flap 
  			$(this).toggleClass('ui-li-accordion-open');
  		});
  	});
};
	
accordionDecorator();
	
// Make sure that the decorator gets called on listview refresh too
var orig = listview.refresh;
listview.refresh = function() {
	orig.apply(listview, arguments[0]);
    accordionDecorator();
	};
});

})( jQuery );
