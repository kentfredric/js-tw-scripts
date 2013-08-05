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
(function() {
  if ( !document['twx'] ) {
    document['twx'] = {};
  }
  if ( document.twx['resources'] ) {
    return;
  }
  var res = document.twx.resources = {};
  var trun_k = function(xnumber) {
    return Number.toInteger( xnumber / 1000 ) * 1000;
  };

  res.clay = function() {    return Number( $("#stone").text())   };
  res.wood = function() {    return Number( $("#wood").text() )   };
  res.iron = function() {    return Number( $("#iron").text() )   };
  res.pop_limit =       function() {  return Number($("#pop_max_label").text()    ) };
  res.pop_amount =      function() {  return Number($("#pop_current_label").text()) };
  res.warehouse_limit = function() {  return Number($("#storage").text()          ) };
  res.pop_free = function()  {    return res.pop_limit() - res.pop_amount()  };
  res.clay_free = function() {   return res.warehouse_limit() - res.clay()   };
  res.wood_free = function() {   return res.warehouse_limit() - res.wood()   };
  res.iron_free = function() {   return res.warehouse_limit() - res.iron()   };
  res.clay_approx = function() { return trun_k( res.clay() ) }
  res.wood_approx = function() { return trun_k( res.wood() ) }
  res.iron_approx = function() { return trun_k( res.iron() ) }

  res.clay_free_approx = function() {   return trun_k( res.clay_free() )   };
  res.wood_free_approx = function() {   return trun_k( res.wood_free() )   };
  res.iron_free_approx = function() {   return trun_k( res.iron_free() )   };
  
  res.resources = function() {
    return { wood: res.wood(), clay: res.clay(), iron: res.iron() }
  };
  res.resources_free = function() {
    return { wood: res.wood_free(), clay: res.clay_free(), iron: res.iron_free() }
  };
  res.resources_approx = function() {
    return { wood: res.wood_approx(), clay: res.clay_approx(), iron: res.iron_approx() }
  };
  res.resources_free_approx = function() {
    return { wood: res.wood_free_approx(), clay: res.clay_free_approx(), iron: res.iron_free_approx() }
  };

})();

function smart_offensive() {

    var twx = document.twx;
    var budget    = twx.resources.resources();
    budget.pop    = twx.resources.pop_free();

    var lc_in_time = function(t){ return t/( 4+ 10/60 ) };
    var axe_in_time = function(t){ return t/( 2+17/60 ) };
    var cost_lc = function(n){  
      return {
        wood: n * 125,
        clay: n * 100, 
        iron: n * 250,
        pop: n * 4 
      };
    };
    var cost_axe = function(n){
      return {
        wood: n * 60, 
        clay: n * 30, 
        iron: n * 40, 
        pop: n
      };
    };

    var can_afford = function(t) {
      var axes = axe_in_time(t);
      var lcs  = lc_in_time(t);
      var axe_cost = cost_axe(axes);
      var lc_cost  = cost_lc(lcs);
      if ( lc_cost.wood + axe_cost.wood  > budget.wood ) {
          return false;
      }
      if ( lc_cost.clay + axe_cost.clay > budget.clay ) {
          return false;
      }
      if ( lc_cost.iron + axe_cost.iron > budget.iron ) {
          return false;
      }
      if ( lc_cost.pop + axe_cost.pop > budget.pop ) {
          return false;
      }
      return {
        axes: Number.toInteger(axes), 
        lc  : Number.toInteger(lcs)
      };
  };

  var r;
  document.misc.binary_search({
      check: function(i) {
        if ( can_afford(i) ) {
          return document.misc.binary_search.LOW;
        }
        return document.misc.binary_search.HIGH;
      }, 
      on_found: function(i) {
        r = can_afford(i);
      },
  });
  return r;
}
function recruit_offensive() {
  var troops = smart_offensive();
  $("#axe_0").val(troops.axes);
  $("#light_0").val(troops.lc);
  return false;
}
recruit_offensive();
