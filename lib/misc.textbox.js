(function(){ 
  if ( !document['misc'] ) {
    document['misc'] = {};
  }
  if ( document.misc['textbox'] ) {
    return;
  }
  var textbox_util = function(object) {
    var methods = {};
    methods.print = function(message) {
        var text = document.createTextNode(message);
        $(object).append(text);
    };
    methods.print_length = function(message,length) {
        if ( message.length < length ) {
            var d = length - message.length
            var i;
            for ( i = 0; i < d; i++ ) {
                d = d + " ";
            }
            return methods.print(d);
        }
        return methods.print(message.substr(0,length));
    };
    methods.print_length_right = function(message,length) {
        if ( message.length < length ) {
            var d = length - message.length
            var i;
            for ( i = 0; i < d; i++ ) {
                d = " " + d ;
            }
            return methods.print(d);
        }
        return methods.print(message.substr(0,length));
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


