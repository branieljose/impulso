$(document).ready(function () {

  var currentURL = window.location.origin;
  var $canvas;
  var $canvasWidth;
  var $canvasHeight;
  var $canvasWidthRatio;
  var $canvasHeightRatio;
  var fabCanvas;
  // var appLoggedIn = false;



  var delLayer;
  var palArray = [];
  var palObj = [];
  var currentShowroom = {
    id: 0,
    showroom_height: 0,
    showroom_width: 0,
    showroom_name: "",
    canvas_id: 0,
    file_path: "",
    file_name: "",
    user_id: 0
  };

  var textureExists = false;
  var colorExists = false;
  var floorMode = false;
  var decorMode = false;
  var roomMode = false;
  var artworkCount = 0;

//extends fabric.js by adding a property called name to fabric objects which can be used to 
//assign a name to object layers and reference them later on via their name
  fabric.Object.prototype.name = null;
  fabric.Object.prototype.data = {};

  fabric.Canvas.prototype.getItemByName = function(name) {
    var object = null,
        objects = this.getObjects();

    for (var i = 0, len = this.size(); i < len; i++) {
      if (objects[i].name && objects[i].name === name) {
        object = objects[i];
        break;
      }
    }

    return object;
  };

  function setCanvas() {
    if ($(window).width() > 1900 && $(window).width() <= 2500) {
      $canvasWidth = 1152;
      $canvasHeight = 768;
    } else {
      if ($(window).width() > 1550 && $(window).width() <= 1900) {
        $canvasWidth = 1008;
        $canvasHeight = 672;
      } else {
        if ($(window).width() <= 1550) {
          $canvasWidth = 864;
          $canvasHeight = 576;
        } else { //browser window is bigger than 2500
          $canvasWidth = 1728;
          $canvasHeight = 1152;
        }
      }
    }

    var newCanvas = $("<canvas>").attr("id", "room-canvas").attr("width", $canvasWidth).attr("height", $canvasHeight);

    // Do some initializing stuff
    fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: 'rgba(102,153,255,0.5)',
        cornerSize: 12,
        padding: 5
    });

    $("#canvas").append(newCanvas);
    $canvas = $("#room-canvas");
    fabCanvas = new fabric.CanvasEx("room-canvas");
    fabCanvas.preserveObjectStacking = true;

    // $("#my-showrooms").css('width', $canvasWidth);
    $(".tab-pane-mod").css('height', $canvasHeight);
    $("#canvas-toolbar").css('width', $canvasWidth);

  };

  function clearCanvas() {

    $("#btn-palette").html("Select Paint Brand...<span class=\"caret\"></span>");
    $("#color-name").empty();
    
    setColorPicker();
    fabCanvas.clear();
    floorMode = false;
    decorMode = false;
    roomMode = false;
    textureExists = false;
    colorExists = false;
    artworkCount = 0;

  };

  function setColorPicker() {

    $("#full").spectrum({
      color: "white",
      showInput: true,
      className: "full-spectrum",
      showInitial: true,
      togglePaletteOnly: true,
      togglePaletteMoreText: "more",
      togglePaletteLessText: "less",
      hideAfterPaletteSelect: true,

      showPalette: true,
      showPaletteOnly: false,
      showSelectionPalette: true,
      maxSelectionSize: 10,
      preferredFormat: "rgb",
      sessionStorageKey: "spectrum.impulso",
      move: function (color) {

      },
      show: function () {

      },
      beforeShow: function () {

      },
      hide: function () {

      },
      change: function (color) {

        var colorIndex;
        var colorOpacity;

        fabCanvas.remove(fabCanvas.getItemByName("color"));

        if (textureExists) {
          var texObj = fabCanvas.getItemByName("texture");
          texObj.visible = true;

          colorIndex = 1;
          colorOpacity = .9;
        } else {
          colorIndex = 0;
          colorOpacity = 1;
        }

      var colorObj = new fabric.Rect({
        name: "color",
        fill: color.toHexString(),            
        opacity: colorOpacity,
        selectable: false,
        data: {
          color: color.toHexString()
        },
        left: 0,
        top: 0,
        width: fabCanvas.width,
        height: fabCanvas.height
      });
      fabCanvas.add(colorObj);
      colorObj.moveTo(colorIndex);
      fabCanvas.renderAll();
      colorExists = true;

      },
      palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
          "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)",
          "rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
          "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)",
          "rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
          "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
          "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
          "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
          "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
          "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
          "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
          "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
          "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
          "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"
        ]
      ]
    });

  }

  function getShowrooms(userId) {

    //retrieve saved Showrooms, if any
    $.ajax({
      url: "/showrooms/user/" + userId,
      method: "GET"
    }).done(function (data) {
      $("#my-showrooms").empty();

      data.forEach(function (data) {
        var imgURL = "./app/userShowrooms/tn_" + data.id + ".png?" + Math.random();

        fabric.Image.fromURL(imgURL, function(img) {
          // var imgObj = new fabric.Image(img);
          if (img._element) {
            var $imgThumbnail = $(img.getElement());
            $imgThumbnail.addClass("img-responsive img-thumbnail tn-showroom").attr("width", "150px");
          } else {
            var $imgThumbnail =  $("<img>").addClass("img-responsive img-thumbnail tn-showroom")
            .attr("src", './app/assets/images/default.png').attr("width", "150px")
          }  
          var $div = $("<div>").addClass("showroom text-center");
          var $Delete = $("<div>").html("<span class=\"fa fa-trash\" style=\"font-size:24px\"></span>").attr("data-id", data.id).attr("data-user-id", userId).addClass("del-showroom");
          var $divText =  $("<div>").text(data.showroom_name + " ").addClass("del-showroom-text");
          var $divShowroom = $("<div>").addClass("my-showroom text-center").attr("data-user-id", data.user_id)
            .attr("data-id", data.id).attr("data-canvas-id", data.canvas_id)
            .attr("data-height", data.showroom_height).attr("data-width", data.showroom_width);

          $divShowroom.append($imgThumbnail).append($divText);

          $div.append($Delete).append($divShowroom);


            //*******load and display showroom using data[i].file_path and data[i].file_name

          $("#my-showrooms").append($div);
        });


      });

      // for (var i = 0; i < data.length; i++) {
      //   var $div = $("<div>").addClass("showroom text-center");
        // var $imgThumbnail = $("<img>").addClass("img-responsive img-thumbnail tn-showroom")
        //   .attr("src", './app/userShowrooms' + "/tn_" + data[i].id + ".png?" + Math.random()).attr("width", "150px")
        //   .attr("onerror", "this.onerror=null;this.src='./app/assets/images/default.png';");
      //   var $Delete = $("<div>").html("<span class=\"fa fa-trash\" style=\"font-size:24px\"></span>").attr("data-id", data[i].id).attr("data-user-id", userId).addClass("del-showroom");
      //   var $divText =  $("<div>").text(data[i].showroom_name + " ").addClass("del-showroom-text");
      //   var $divShowroom = $("<div>").addClass("my-showroom text-center").attr("data-user-id", data[i].user_id)
      //     .attr("data-id", data[i].id).attr("data-canvas-id", data[i].canvas_id)
      //     .attr("data-height", data[i].showroom_height).attr("data-width", data[i].showroom_width);

      //   $divShowroom.append($imgThumbnail).append($divText);

      //   $div.append($Delete).append($divShowroom);


      //     //*******load and display showroom using data[i].file_path and data[i].file_name

      //   $("#my-showrooms").append($div);
      // }
    });
  };

  function displayShowroom(showroomId, userId) {

    $.ajax({
      url: "/showrooms/showroom/" + showroomId,
      method: "GET"
    }).done(function (data) {
      
      clearCanvas();

      currentShowroom.id = data[0].showroom_id;
      currentShowroom.showroom_height = data[0].showroom_height;
      currentShowroom.showroom_width = data[0].showroom_width;
      currentShowroom.showroom_name = data[0].showroom_name;
      currentShowroom.canvas_id = data[0].canvas_id;
      currentShowroom.file_path = data[0].file_path;
      currentShowroom.file_name = data[0].file_name;
      currentShowroom.user_id = data[0].user_id;

      $canvasWidthRatio = currentShowroom.showroom_width / $canvasWidth;
      $canvasHeightRatio = currentShowroom.showroom_height / $canvasHeight;
      
      data.forEach(function(data) {
         switch (data.layer_type) {
          case "texture":
            addTexture(data)
            break;
          case "color":
            addColor(data)
            break;
          case "room":
            addBaseImg(data);
            break;
          case "decor":
            addBaseImg(data);
            break;
          case "floor":
            addBaseImg(data);
            break;
          default: //art, furniture
            addOtherObjects(data);
        }
      });
    });
  };

  function addTexture(data) {

    $('img[data-obj-id="' + data.object_id + '"]').trigger("click");
  }

  function addColor(data) {

    var colorIndex;
    var colorOpacity;
    // var colorName = palObj[(palArray.indexOf(data.color.toUpperCase()))].name;
    $("#color-name").html("");


    if (textureExists) {
      var texObj = fabCanvas.getItemByName("texture");
      texObj.visible = true;

      colorIndex = 1;
      colorOpacity = .9;
    } else {
      colorIndex = 0;
      colorOpacity = 1;
    }

    var colorObj = new fabric.Rect({
      name: "color",
      fill: data.color,            
      opacity: colorOpacity,
      selectable: false,
      data: {
        color: data.color
      },
      left: 0,
      top: 0,
      width: fabCanvas.width,
      height: fabCanvas.height
    });
    fabCanvas.add(colorObj);
    colorObj.moveTo(colorIndex);
    fabCanvas.renderAll();
    colorExists = true;

  }

  function addBaseImg(data) {

    $('img[data-obj-id="' + data.object_id + '"]').trigger("click");

  }

  function addOtherObjects(data) {
    $('img[data-obj-id="' + data.object_id + '"]').trigger("click", [data.height, data.width, data.position_top, data.position_left, data.flipped, data.angle]);

  }

  function loadRooms() {
    $.ajax({
      url: "/objects/rooms",
      method: "GET"
    }).done(function (data) {
      for (var i = 0; i < data.length; i++) {
        var $imgThumbnail = $("<img>").addClass("img-responsive img-thumbnail img-base").attr("data-src", data[i].file_path + data[i].file_name).attr("data-drag", false)
          .attr("data-width", fabCanvas.width).attr("data-height", fabCanvas.height).attr("data-x", 0).attr("data-y", 0).attr("data-name", "room").attr("data-type", "room")
          //deleted this "tn_" + 
          .attr("src", data[i].file_path + data[i].file_name).attr("width", "150px").attr("alt", data[i].obj_name).attr("data-obj-id", data[i].id);

        $("#rooms").append($imgThumbnail);

      }
    });

  };
  function loadFloors() {
    $.ajax({
      url: "/objects/floors",
      method: "GET"
    }).done(function (data) {
      for (var i = 0; i < data.length; i++) {
        var $imgThumbnail = $("<img>").addClass("img-responsive img-thumbnail img-base").attr("data-src", data[i].file_path + data[i].file_name).attr("data-drag", false)
          .attr("data-width", fabCanvas.width).attr("data-height", fabCanvas.height).attr("data-x", 0).attr("data-y", 0).attr("data-name", "floor").attr("data-type", "floor")
          .attr("src", data[i].file_path + "tn_" + data[i].file_name).attr("width", "150px").attr("alt", data[i].obj_name).attr("data-obj-id", data[i].id);

        $("#floors").append($imgThumbnail);

      }
    });

  };

  function loadPaletteDropdown() {
    $.ajax({
      url: "/palettes",
      method: "GET"
    }).done(function (data) {
      $(".palette-well").empty();
      for (var i = 0; i < data.length; i++) {
        var $liPalette = $("<li>").addClass("palette").attr("data-id", data[i].id).text(data[i].palette_name);

        $(".palette-well").append($liPalette);

      }
    });

  };

  function loadDecors() {
    $.ajax({
      url: "/objects/decors",
      method: "GET"
    }).done(function (data) {
      for (var i = 0; i < data.length; i++) {
        var $imgThumbnail = $("<img>").addClass("img-responsive img-thumbnail img-base").attr("data-src", data[i].file_path + data[i].file_name).attr("data-drag", false)
          .attr("data-width", fabCanvas.width).attr("data-height", fabCanvas.height).attr("data-x", 0).attr("data-y", 0).attr("data-name", "decor").attr("data-type", "decor")
          .attr("src", data[i].file_path + "tn_" + data[i].file_name).attr("width", "150px").attr("alt", data[i].obj_name).attr("data-obj-id", data[i].id);

        $("#decors").append($imgThumbnail);

      }
    });
  }

  function loadTextures() {
    var removeTexture = $("<button>").text("No Texture").addClass("btn btn-default no-texture").attr("type", "button");

    $("#textures").append($("<br>")).append(removeTexture).append($("<br>"));

    $.ajax({

      url: "/objects/textures",
      method: "GET"
    }).done(function (data) {
      for (var i = 0; i < data.length; i++) {
        var $imgThumbnail = $("<img>").addClass("img-responsive img-thumbnail img-patt").attr("data-src", data[i].file_path + data[i].file_name).attr("data-drag", false)
          .attr("data-width", fabCanvas.width).attr("data-height", fabCanvas.height).attr("data-x", 0).attr("data-y", 0).attr("data-name", "texture").attr("data-type", "texture")
          .attr("src", data[i].file_path + "tn_" + data[i].file_name).attr("width", "150px").attr("alt", data[i].obj_name).attr("data-obj-id", data[i].id);

        $("#textures").append($imgThumbnail);

      }
    });
  }

  function loadArtwork() {
    $.ajax({
      url: "/objects/artwork",
      method: "GET"
    }).done(function (data) {
      for (var i = 0; i < data.length; i++) {
        var $imgThumbnail = $("<img>").addClass("img-responsive img-thumbnail img-art").attr("data-src", data[i].file_path + data[i].file_name).attr("data-drag", true).attr("data-height", data[i].pixel_height)
          .attr("data-width", data[i].pixel_width).attr("data-x", 100).attr("data-y", 20).attr("data-name", data[i].obj_name).attr("data-copy", 1)
          .attr("data-type", "art").attr("src", data[i].file_path + "tn_" + data[i].file_name.toLowerCase()).attr("width", "150px").attr("alt", data[i].obj_name).attr("data-obj-id", data[i].id);

        $("#artwork").append($imgThumbnail);

      }
    });
  }

  function loadFurniture() {
    $.ajax({
      url: "/objects/furniture",
      method: "GET"
    }).done(function (data) {
      for (var i = 0; i < data.length; i++) {
        var $imgThumbnail = $("<img>").addClass("img-responsive img-thumbnail img-furn").attr("data-src", data[i].file_path + data[i].file_name).attr("data-drag", true).attr("data-height", data[i].pixel_height)
          .attr("data-width", data[i].pixel_width).attr("data-x", 100).attr("data-y", 100).attr("data-name", data[i].obj_name).attr("data-copy", 1)
          .attr("data-type", "furn").attr("src", data[i].file_path + "tn_" + data[i].file_name).attr("width", "150px").attr("alt", data[i].obj_name).attr("data-obj-id", data[i].id);

        $("#furniture").append($imgThumbnail);

      }
    });
  }

  //*********************app starts executing here***********************

  setCanvas();

  var sessionData = checkUser();

  loadPaletteDropdown();

  setColorPicker();

  loadRooms();

  loadFloors();

  loadDecors();

  loadTextures();

  loadArtwork();

  loadFurniture();

  //*********************Event Listeners**********************************
  // $(document).on("error", "img", function () {
  //   $(this).attr('src', './app/assets/images/default.png');
  // });

  $(document).on("click", ".palette", function () {
    var palName = $(this).text();
    var paId = $(this).data("id");
    $("#btn-palette").html(palName + "<span class=\"caret\"></span>");

    $.ajax({
      url: "/palettes/palette/" + paId + "/object",
      method: "GET"
    }).done(function (data) {
      palArray = [];
      palObj = data;
      console.log(palObj);
      for (var i = 0; i < data.length; i++) {
        palArray.push(data[i].hex);
      }
      $("#full").spectrum({
        color: "#ECC",
        showInput: true,
        className: "full-spectrum",
        showInitial: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        hideAfterPaletteSelect: true,
        showPalette: true,
        showPaletteOnly: false,
        showSelectionPalette: true,
        maxSelectionSize: 10,
        preferredFormat: "name",
        sessionStorageKey: "spectrum.impulso",
        move: function (color) {

        },
        show: function () {

        },
        beforeShow: function () {

        },
        hide: function () {

        },
        change: function (color) {

          var colorIndex;
          var colorOpacity;
          var colorName = palObj[(palArray.indexOf(color.toHexString().toUpperCase()))].name;
          $("#color-name").html("Color: " + colorName);


          fabCanvas.remove(fabCanvas.getItemByName("color"));

          if (textureExists) {
            var texObj = fabCanvas.getItemByName("texture");
            texObj.visible = true;
            colorIndex = 1;
            colorOpacity = .9;
          } else {
            colorIndex = 0;
            colorOpacity = 1;
          }

          var colorObj = new fabric.Rect({
            name: "color",
            fill: color.toHexString(),            
            opacity: colorOpacity,
            selectable: false,
            data: {
              color: color.toHexString()
            },
            left: 0,
            top: 0,
            width: fabCanvas.width,
            height: fabCanvas.height
          });
          fabCanvas.add(colorObj);
          colorObj.moveTo(colorIndex);
          fabCanvas.renderAll();
          colorExists = true;

        },
        palette: [palArray]
      });
    });

  });

  $(document).on("click", ".my-showroom", function () {
    var showroomId = $(this).data("id");
    var userId = $(this).data("user-id");

    displayShowroom(showroomId, userId);

  });

   $(document).on("click", ".del-showroom", function () {
       var showroomId = $(this).data("id");
       var userId = $(this).data("user-id");
       
       ajaxDelLayersAndShowroom(showroomId, userId);

   });

  // $(document).on("click", ".img-base", function (e, h, w, t, l) {
  $(document).on("click", ".img-base", function () {
    var height;
    var width;
    var top;
    var left;

    //commented out because height and width doesn't need to be defined, 
    //base images should just conform to the canvas' height and width
    
    // if (h) height = h;
    // else height = $(this).data("height");

    // if (w) width = w;
    // else width = $(this).data("width");

    // if (t) top = t;
    // else top = $(this).data("y");

    // if (l) left = l;
    // else left = $(this).data("x");

    height = $(this).data("height");
    width = $(this).data("width");
    top = $(this).data("y");
    left = $(this).data("x");

    if (floorMode) fabCanvas.remove(fabCanvas.getItemByName("floor"));
    if (roomMode) fabCanvas.remove(fabCanvas.getItemByName("room"));
    if (decorMode) fabCanvas.remove(fabCanvas.getItemByName("decor"));

    floorMode = false;
    decorMode = false;
    roomMode = false;

    switch ($(this).data("type")) {
      case "floor":
        floorMode = true;
        break;
      case "decor":
        decorMode = true;
        break;
      case "room":
        roomMode = true;
        break;
    }

    var _this = this;

    var imgURL = $(_this).data("src");

    fabric.Image.fromURL(imgURL, function(img) {
      // var imgObj = new fabric.Image(img);
      var imgObj = img;
      imgObj.set({
      name: $(_this).data("name"),
      selectable: $(_this).data("drag"),
      data: {
        type: $(_this).data("type"),
        objid: $(_this).data("obj-id")
      },
      opacity: 1,
      centeredScaling: false,
      left: left,
      top: top,
      width: width,
      height: height,
      evented: false
    })
    
      var objIndex;

      if ($(this).data("type") === "room") {
        if (colorExists) fabCanvas.remove(fabCanvas.getItemByName("color"));
        if (textureExists) fabCanvas.remove(fabCanvas.getItemByName("texture"));
        colorExists = false;
        textureExists = false;
        objIndex = 0;
        $("#full").spectrum("disable");
      } else {
          $("#full").spectrum("enable");
          if (colorExists && textureExists) objIndex = 2 + artworkCount;
          if ((colorExists && !(textureExists)) || (!(colorExists) && textureExists)) objIndex = 1 + artworkCount;
          if (!(colorExists) && !(textureExists)) objIndex = 0 + artworkCount;
      }

      fabCanvas.add(imgObj)
      imgObj.moveTo(objIndex);
      fabCanvas.renderAll();
    });

  });

  $(document).on("click", ".img-art, .img-furn", function (e, h, w, t, l, f, a) {
    var height;
    var width;
    var top;
    var left;
    var flipped;
    var angle;

    if (h) height = h / $canvasHeightRatio;
    else height =  $(this).data("height"); //this.naturalHeight;

    if (w) width = w / $canvasWidthRatio;
    else width =  $(this).data("width"); //this.naturalWidth;

    if (t) top = t / $canvasHeightRatio;
    else top = $(this).data("y");

    if (l) left = l / $canvasWidthRatio;
    else left = $(this).data("x");

    if (f) {
      if (f == 0) flipped = false;
      else flipped = true;
    } 
    else flipped = false;

    if (a) angle = a;
    else angle = 0;
    
    var layerName = $(this).data("name") + "_" + $(this).data("copy");

    var _this = this;

    var imgURL = $(_this).data("src");

    fabric.Image.fromURL(imgURL, function(img) {
      var imgObj = img;
      imgObj.set({
      name: layerName,
      selectable: $(_this).data("drag"),
      data: {
        type: $(_this).data("type"),
        objid: $(_this).data("obj-id")
      },
      flipX: flipped,
      opacity: 1,
      centeredScaling: false,
      lockUniScaling: true,
      left: left,
      angle: angle,
      top: top,
      width: width,
      height: height
    });
    imgObj.setShadow({
        blur: 5,
        color: 'rgba(0,0,0,0.5)',
        offsetX: 5,
        offsetY: 5
    });
    fabCanvas.add(imgObj);
    imgObj.on({
      'object:dblclick': function() {
        delLayer = imgObj;
        $("#deleteModal").modal({
          backdrop: "static",
          keyboard: true
        });
      }
    });

    var objIndex;

    if ($(_this).data("type") === "art") {
      artworkCount++;
      if (roomMode) objIndex = artworkCount;
      else {
        if (colorExists && textureExists) objIndex = 1 + artworkCount;
        if ((colorExists && !(textureExists)) || (!(colorExists) && textureExists)) objIndex = artworkCount;
        if (!(colorExists) && !(textureExists)) objIndex = artworkCount - 1;
      }
      imgObj.moveTo(objIndex);
    }

    fabCanvas.renderAll();
    });

    //increment copy number so if the same image is added to canvas, it will take on the next copy number
    var num = $(this).data("copy") + 1;

    $(this).data("copy", num);

  });

  $(document).on("click", ".img-patt", function () {

    var objVisible;

    if (colorExists) objVisible = true;
    else objVisible = false;

    var texObj = fabCanvas.getItemByName("texture");
    if (texObj) fabCanvas.remove(texObj);

    var imgURL = $(this).data("src");

    var _this = this;

    fabric.util.loadImage(imgURL, function (img) {
    
      var rect = new fabric.Rect({
        name: "texture",
        visible: true,
        selectable: false,
        data: {
          type: $(_this).data("type"),
          objid: $(_this).data("obj-id")
        },
        top: 0,
        left: 0,
        width: fabCanvas.width,
        height: fabCanvas.height
      });

      rect.setPatternFill({
          source: img,
          repeat: 'repeat'
      });
      fabCanvas.add(rect);
      console.log("fabCanvas.add(rect)");
      rect.moveTo(0);
      // fabCanvas.renderAll();
      var colorObj = fabCanvas.getItemByName("color");

      if (colorObj) {
        colorObj.set({
        opacity: .9
      });
      };

      textureExists = true;
      fabCanvas.renderAll();
    });


  });

  $(document).on("click", ".no-texture", function () {
    textureExists = false;

    var colorObj = fabCanvas.getItemByName("color");

    colorObj.set({
      opacity: 1
    });

    fabCanvas.remove(fabCanvas.getItemByName("texture"));
    fabCanvas.renderAll();

  });

  $(document).on("click", "#delete-obj", function () {

    fabCanvas.remove(delLayer);
    fabCanvas.renderAll();
    if (delLayer.data.type === "art") artworkCount--;

  });

  $('#btn-clear').on('click', function () {

   clearCanvas();

  });

  $('#btn-flip').on('click', function () {
    var activeObject = fabCanvas.getActiveObject()
    if (activeObject) activeObject.flipX = !(activeObject.flipX);

    fabCanvas.renderAll();

  });
     
  $('#btn-del').on('click', function () {
    var activeObject = fabCanvas.getActiveObject()
    if (activeObject) {
      
      delLayer = activeObject;
        $("#deleteModal").modal({
          backdrop: "static",
          keyboard: true
        });
      fabCanvas.renderAll();
    }


  });
     
  $(document).on("click", "#btn-download", function (e) {
    fabCanvas.deactivateAll().renderAll();

    var sessionData;

    sessionData = checkUser();

    if (appLoggedIn) {
      var fileName = "Showroom_" + moment().format("YYYY-MM-DD-h:mm:ss") + ".png";
      // $("#room-canvas").get(0).toBlob(function(blob){
      $canvas.get(0).toBlob(function(blob){
        saveAs(blob, fileName);
      });
    } else $("#login-modal").modal("toggle");
  });

  $('#btn-save').on('click', function () {
    fabCanvas.deactivateAll().renderAll();

    var sessionData;

    sessionData = checkUser();
    if (appLoggedIn) {

      //prompt user for showroom name if new, or if they want to save as new name
      if (currentShowroom.showroom_name) {
        $("#curr-showroom").text(currentShowroom.showroom_name);
        $("#save-new").addClass("hidden");
        $("#save-existing").removeClass("hidden");
        $("#save-modal").modal("toggle");
      } else {
        $("#save-new").removeClass("hidden");
        $("#save-existing").addClass("hidden");
        $("#save-modal").modal("toggle");
      }
    } else $("#login-modal").modal("toggle");
  });

  function ajaxSaveShowroom(url, parm, type) {
    //send request to save showroom
    $.ajax({
      url: url,
      data: parm,
      method: type
    }).done(function (data) {
      
      $canvas.get(0).toBlob(function(blob){
        var formdata = new FormData();
        formdata.append("blob", blob);
        $.ajax({
          url: "/showrooms/save_tn/" + data.showroom_id,
          method: "POST",
          data: formdata,
          processData: false,
          contentType: false,
        }).done(function(response){
          console.log(response);
        });
        console.log(data);
        saveLayers(data.showroom_id);
      });
    });
  }

  function updateShowroom(url, parm, type) {
    //send request to update showroom
    $.ajax({
      url: url,
      data: parm,
      method: type,
    }).done(function (data) {
      $canvas.get(0).toBlob(function(blob){
        var formdata = new FormData();
        formdata.append("blob", blob);
        $.ajax({
          url: "/showrooms/save_tn/" + data.showroom_id,
          method: "POST",
          data: formdata,
          processData: false,
          contentType: false,
        }).done(function(response){
          console.log(response);
        });
        console.log(data);
      });
    });

  }

  function ajaxSaveLayer(parm) {
    //send request to save showroom
    $.ajax({
      url: "/showrooms/create_layer",
      data: parm,
      method: "POST"
    }).done(function (data) {
      //check for success
      console.log(data);
    });

  }

  function ajaxDelLayers(parm) {
    //send request to delete layers
    $.ajax({
      url: "/showrooms/delete_layers/" + parm,
      method: "DELETE"
    }).done(function (data) {
      //check for success
      console.log(data);
    });

  }

  function ajaxDelLayersAndShowroom(parm, user_id) {
    //send request to delete showrooms

    $.ajax({
      url: "/showrooms/delete_layers/" + parm,
      method: "DELETE"
    }).done(function (data) {
      $.ajax({
        url: "/showrooms/delete_showroom/" + parm,
        method: "DELETE"
      }).done(function (data) {
        getShowrooms(user_id);
      });
    });

  }

  function saveLayers(showroomId) {
    var parmLayer = {
      name: "",
      layer_index: 0,
      height: 0,
      width: 0,
      position_top: 0,
      position_left: 0,
      angle: 0,
      color: "",
      opacity: 0,
      layer_type: "",
      object_type: "",
      object_id: 0,
      flipped: false,
      showroom_id: 0
    };

    //create layers

    var l = fabCanvas.getObjects();

    for (var i = 0; i < l.length; i++) {
      parmLayer.name = l[i].name;
      parmLayer.layer_index = i;
      parmLayer.height = (l[i].scaleY) ? (l[i].height * l[i].scaleY) : l[i].height;
      parmLayer.width = (l[i].scaleX) ? (l[i].width * l[i].scaleX) : l[i].width;
      parmLayer.angle = l[i].angle;
      parmLayer.opacity = (l[i].opacity * 100);
      parmLayer.layer_type = l[i].name;
      parmLayer.position_top = l[i].top;
      parmLayer.position_left = l[i].left;
      if (l[i].name === "color") {
        parmLayer.color = l[i].data.color;
        parmLayer.object_type = "color";
        parmLayer.object_id = 0;
      } else {
        parmLayer.object_type = l[i].data.type;
        parmLayer.object_id = l[i].data.objid;
        parmLayer.color = "";
      }
      parmLayer.flipped = l[i].flipX
      parmLayer.showroom_id = showroomId;
      console.log(parmLayer);
      ajaxSaveLayer(parmLayer);
    }

  }

  $('#save-show').on('click', function () {
    var parmShowroomName = $("#showroom-name").val().trim();
    //reset field
    $("#showroom-name").val("");
    var reqType;
    var parmShowroomId;
    var ajaxURL;
    var showroomReturnData;
    var layerReturnData;
    var parmObj = {
      showroom_id:0,
      showroom_height: 0,
      showroom_width: 0,
      showroom_name: "",
      canvas_id:0,
      file_path: "",
      file_name: "", 
      user_id: 0
    };

    if ((currentShowroom.showroom_name) && ((parmShowroomName == "") || (parmShowroomName == currentShowroom.showroom_name))) {
      //we are updating a current showroom
      parmShowroomId = currentShowroom.id;
      parmShowroomName = currentShowroom.showroom_name;
      reqType = "PUT"
    } else if (!(currentShowroom.showroom_name)) {
      //we are creating a brand new showroom
      parmShowroomId = 0;
      reqType = "POST"
    } else {
      //we are creating a new showroom based on the current showroom (save as)
      parmShowroomId = 0;
      reqType = "POST"
    }

    var sessionData = JSON.parse(sessionStorage.userSession);

    parmObj.showroom_id = parmShowroomId;
    parmObj.showroom_height = fabCanvas.height;
    parmObj.showroom_width = fabCanvas.width;
    parmObj.showroom_name = parmShowroomName;
    parmObj.canvas_id = 1;
    parmObj.file_path = "";
    parmObj.file_name = "";
    parmObj.user_id = sessionData.user_id;

    //create showroom if necessary
    if (reqType == "POST") {
      ajaxURL = "/showrooms/create_showroom";
      ajaxSaveShowroom(ajaxURL, parmObj, reqType);
    } else {
      //delete original layers and save the new ones
      ajaxDelLayers(parmShowroomId);
      saveLayers(parmShowroomId);
      ajaxURL = "/showrooms/update_showroom";
      updateShowroom(ajaxURL, parmObj, reqType);
    }

  });

  // User showrooms
  $("#btn-my-showrooms").on("click", function () {
    var sessionData;

    sessionData = checkUser();

    if (appLoggedIn) {
      getShowrooms(sessionData.user_id);
      $("#my-showrooms-modal").modal("toggle");
    } else $("#login-modal").modal("toggle");
  });

}); // end document ready