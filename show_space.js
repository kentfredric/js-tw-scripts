function on_page_overview_villages(callback) {
  var village = document.location.search.match(/village=([^&]+)/);
  var t       = document.location.search.match(/t=([^&]+)/);
  var mode    = document.location.search.match(/mode=([^&]+)/);
  var screen  = document.location.search.match(/screen=([^&]+)/);

  var search  = [];
  if ( screen[1] == 'overview_villages' ) {
    if ( ( !mode ) || ( mode[1] == 'prod' ) ) {
      return callback();
    }
  }
  if ( village ) {
    search.push('village=' + village[1] );
  }
  if ( t ){
    search.push('t=' + t[1] );
  }
  if ( mode ){
    search.push('mode=prod' );
  }
  search.push('screen=overview_villages');
  alert("You were on the wrong page, redirecting you");
  document.location.search = '?' + search.join("&");
  return false;
}

on_page_overview_villages(function(){ 
  $("table#production_table tr td span.grey").remove();
  var modes = {
    basic : { 
      village: 0,
      resources: 2,
      warehouse: 3,
    },
    premium : {
      village: 1,
      resources: 3,
      warehouse: 4
    }
  };
  var mode;
  if ($("table#production_table tr:eq(0) th:eq(2)").text() == "Points" ){
    mode = modes.premium;
    //console.log("mode = premium");
  } else {
    mode = modes.basic;
    //console.log("mode = basic");
  }
  $("table#production_table tr").each(function( index, item ) {
    var tds,name,resources,res_array,space_array,warehouse;
    tds = $("td", item);
    if ( ! tds[mode.village] ){
        return;
    }
    if ( ! tds[mode.resources] ){
        return;
    }
    if ( ! tds[mode.warehouse] ){
        return;
    }
    name      = $(tds[mode.village]).text().trim();
    resources = tds[mode.resources];
    space_array = {
        wood: 0,
        stone: 0,
        iron: 0
    };
    res_array = {
        wood: 0,
        stone : 0,
        iron : 0
    };
    warehouse = Number($(tds[mode.warehouse]).text().trim());
    //console.log({ village: name});
    
    $.each(['wood','stone','iron'],function(i,name) {
        var field = $("span." + name, resources);
        var content = field.text().trim();
        res_array[name] = Number(content);
        space_array[name] = warehouse - res_array[name]
        $("span." + name, resources).text(space_array[name]);
    });
  });
});
