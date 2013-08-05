(function(){ 
  if ( !document['misc'] ) {
    document['misc'] = {};
  }
  if ( document.misc['binary_search'] ) {
    return false;
  }

  var blob = {};

  blob.HIGH = 0;
  blob.LOW  = 1;

  blob.search = function( config ) {
    if ( typeof config == 'undefined'){
        throw "please specify <config> in binary_search(<config>)";
    }
    if ( !config['min_step'] ) {
      config['min_step'] = 1;
    }
    if ( !config['min'] ) {
      config['min'] = 0;
    }
    if ( !config['max'] ) {
      config['max'] = 60 * 24 * 7;
    }
    if ( !config['check'] ) {
      throw "parameter 'check' required";
    }
    if ( !config['on_found'] ) {
      throw "parameter 'on_found' required";
    }
    var left = config.min;
    var right = config.max;
    var prev_right = right;
    var prev_left  = left;
    var threshold = config.min_step;

    while( ( right - left ) > threshold ) {
      var test_right = Number.toInteger( right - ( ( right - left ) / 2 ) );
      var test_left  = Number.toInteger( left + (  ( right - left  ) / 2 ) );
      if ( config.check(test_right) == blob.HIGH ) {
        right = test_right;
        continue;
      } else {
        left = test_left;
        continue;
      }
    }
    config.on_found(left);
  };
  document.misc['binary_search'] = blob.search;
  document.misc.binary_search['HIGH'] = blob.HIGH;
  document.misc.binary_search['LOW'] = blob.LOW;

})();


/*
Exception: right_check is not defined
blob.search@Scratchpad/6:47
@Scratchpad/6:69
*/
/*
Exception: missing } after property list
@Scratchpad/6:63
*/
