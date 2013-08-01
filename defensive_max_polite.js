function smart_offensive() {

    var budget     = {
      wood: Number( $("#wood").text() ), 
      clay: Number($("#stone").text()), 
      iron: Number($("#iron").text()), 
      pop:  Number($("#pop_max_label").text()) - Number($("#pop_current_label").text())
    };

    var hc_in_time = function(t){ return t/( 8 + 19/60 ) }
    var spear_in_time = function(t){ return t/( 1 + 46/60 ) }
    var sword_in_time = function(t){ return t/( 2 + 36/60 ) }

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

    var cmp_prop = function(prop,spear,sword,hc,budget) {
      return spear[prop] + sword[prop] + hc[prop] > budget[prop];
    };


    var can_afford = function(t) {
      var spears  = spear_in_time(t/2);
      var swords = sword_in_time(t/2);
      var hc     = hc_in_time(t);

      var spears_cost = cost_spear(spears);
      var swords_cost = cost_sword(swords);
      var hc_cost     = cost_hc(hc);

      if (cmp_prop('wood', spears_cost, swords_cost, hc_cost, budget)) {
          return false;
      }
      if (cmp_prop('clay', spears_cost, swords_cost, hc_cost, budget)) {
          return false;
      }
      if (cmp_prop('iron', spears_cost, swords_cost, hc_cost, budget)) {
          return false;
      }
      if (cmp_prop('pop', spears_cost, swords_cost, hc_cost, budget)) {
          return false;
      }
      return {
        spears: Number.toInteger(spears), 
        swords  : Number.toInteger(swords),
        hc  : Number.toInteger(hc)
      };
  };

  var i = 1;
  var pi = i;

  while( can_afford(i) ) {
      pi = i;
      i = i * 2;
  }
  var si = pi;
  while( can_afford(pi) ) {
    si = pi;
    pi = pi + 1;
  }
  return can_afford(si);
}
function recruit_offensive() {
  var troops = smart_offensive();
  $("#spear_0").val(troops.spears);
  $("#sword_0").val(troops.swords);
  $("#heavy_0").val(troops.hc);
  return false;
}
recruit_offensive();
