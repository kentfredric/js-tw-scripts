(function(){ 
  if ( !document['misc'] ) {
    document['misc'] = {};
  }
  if ( document.misc['textbox'] ) {
 //   return;
  }
  var textbox_util = function(object) {
    var methods = {};
    methods.print = function(message) {
        var text = document.createTextNode(message);
        $(object).append(text);
    };
    methods.print_length = function(message,length) {
        var m = message.toString();
        if ( m.length < length ) {
            var d = length - m.length
            var i;
            for ( i = 0; i < d; i++ ) {
                m = m + " ";
            }
            return methods.print(m);
        }
        return methods.print(m.substr(0,length));
    };
    methods.print_length_right = function(message,length) {
        var m = message.toString();
        if ( m.length < length ) {
            var d = length - m.length
            var i;
            for ( i = 0; i < d; i++ ) {
                m = " " + m ;
            }
            return methods.print(m);
        }
        return methods.print(m.substr(0,length));
    };
    methods.println = function() {
        methods.print("\r\n");
    };
    return methods;
  };
  

  document.misc.textbox = function() {
    var search = $("#user_debug_textbox");
    if ( search.length ) {
      return textbox_util(search);
    }
    var container = document.createElement("div");
    $(container).css({ 
        width: '800px', 
        height: '600px', 
        position: 'absolute', 
        left: 0, 
        top: 0, 
        padding: '5px 10px', 
        'z-index': 1000000,
        'background-color': 'rgba(50,50,50,0.5)',
        border: '1px solid green',
    });
    var txa = document.createElement("textarea");
    $(txa).attr({ id: "user_debug_textbox" });
    $(txa).css({ width: '790px', height: '580px' });
    $(container).append(txa);
    $(container).appendTo($("body"));
    $(txa).click(function() {
        return false;
    });
    $(container).click(function(){ 
        $(container).remove();
    });
    return textbox_util($(txa));
  };

})();


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
  var tb = document.misc.textbox();

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
    });
    tb.print_length(name, 20);
    $.each(['wood','stone','iron'], function(i,name) {
      tb.print(" ");
      var approx = Number.toInteger( Number(space_array[name] / 1000 ) ) * 1000;
      tb.print_length_right(approx, 8);
    });
    tb.println();
  });
});
