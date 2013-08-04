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
  $("table#production_table tr").each(function( index, item ) {
    var tds,name,resources,res_array,space_array,warehouse;
    tds = $("td", item);
    if ( ! tds[0] ){
        return;
    }
    if ( ! tds[2] ){
        return;
    }
    if ( ! tds[3] ){
        return;
    }
    name      = $(tds[0]).text().trim();
    resources = tds[2];
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
    warehouse = Number($(tds[3]).text().trim());
    
    $.each(['wood','stone','iron'],function(i,name) {
        var field = $("span." + name, resources);
        var content = field.text().trim();
        res_array[name] = Number(content);
        space_array[name] = warehouse - res_array[name]
        $("span." + name, resources).text(space_array[name]);
    });
  });
});
