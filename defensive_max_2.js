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

    var hc_in_time = function(t){ return t/( 8 + 19/60 ) }
    var spear_in_time = function(t){ return t/( 1 + 46/60 ) }
    var sword_in_time = function(t){ return t/( 2 + 36/60 ) }
    var arch_in_time  = function(t){ return t/( 3 + 7/60  ) }

    var cost_hc = function(n) {
      return {
        wood: n * 200,
        clay: n * 150,
        iron: n * 600,
        pop: n * 6
      }
    };
    var cost_spear = function(n){ 
      return {
        wood: n * 50,
        clay: n * 30,
        iron: n * 10,
        pop: n
      }
    };
    var cost_sword = function(n){ 
      return {
        wood: n * 30,
        clay: n * 30,
        iron: n * 70,
        pop: n
      }
    };
    var cost_arch = function(n) {
      return {
        wood: n * 100,
        clay: n * 30,
        iron: n * 60,
        pop: n
      }
    };

    var cmp_prop = function(prop,spear,sword,arch,hc,budget) {
      return spear[prop] + sword[prop] + arch[prop] + hc[prop] > budget[prop];
    };


    var can_afford = function(t) {
      var spears  = spear_in_time(t * 0.4);
      var swords = sword_in_time(t * 0.1);
      var arch   = arch_in_time( t * 0.5);
      var hc     = hc_in_time(t);

      var spears_cost = cost_spear(spears);
      var swords_cost = cost_sword(swords);
      var arch_cost   = cost_arch(arch);
      var hc_cost     = cost_hc(hc);

      if (cmp_prop('wood', spears_cost, swords_cost, arch_cost, hc_cost, budget)) {
          return false;
      }
      if (cmp_prop('clay', spears_cost, swords_cost, arch_cost, hc_cost, budget)) {
          return false;
      }
      if (cmp_prop('iron', spears_cost, swords_cost, arch_cost, hc_cost, budget)) {
          return false;
      }
      if (cmp_prop('pop', spears_cost, swords_cost, arch_cost, hc_cost, budget)) {
          return false;
      }
      return {
        spears: Number.toInteger(spears), 
        swords  : Number.toInteger(swords),
        archers : Number.toInteger(arch),
        hc  : Number.toInteger(hc)
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
  $("#spear_0").val(troops.spears);
  $("#sword_0").val(troops.swords);
  $("#archer_0").val(troops.archers);
  $("#heavy_0").val(troops.hc);
  return false;
}
recruit_offensive();
