/**

document.twx.set_page( config , function() { 
 --  code  --
});

CONFIG:

Config is a { } containing parameters that should be present on the page.

ie:

  document.twx.set_page({ screen: 'overview'}, function() {

  });


If the user is not on a page with `screen=overview`

  1. User is prompted to redirect to a page with `screen=overview`
  -> 1.1 If user OK's, user is redirected.
     -> END
  -> 1.2 If user cancels, user is prompted to run the script anyway
     -> 1.2.1 If user Oks, script is run
        -> END
     -> 1.2.2 If user Cancels, script is not run.

If the user *IS* on a page with `screen=overview`, the script runs without asking for confirmation.

REDIRECTION:

The redirection mechanism aims to preserve as many as possible of the previous addresses parameters.

This includes, but is not limited to `village=` and `t=`, so unless those specific parameters
are overridden, they will be preserved, keeping the village and sitting session wherever possible.

*/

(function() {
  if ( !document['twx'] ) {
    document['twx'] = {}
  }
  if ( document.twx['set_page'] ) {
    return;
  }
  var get_param_regex = function(param) {
    return new Regexp(param + '=([^&]*)' );
  };
  var get_param = function( param, search ) {
    var matches = search.match(get_param_regex(param));
    if ( !matches ) {
      return false;
    }
    return matches[ matches.length - 1 ];
  };
  var get_all_params = function( search ) {
    var out = {};
    var params;
    var match = search.match(/\?(.*$)/);
    if ( ! match ) {
      return out;
    }
    params = match[1];
    var param_parts = params.split(/[&;]/);
    $.each(param_parts, function( idx, val ) {
      var match = val.match(/^([^=]+)=(.*$)/);
      if ( match ) {
        out[match[1]] = match[2];
      }
    });
    return out;
  };
  var hash_to_params = function( hash ) {
    var out = '?';
    var outlist = [];
    $.each(hash, function(key, value) { 
      outlist.push(key + '=' + value );
    });
    return '?' + outlist.join('&');
  };
  document.twx.set_page = function(wanted_page,callback) {
    var current_page = get_all_params(document.location.search);
    var should_redirect = false;
    var new_params = {};
    if ( not callback ){ 
      callback = function() { };
    }
    $.each(current_page, function( key, value ) {
      new_params[key] = value;
    });
    $.each(wanted_page, function( key, value ){
      if ( current_page[key] != value ) {
        should_redirect = true;
        new_params[key] = value;
      }
    });
    var new_search = hash_to_params(new_params);
    if ( should_redirect ) {
      var redirect = confirm("You should be on page: " + new_search + ", redirect?");
      if ( redirect ) {
          document.location.search = new_search;
          return;
      }
      var run_script = confirm("The script that requested redirection may not work, run anyway?");
      if ( run_script ){
          callback();
          return;
      }
    }
    callback();
    return;
  };
})();
