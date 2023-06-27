
function toggleOngoing() {
  $("body > div").addClass("d-none");
  $(".ongoing-page").removeClass("d-none");
  $(".ongoing-page .order-detail").css({
    display: "block",
  });
  $(".promo-code").addClass("d-none");
  $(".plus-minus-button").addClass("d-none");
}
$(".col-3 a#home").click(function () {
  $("body > div").addClass("d-none");
  $(".head-background").removeClass("d-none");
  $(".main-page").removeClass("d-none");
  $(".footer").removeClass("d-none");
});
$(".col-3 a#search").click(function () {
  $("body > div").addClass("d-none");
  $(".search-page").removeClass("d-none");
  $(".footer").removeClass("d-none");
});
$(".col-3 a#history").click(function () {
  $("body > div").addClass("d-none");
  $(".history-page").removeClass("d-none");
  $(".footer").removeClass("d-none");
});

// $(".col-3 a#profile").click(function () {
//   $("body > div").addClass("d-none");
//   $(".profile-page").removeClass("d-none");
//   $(".footer").removeClass("d-none");
// });

$(".paid-footer").click(function () {
  $("body > div").addClass("d-none");
  $(".history-page").removeClass("d-none");
  
});
function addCart() {
  $(".cart-page").css({
    transform: "translateY(0)",
    transition: "0.5s",
  });
  $(".footer-row").css({
    transform: "translateY(-100%)",
    transition: "0.3s",
  });
  $(".cart-footer").css({
    transform: "translateY(-210%)",
    transition: "0.3s",
  });
}

$(".cart-line").click(function () {
  $(".cart-page").css({
    transform: "translateY(100vh)",
    transition: "0.5s",
  });
  $(".footer-row").css({
    transform: "translateY(0)",
    transition: "0.3s",
  });
  $(".cart-footer").css({
    transform: "translateY(0)",
    transition: "0.3s",
  });
});

$(".col-3 a").click(function () {
  $(".col-3").removeClass("active");
  $(this).parent().parent().toggleClass("active");
});

$(".status-container .position-absolute").click(function () {
  var width = $(this).position();
  console.log(width.left);
  $(".status-container .position-absolute").removeClass("active");
  $(this).toggleClass("active");
  $(".progress-bar").css({
    width: width.left,
  });
});

$(window).scroll(function () {
  var wScroll = $(this).scrollTop();
  $(".head-background").css({
    transform: "translate(0, " + wScroll / 3 + "px)",
  });
});

$(".status-container .status-btn").click(function () {
  $(".footer-row").css({
    transform: "translateY(-100%)",
    transition: "0.3s",
  });
  $(".ongoing-footer").css({
    transform: "translateY(-400%)",
    transition: "0.3s",
  });
  $("body > div").addClass("d-none");
  $(".ongoing-page").removeClass("d-none");
  $(".ongoing-page .order-detail").css({
    display: "none",
  });
  $(".footer").removeClass("d-none");
  $(".promo-code").removeClass("d-none");
  $(".plus-minus-button").removeClass("d-none");
});
$(".back-button").click(function () {
  $("body > div").addClass("d-none");
  $(".history-page").removeClass("d-none");
  $(".footer").removeClass("d-none");
  $(".footer-row").css({
    transform: "translateY(0)",
    transition: "0.3s",
  });
  $(".ongoing-footer").css({
    transform: "translateY(0)",
    transition: "0.3s",
  });
  $(".col-3").removeClass("active");
  $(".col-3 a#history").parent().parent().addClass("active");
});
