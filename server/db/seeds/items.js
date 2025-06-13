exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return knex('items').insert([
        {task: 'Drink a Mana Potion',     
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Todo',
        sortingid: 1},
        {task: 'Wield Staff of Light',     
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Doing',
        sortingid: 2},
        {task: 'Summon Shroud of the Pantheon',     
        priority: 'Low',
        description: 'Assigned by Jon',
        type: 'Done',
        sortingid: 3},
        {task: 'POOOOP',     
        priority: 'High',
        description: 'Have to poop suuuper bad; Assigned by Renee',
        type: 'Todo',
        sortingid: 4},
        {task: 'Eat Popcorn',     
        priority: 'Medium High',
        description: 'Is that one word? Assigned by Jamie',
        type: 'Todo',
        sortingid: 5},
        {task: 'Build a Tree House',     
        priority: 'High',
        description: 'Make it cool; Assigned by Chaz',
        type: 'Doing',
        sortingid: 6}
      ]);
    });
};