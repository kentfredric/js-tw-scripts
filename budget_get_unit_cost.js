/** ------------------------

  ABSTRACT:

    A low level glue layer to extract troop cost information from the 'recruit' page.

  Usage:

  $.ajaxSetup({ cache: true });
  $.getScript("http://kentfredric.github.io/js-tw-scripts/budget_get_unit_cost.js", function(){
    -- call methods here --
  });
  void(0);

*/


if ( !document['budgeting'] ) {
  document['budgeting'] = {};
}

/**
  ==  document.budgeting.get_unit_cost( unit ) ==

    The following values of 'unit' are recognised:

      - spear
      - sword
      - axe
      - archer
      - scout
      - lc
      - ma
      - hc
      - ram
      - cat

    Returns:

      { name: <unitname>, wood: <woodcost>, clay: <claycost>, iron: <ironcost>, pop: <popcost>, time: <timecost in minutes> }
*/


(function(){
  if ( document['budgeting']['get_unit_cost'] ) {
    return false;
  }
  var scrape_map = {
    "Spear fighter": "spear",
    "Swordsman": "sword",
    "Axeman": "axe",
    "Archer": "archer",
    "Scout": "scout",
    "Light cavalry": "lc",
    "Mounted archer":"ma",
    "Heavy cavalry":"hc",
    "Ram":"ram",
    "Catapult":"cat"
  };

  var format_name = function(value){
    if ( scrape_map[value] ) {
      return scrape_map[value];
    }
    return value;
  };

  var format_numeric = function(value) {
    return Number(value);
  };

  var format_time = function(value) {
    var time_parts = String(value).split(/:/);
    return ( Number(time_parts[0]) * 60 )
                  + Number(time_parts[1]) +
                  ( Number(time_parts[2]) / 60 );

  };

  var recruit_cell_positions = [
    { name: 'name', format: format_name },
    { name: 'wood', format: format_numeric },
    { name: 'clay', format: format_numeric },
    { name: 'iron', format: format_numeric },
    { name: 'pop',  format: format_numeric },
    { name: 'time', format: format_time },
  ];

  var row_to_costs = function (row) {
    var info = {};
    $("td", row ).each(function( td_id, td ) {
      if ( !recruit_cell_positions[ td_id ] ) {
        return false;
      }
      var rules = recruit_cell_positions[ td_id ];
      info[ rules.name ] = rules.format( $(td).text().trim() );
    });
    return info;
  };

  var get_unit_costs = function() {
    var table = $("form#train_form table.vis");
    if ( !table.length ){
      alert("Error: budget_get_unit_cost.js works *ONLY* on the recruitment page");
    }
    var intel = {  };

    var scrape_row = function(row_id, row ) {
      var row_intel = row_to_costs(row);
      intel[ row_intel.name ] = row_intel;
    };
    $("tr.row_a",table).each(scrape_row);
    $("tr.row_b",table).each(scrape_row);
    return intel;
  };

  var unit_costs = get_unit_costs();

  document['budgeting']['get_unit_cost'] = function(unit) {
    if ( !unit_costs[unit] ) {
      return false;
    }
    return unit_costs[unit];
  };

  return false;
})();
/*
  == document.budgeting.get_unit_cost_times( unit, amount ) ==

  As with `get_unit_cost`, except multiplies costs by amount
  and returns slightly differently:

    { name: <unitname>, amount: <amount>, cost: {
        wood: <woodcost>, ... etc.
    }}

*/

(function(){
  if ( document['budgeting']['get_unit_cost_times'] ) {
    return false;
  }
  document['budgeting']['get_unit_cost_times'] = function ( unit, number ) {
    var single = document.budgeting.get_unit_cost(unit);
    return {
      name: unit,
      amount: number,
      cost: {
        wood: single.wood * number,
        clay: single.clay * number,
        iron: single.iron * number,
        pop: single.pop * number,
        time: single.time * number,
      }
    };
  };

})();
