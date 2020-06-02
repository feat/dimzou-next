export default {
  gaode: {
    url:
      "//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    options: {
      subdomains: ["1", "2", "3", "4"],
    },
  },
  google: {
    url: "//www.google.com/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
    options: {},
  },
  openStreatMap: {
    url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
};
