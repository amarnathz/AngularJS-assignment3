(function () {
  angular
    .module("app", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService)
    .directive("foundItems", FoundItems)
    .constant("ApiPath", "https://davids-restaurant.herokuapp.com");

  function FoundItems() {
    var ddo = {
      templateUrl: "loader/itemsloaderindicator.template.html",
      scope: {
        foundItem: "<",
        onEmpty: "<",
        onRemove: "&",
      },
      controller: NarrowItDownController,
      controllerAs: "menu",
      bindToController: true,
    };
    return ddo;
  }

  NarrowItDownController.$infect = ["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.input_item = "";
    menu.found = [];

    menu.searchmenu = function () {
      // console.log(menu.input_item);
      // console.log(MenuSearchService); check service property

      if (menu.input_item.trim().length > 0) {
        var pormise = MenuSearchService.getMatchedMenuItems(menu.input_item);

        //  console.log(pormise);

        pormise.then(function (res) {
          if (res.length == 0) {
            menu.msg = "Nothing Found....";
          } else {
            menu.msg = "";
            menu.found = res;
          }
        });

        //console.log("2", menu.found);
      } else {
        menu.msg = "Please Enter item for Menu Choice";
      }
    };

    menu.removeItem = function (ind) {
      menu.found.splice(ind, 1);
    };
  }

  MenuSearchService.$inject = ["$http", "ApiPath"];
  function MenuSearchService($http, ApiPath) {
    var ser = this;
    ser.getMatchedMenuItems = function (searchItem) {
      var found = [];
      var res = $http({
        method: "GET",
        url: ApiPath + "/menu_items.json", ///menu_items.json
      })
        .then(function (response) {
          //console.log(response.data.menu_items);

          //   console.log(response.data.menu_items[0]["description"]);

          for (var i = 0; i < response.data.menu_items.length; i++) {
            if (
              response.data.menu_items[i]["description"]
                .toLowerCase()
                .indexOf(searchItem) != -1
            ) {
              found.push(response.data.menu_items[i]);
            }
          }
          //console.log("1", found);

          return found; ///return with value to promise
        })
        .catch(function (response) {
          ///  throw new Error("Error for url");
          console.log(response);
        });

      return res; //return promise
    };
  }
})();
