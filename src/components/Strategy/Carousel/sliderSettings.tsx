import { Settings } from "react-slick"
import { NextArrow } from "./NextArrow"
import { PrevArrow } from "./PrevArrow"

export const sliderSettings: Settings = {
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: false,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1170,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 680,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}
