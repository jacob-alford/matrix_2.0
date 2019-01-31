const updateBackground = (w,h) => {
  console.log(`Width: ${w}, Height:${h}`);
  if(w>h*(1547/1098)){
    $("body").css("background-size",`${w}px auto`);
    $("body").css("background-position",`50% 15%`);
  }else if(w>h*(1371/1098)){
    $("body").css("background-size",`${w*1.25}px auto`);
    $("body").css("background-position",`50% 15%`);
  }else{
    $("body").css("background-size",`auto ${h}px`);
    $("body").css("background-position",`50% 0%`);
  }
}
$(document).ready(function(){
  $(".linkFade").hover(
    function(){ $(this).stop().animate({opacity:.5},"fast") },
    function(){ $(this).stop().animate({opacity:1},"fast") }
  );
  updateBackground(window.innerWidth,window.innerHeight);
  $(window).resize(() => updateBackground(window.innerWidth,window.innerHeight));
});
