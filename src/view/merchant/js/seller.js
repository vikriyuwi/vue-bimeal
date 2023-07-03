$(window).scroll(function () {
    var wScroll = $(this).scrollTop();
    console.log(wScroll);
    $(".head-background").css({
      transform: "translate(0, " + wScroll / 3 + "px)",
    });
  });