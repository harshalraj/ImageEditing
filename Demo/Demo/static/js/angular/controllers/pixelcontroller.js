angular.module('pixel.controllers', ['ngMaterial', 'ngMessages', 'md.time.picker'])
    .config(function ($mdIconProvider) {
        $mdIconProvider
          .iconSet('device', 'img/icons/sets/device-icons.svg', 24);
    })
    .controller("pixelController", ['$scope', 'pixelService', '$http', '$mdpTimePicker', function ($scope, pixelService, $http) {

        /////////////////FETCH API DATA
        loadImages();
        //loadCategories();

        $scope.templateprice = 'template-price-hidden';



        $scope.venueSize1 = 25000;
        
      

        $scope.updateCircle = function (venueSize) {
            circle.setRadius(Number(venueSize * 0.092903));
            $scope.venueSize1 = venueSize;
        }
        
         /************************** Watch on venue size**********************/

        $scope.$watch('venueSize', function (value) {
            $scope.updateCircle(value);
        });

        //$scope.dateObj;
        //$scope.eventdate;
        //$scope.eventtime;
        //$scope.duration;
        //$scope.geofilterType;

        $scope.eventdate = new Date();
        $scope.minDate = new Date(
           $scope.eventdate.getFullYear(),
           $scope.eventdate.getMonth() ,
           $scope.eventdate.getDate()+1);



        $scope.message = {
            hour: 'Hour is required',
            minute: 'Minute is required',
            meridiem: 'Meridiem is required'
        }


        $scope.color = {
            red: Math.floor(Math.random() * 255),
            green: Math.floor(Math.random() * 255),
            blue: Math.floor(Math.random() * 255)
        };

        //  $scope.rating = 4;



        //GLOBAL VARIABLES FOR MODAL FLAGS
        $scope.showModalText = false;
        $scope.showModalElement = false;
        $scope.showModalCategory = false;
        $scope.buttonClicked = "";


       
        //$("#demo").on("dp.change", function () {

        //    $scope.eventdate = $("#demo").val();
        //    alert("selected date is " + $scope.eventdate);

        //});

        ////////////////////////////////////////////////////MODAL FUNCTION FLAG HANDLING
        $scope.toggleModal = function (btnClicked) {
            $scope.buttonClicked = btnClicked;

            if (btnClicked == "ADD TEXT") {
                $scope.showModalText = !$scope.showModalText;
            }

            if (btnClicked == "ADD ELEMENT") {
                $scope.showModalElement = !$scope.showModalElement;
            }

            if (btnClicked == "REMOVE ELEMENT") {
                $scope.removeElement();
            }

            if (btnClicked == "CATEGORIES") {
                $scope.showModalCategory = !$scope.showModalCategory;
            }

            if (btnClicked == "THANKSGIVING") {
                $scope.getCategory("Thanksgiving");
            }

            if (btnClicked == "BIRTHDAY") {
                $scope.getCategory("Birthday");
            }

            if (btnClicked == "WEDDING") {
                $scope.getCategory("Wedding");
            }
        };



        //SET FABRIC PROPERTIES
        fabric.Object.prototype.set({
            centeredScaling: true,
            cornerStyle: 'circle',
            borderColor: 'green',
            cornerColor: 'rgba(41, 181, 168, 1)',
            transparentCorners: false,
            cornerStrokeColor: 'rgba(41, 181, 168, 1)',
            borderDashArray: [2, 2]
        });

        //SET CANVAS PROPERTY VARIABLES
        var canvas = new fabric.Canvas('canvas');
        canvas.width = 1080;              // actual size given with integer values
        canvas.height = 1920;
        canvas.selectionColor = 'rgba(41, 181, 168, .3)';




        /********************************* GET TEXT**********/
        //Get text from pop up 
        $scope.getText = function (event) {

            //Create text box
            var textbox = new fabric.IText('Click to Edit', {
                left: 50,
                top: 50,
                fontFamily: 'Helvetica',
                fill: '#333',
                lineHeight: 1.1,

            });

            textbox.setControlsVisibility({
                mr: false,
                ml: false,
                mt: false,
                mb: false,
            });

            //add to canvas
            canvas.add(textbox).setActiveObject(textbox);

            //load font with font id came 
            loadAndUse(event.target.id);


        }
        //FUNCTION FOR LOADING FONT
        function loadAndUse(font) {
            var myfont = new FontFaceObserver(font)
            myfont.load()
              .then(function () {
                  // when font is loaded, use it.
                  canvas.getActiveObject().set("fontFamily", font);
                  canvas.requestRenderAll();
              }).catch(function (e) {
                  console.log(e)
                  alert('Please select and editable text.' + font);
              });
        }
        /********************* GET ELEMENT ***********************/
        $scope.getElement = function (url) {
            fabric.Image.fromURL(url, function (Img) {
                Img.scaleToWidth(200);
                Img.scaleToHeight(300);
                Img.setControlsVisibility({
                    mr: false,
                    ml: false,
                    mt: false,
                    mb: false,
                });

                canvas.add(Img);

            });
        }
        
        /**************************************** Send Paypal Response **************/
        $scope.sendResp = function (id) {
            var baseUrl = canvas.toDataURL();
            pixelService.makePurchase(id, $scope.location, $scope.venueSize, $scope.eventdate, $scope.eventtime, $scope.duration, $scope.geofilterType, $scope.email, baseUrl).then(function () {
                console.log("purchase made");
            });
        }
        
        /****************************************UPLOAD IMAGE TO CANVAS*************/


        document.getElementById('imgLoader').onchange = function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {

                var imgObj = new Image();
                imgObj.src = event.target.result;
                imgObj.onload = function () {
                    // start fabricJS stuff

                    var image = new fabric.Image(imgObj);
                    image.set({
                        top: 250,
                    });
                    image.scaleToWidth(200);
                    image.scaleToHeight(300);
                    image.setControlsVisibility({
                        mr: false,
                        ml: false,
                        mt: false,
                        mb: false,
                    });

                    //
                    canvas.add(image);


                    // end fabricJS stuff
                }

            }
            reader.readAsDataURL(e.target.files[0]);
        }

        /************************** Save image ******************************/


        /************************** CHANGE FONT OF EDITABLE TEXT*************/

        $scope.getFont = function (event) {
            loadAndUse(event.target.id); //USING PREVIOUS FUNCTION OF FONT ASSIGNING IN CANVAS
        }


        /**************************** Remove Element on canvas *****************/

        $scope.removeElement = function () {
            // console.log("removed");
            //
            if (canvas.getActiveObject()) {
                //for single element deletion
                canvas.remove(canvas.getActiveObject());

            }

        }
        $scope.saveImage = function () {
            var baseUrl = canvas.toDataURL();
            pixelService.saveImage(baseUrl);
        }
        /*********************************Cahnge color of active object ********/

        $scope.setObjectColor = function (color) {

            if (canvas.getActiveObject() != null) {
                if (canvas.getActiveObject().get('type') == 'i-text') {
                    canvas.getActiveObject().set({ fill: color })
                    canvas.renderAll();
                }
            }
        }
        /*****************************************SHOW PREVIEW TO CANVAS*******/

        $scope.preview = false;
        $scope.canvasBackground = "/static/images/Transparent_Background.png";
        $scope.showPreview = function () {
            //if preview button is on then only place image
            if (!$scope.preview) {
                $scope.canvasBackground = $scope.previewurl;
                $scope.preview = true;  //preview on
            }
            else {
                $scope.canvasBackground = "/static/images/Transparent_Background.png";
                $scope.preview = false;         //preview off
            }
        }

        //Changes preview based on template selected
        $scope.changePreview = function (url) {
            $scope.canvasBackground = "/static/images/templates/R9.jpg"

        }

        /***************************Add TEMPLATE image to canvas**************/

        $scope.background = false;
        $scope.myImg = {};
        $scope.price = 5;
        $scope.addImage = function (url, price,previewurl) {
            $scope.price = parseFloat(price.substring(1));
            $scope.previewurl = previewurl;
            if ($scope.background) {
                canvas.remove($scope.myImg);
            }

            if (url == '/static/images/templates/scratch.jpg') {
                //Remove every template if scratch is called
                canvas.remove($scope.myImg);
            }
            else {


                //code to change preview of filter based on template selected
                //must be called always rather preview is on or off
                // $scope.changePreview(templatePreviewurl);

                //code to fetch filter based on selection 
                //from api yet to be doen :P 
                //probably make an api which will fetch filter based on the template selected


                fabric.Image.fromURL(url, function (myImg) {


                    myImg.scaleToWidth(351);
                    myImg.scaleToHeight(624);
                    $scope.myImg = myImg;
                    myImg.set({ selectable: true })

                    canvas.add(myImg);
                    canvas.sendToBack(myImg);
                    //bug resolved :)
                    $scope.background = true;
                    //$scope.saveImage();
                });
            }
        }

        /****************************CATEGORY MODAL CHANGE EVENT**********/
        //Category Flag
        $scope.categoryClicked = false;
        //flag to show category on header of template which is selected (handled through angular)
        $scope.selectedCategory = "";
        //CAtegory tagline to show on header = comes from db table of category assigned in local object
        $scope.categoryTagline = "";

        $scope.getCategory = function (category) {

            //SCategory header appears 
            pixelService.getImageUrl(category).then(function (response) {
                // console.log(category);
                //local variables                  
                var count = 0;
                var data = [];
                //for template images
                var urls = response.data.images;
                var cost = response.data.cost;
                var toLoad = response.data.toLoad;
                $scope.arrayOfArrays = [];
                for (var i = 0; i < urls.length; i++) {
                    var urlObj = {};
                    urlObj.url = urls[i];
                    urlObj.price = cost[i];
                    urlObj.canvas = toLoad[i];
                    data.push(urlObj);
                    count++;
                    if (count == 3 || i == urls.length - 1) {
                        $scope.arrayOfArrays.push(data);
                        count = 0;
                        data = [];
                    }
                }

                //for element images
                var elements = response.data.elements;
                $scope.arrayOfElements = [];
                for (var i = 0; i < elements.length; i++) {
                    data.push(elements[i]);
                    count++;
                    if (count == 3 || i == elements.length - 1) {
                        $scope.arrayOfElements.push(data);
                        count = 0;
                        data = [];
                    }
                }

            });
            $scope.categoryClicked = true;


            //Assign cateogry which called
            $scope.selectedCategory = category;

            pixelService.getCategory().then(function (response) {
                // $scope.categories = ['Thanksgiving', 'Birthday', 'Wedding', 'Bachelorette', 'Christmas', 'BridalShower', 'Celebration', 'Business', 'Baby Shower', 'College', 'Kids', 'Generic'];
                $scope.categories = response.data.name;
                var index = $scope.categories.indexOf(category);
                $scope.categoryTagline = response.data.description[index];
                console.log(index);
                //load categories with their tag line (make json) and assign it to object which can be used in diffrent functions 
                //console.log($scope.categories);
            });
            //Assign tagline from db extracting from db table of category

            // console.log("category clicked  " + category + "  this");



        }

        /**********************************LOADING ANIMATION GIF FUNCTION**********/
        //loading flag
        $scope.loading = false;
        $scope.categories = [];
        $scope.elements = {};
        /**********************************API CALLS****************/
        //LOADING IMAGES THROUGHOUT THE APPLICATION API CALLS
        function loadImages(category) {
            pixelService.getImageUrl('all').then(function (response) {
                //local variables                  
                var count = 0;
                var data = [];

                //for template images
                var urls = response.data.images;
                var price = response.data.cost;
                var toLoad = response.data.toLoad;
                $scope.arrayOfArrays = [];
                for (var i = 0; i < urls.length; i++) {
                    var urlObj = {};
                    urlObj.url = urls[i];
                    urlObj.price = price[i];
                    urlObj.canvas = toLoad[i];
                    data.push(urlObj);
                    count++;
                    if (count == 3 || i == urls.length - 1) {
                        $scope.arrayOfArrays.push(data);
                        count = 0;
                        data = [];
                    }
                }

                //for element images
                $scope.elements = response.data.elements;
                var elements = response.data.elements.Balloons;
                $scope.arrayOfElements = [];
                for (var i = 0; i < elements.length; i++) {
                    data.push(elements[i]);
                    count++;
                    if (count == 3 || i == elements.length - 1) {
                        $scope.arrayOfElements.push(data);
                        count = 0;
                        data = [];
                    }
                }

            });

            pixelService.getCategory().then(function (response) {
                // $scope.categories = ['Thanksgiving', 'Birthday', 'Wedding', 'Bachelorette', 'Christmas', 'BridalShower', 'Celebration', 'Business', 'Baby Shower', 'College', 'Kids', 'Generic'];
                $scope.categories = response.data.name;
                var index = $scope.categories.indexOf(category);
                $scope.categoryTagline = response.data.description[index];
                //  console.log(index);
                //load categories with their tag line (make json) and assign it to object which can be used in diffrent functions 
                //console.log($scope.categories);
            });

        }

        //LOADING CATEOGRY LIST IN ARRAY

        //function loadCategories() {
        //    pixelService.getCategory().then(function (response) {
        //        // $scope.categories = ['Thanksgiving', 'Birthday', 'Wedding', 'Bachelorette', 'Christmas', 'BridalShower', 'Celebration', 'Business', 'Baby Shower', 'College', 'Kids', 'Generic'];
        //        $scope.categories = response.data.name;
        //        $scope.categoryTagline = response.data.description[$scope.categoriesindexOf(cat)];
        //        //load categories with their tag line (make json) and assign it to object which can be used in diffrent functions 
        //        //console.log($scope.categories);
        //    });
        //}

        /***************************************POPUP CHECKOUT FUNCTIONS *********************/

        //set preview image
        $scope.setPreviewFilter = function () {



            var image = new Image(216, 384);
            image.id = "pic"
            image.src = canvas.toDataURL();
            var old_image = document.getElementById('image_for_crop');   // Get the <ul> element with id="myList"
            old_image.removeChild(old_image.childNodes[0]);

            document.getElementById('image_for_crop').appendChild(image);

        }


        $scope.LocationClass = 'progress-done progress-current';
        $scope.DetailClass = 'progress-todo';
        $scope.SubmitClass = 'progress-todo';

        $scope.LocationSetFlag = false;
        $scope.DetailsSetFlag = false;
        $scope.PaySubmitSetFlag = false;

        $scope.setLocationClass = function () {
            if ($scope.location != null) {
                $scope.LocationSetFlag = true;
                $scope.LocationClass = 'progress-done';
                $scope.DetailClass = 'progress-done progress-current';
            }
            else {
                alert("Please enter a valid location");
            }
        }

        $scope.backLocationClass = function () {
            $scope.LocationSetFlag = false;
            $scope.LocationClass = 'progress-done progress-current';
            $scope.DetailClass = 'progress-todo';
        }

        $scope.setDetailClass = function () {
            var eventdate = true;
            var eventtime = true;
            var geofilter = true;
            var duration = true;
            if ($scope.eventdate==null) {
                alert('Please select event date');
                eventdate = false;
            }
            if ($scope.eventtime == null) {
                alert('Please select event time');
                eventtime = false;
            }
            if ($scope.geofilterType == null) {
                alert('Please select geofilterType');
                geofilter = false;
            }
            if ($scope.duration == '') {
                alert('Please select duration');
                duration = false;
            }
            if (eventdate) {
                $scope.eventdate = moment($scope.dateObj).format('Do MMMM, YYYY');
                console.log($scope.eventdate);
            }
            if (eventtime) {
                $scope.eventtimeForDB = moment($scope.eventtime).format("h:mm A");
            }

            if (event && eventtime && geofilter && duration) {
                $scope.DetailsSetFlag = true;
                $scope.DetailClass = 'progress-done';
                $scope.SubmitClass = 'progress-done  progress-current';
            }



        }

        $scope.backDetailClass = function () {
            $scope.DetailsSetFlag = false;
            $scope.DetailClass = 'progress-done  progress-current';
            $scope.SubmitClass = 'progress-todo';
            //myVar = setTimeout(5000);
            google.maps.event.trigger(map, 'resize');
        }
        $scope.emailFlag = false;
        $scope.setSubmitClass = function (id) {

            $scope.emailFlag = true;

            if ($scope.email == null) {
                alert('Please enter email');
                $scope.emailFlag = false;
            }

            if ($scope.emailFlag) {
                $scope.SubmitClass = 'progress-done';
                var baseUrl = canvas.toDataURL();
                pixelService.makePurchase(id, $scope.location, $scope.venueSize, $scope.eventdate, $scope.eventtimeForDB, $scope.duration, $scope.geofilterType, $scope.email, baseUrl).then(function (response) {
                    console.log("purchase made");
                });
            }
            //pixelService.insertorderDetails(location, $scope.venueSize1, eventdate, eventtime, duration, geofilterType, email).then(function (response) {
            //    var orderid = response.data;
            //    $scope.saveImage();
            //    pixelService.sendEmail(email, orderid);
            //});
        }



        $scope.loadElement = function (category) {
            var data = [];
            var count = 0;
            //for element images
            $scope.noElementFlag = false;
            var elements = $scope.elements[category];
            $scope.arrayOfElements = [];
            for (var i = 0; i < elements.length; i++) {
                data.push(elements[i]);
                count++;
                if (count == 3 || i == elements.length - 1) {
                    $scope.arrayOfElements.push(data);
                    count = 0;
                    data = [];

                }
            }
            //console.log($scope.arrayOfElements);
        }

        $scope.noElementFlag = false;

        $scope.getElementByCat = function (category) {
            if (category.length > 0) {
                var data = [];
                var count = 0;
                pixelService.getElementByCat(category).then(function (response) {
                    var elements = response.data.elements;

                    if (elements.length > 0) {

                        $scope.noElementFlag = false;
                        $scope.arrayOfElements = [];
                        for (var i = 0; i < elements.length; i++) {
                            data.push(elements[i]);
                            count++;
                            if (count == 3 || i == elements.length - 1) {
                                $scope.arrayOfElements.push(data);
                                count = 0;
                                data = [];

                            }
                        }

                    }
                    else {

                        $scope.noElementFlag = true;
                        //console.log($scope.noElementFlag);
                    }

                });
            }
            //SCategory header appears 


        }

    }]);

