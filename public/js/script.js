$(document).ready(function() {
$('.down-arrow').hover(function() {
    $( this ).animate({bottom:130});
  });
  $('.down-arrow').mouseleave(function() {
    $( this ).animate({bottom:120});
  });
	
$('.down-arrow').click(function () {
    $('html,body').animate({
        scrollTop: $(".downScroll").offset().top
    }, 1000);
	
});

// List Grid
$('#grid').css('color','#f40b0b');
	$('#list').click(function(){
		$(this).css('color','#f40b0b');
		$('#grid').css('color','#4c4c4c');
	});
	$('#grid').click(function(){
		$(this).css('color','#f40b0b');
		$('#list').css('color','#4c4c4c');
	});
	
	// VDP Panel
	$('#stickey .panel>.list-group .list-group-item, .panel>.panel-collapse>.list-group .list-group-item:even').css('border-right','none');
	$('#stickey .panel>.list-group .list-group-item, .panel>.panel-collapse>.list-group .list-group-item:odd').css('border-right','1px solid #ddd');
});

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 200) {
        $('.nav-dark-bg').addClass('navbar-inverse-dark');
    }
	else {
     $('.nav-dark-bg').removeClass('navbar-inverse-dark');
  }
});

// Crowsels
jQuery(document).ready(function($){
	
	// Brand
	$('.gallery-00').carousel({ visible: 4, itemMargin: 30, itemMinWidth: 300 });
	
	// Style
	$('.gallery-01').carousel({ visible: 4, itemMargin: 30, itemMinWidth: 300 });
	
	// Recent Listings
	$('.gallery-02').carousel({ visible: 3, itemMargin: 30, itemMinWidth: 300 });
	
	// Testimonial
	$('.gallery-03').carousel({ visible: 3, itemMargin: 30, itemMinWidth: 300 });
	
	// Team
	$('.gallery-04').carousel({ visible: 4, itemMargin: 30, itemMinWidth: 300 });
	
	// Team
	$('.gallery-05').carousel({ visible: 5, itemMargin: 30, itemMinWidth: 300 });
});