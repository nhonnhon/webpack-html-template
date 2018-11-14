import $ from "jquery";
import "slick-carousel";

console.log("This is slider");

$(".mySlider").slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1
});
