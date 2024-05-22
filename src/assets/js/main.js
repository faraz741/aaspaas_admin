$(window).on('load', function () {
    $('.ct_loader').fadeOut('slow', function () {
        $(this).remove();
    });
});

$(document).ready(function(){
    

    $(".ct_toggle_bar").click(function(){
        $(".c_main_div").addClass("ct_active")
    })
    $(".ct_close_btn").click(function(){
        $(".c_main_div").removeClass("ct_active")
    })
    $(".ct_customize_btn12").click(function(){
        $(".ct_bottom_customize").toggleClass('active')
    });

    $(".ct_share_main > i").click(function(){
$(".ct_animated_socials").toggleClass('active')
    });


    // $(".ct_custum_dropdown li").click(function(){
    //     $(".ct_custum_dropdown").toggleClass("show")
    // })
    new DataTable('#example');
  
   
    $(window).load(function() {
        $('.ct_loader').remove();
        });
        

    $('.js-tilt').tilt({
        axis: y
    })
})


  
$('.ct_chapper_inner_cnt').owlCarousel({
    loop:false,
    nav:true,
    autoplay:false,
    touchDrag  : false,
     mouseDrag  : false,
     smartSpeed:2000 ,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})


$('.ct_ads_slider').owlCarousel({
    loop:true,

    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})



function search_list(){
const search_list = document.querySelector(".ct_search_list12");

search_list.classList.toggle('ct_active');
;

}


ClassicEditor
.create( document.querySelector( '#ct_editor' ) )
.then( editor => {
        console.log( editor );
} )
.catch( error => {
        console.error( error );
} );