import { Category } from './types';

export const BOARD_DATA: Category[] = [
  {
    id: 'meat',
    title: 'Meat',
    selectionLimit: 2,
    items: [
      { id: 'm1', name: 'Salami (Genoa, Soppressata)', description: 'Classic cured sausage, fermented and air-dried. Genoa is garlicky and mild; Soppressata is coarser and often spicy.' },
      { id: 'm2', name: 'Prosciutto', description: 'Thinly sliced Italian dry-cured ham, delicate, sweet, and salty.' },
      { id: 'm3', name: 'Coppa', description: 'Cured pork neck fillet, similar to prosciutto but with a richer, earthier flavor.' },
      { id: 'm4', name: 'Capicola', description: 'Traditional Italian pork cold cut made from the dry-cured muscle running from the neck to the shoulder.' },
      { id: 'm5', name: 'Pancetta', description: 'Salt-cured pork belly meat, savory and rich, often served thinly sliced.' },
    ]
  },
  {
    id: 'soft_cheese',
    title: 'Soft Cheese',
    selectionLimit: 1,
    items: [
      { id: 'sc1', name: 'Blue', description: 'Sharp and salty cheese with veins of blue mold.' },
      { id: 'sc2', name: 'Brie', description: 'Soft cow\'s-milk cheese known for its creamy texture and white rind.' },
      { id: 'sc3', name: 'Camembert', description: 'Similar to Brie but with a deeper, more earthy and intense flavor.' },
      { id: 'sc4', name: 'Goat Cheese', description: 'Tart, earthy cheese made from goat\'s milk, often crumbly or creamy.' },
      { id: 'sc5', name: 'Feta with olive oil & zaatar', description: 'Tangy, crumbly brined cheese elevated with savory herbs and oil.' },
      { id: 'sc6', name: 'Burrata', description: 'Fresh Italian cow milk cheese made from mozzarella and cream.' },
      { id: 'sc7', name: 'Balsamic Blueberry Goat', description: 'Creamy goat cheese rolled in sweet blueberries and tangy balsamic.' },
      { id: 'sc8', name: 'Wine Soaked Goat', description: 'Goat cheese infused with red wine for a fruity, tart finish.' },
      { id: 'sc9', name: 'Honey Berry Goat', description: 'Sweet and tangy goat cheese blended with honey and berries.' },
      { id: 'sc10', name: 'Angry Goat', description: 'Spicy and herby goat cheese for a kick.' },
      { id: 'sc11', name: 'Herb & Garlic', description: 'Soft, spreadable cheese infused with savory herbs and garlic.' },
      { id: 'sc12', name: 'Pimento', description: 'Creamy cheese blend with sweet pimento peppers.' },
      { id: 'sc13', name: 'VEGAN Herb & Garlic', description: 'Nut-based creamy alternative with savory herbs.' },
      { id: 'sc14', name: 'VEGAN Not-zarella', description: 'Nut-based mozzarella alternative.' },
    ]
  },
  {
    id: 'hard_cheese',
    title: 'Hard Cheese',
    selectionLimit: 1,
    items: [
      { id: 'hc1', name: 'Gouda', description: 'Dutch cheese known for its rich, caramel-like flavor and smooth texture.' },
      { id: 'hc2', name: 'Manchego', description: 'Firm Spanish sheep\'s milk cheese with a distinctive buttery and nutty taste.' },
      { id: 'hc3', name: 'Cheddar', description: 'Classic sharp and earthy cheese.' },
      { id: 'hc4', name: 'Pecorino Romano', description: 'Hard, salty Italian cheese made from sheep\'s milk.' },
      { id: 'hc5', name: 'Aged Gruyere', description: 'Swiss cheese with a sweet but slightly salty flavor that varies with age.' },
      { id: 'hc6', name: 'Smoked Cheddar', description: 'Cheddar naturally smoked for a deep, woodsy flavor.' },
      { id: 'hc7', name: 'Spicy Chili Cheddar', description: 'Sharp cheddar infused with spicy chilies.' },
      { id: 'hc8', name: 'Wine Cheddar', description: 'Cheddar marbled with red wine.' },
      { id: 'hc9', name: 'Truffle', description: 'Firm cheese infused with earthy black truffle shavings.' },
      { id: 'hc10', name: 'Sour Cream & Onion Cheese', description: 'Savory cheese with the classic chip flavor profile.' },
      { id: 'hc11', name: 'VEGAN Smoked Farmhouse', description: 'Nut-based hard cheese with a smoky profile.' },
    ]
  },
  {
    id: 'nuts',
    title: 'Nuts',
    selectionLimit: 2,
    items: [
      { id: 'n1', name: 'Marcona Almonds', description: 'Sweet, gourmet almonds from Spain, often fried in oil and salted.' },
      { id: 'n2', name: 'Dry Flavored Almonds', description: 'Crunchy almonds dusted with savory seasonings.' },
      { id: 'n3', name: 'Oil & Herbs Flavored Almonds', description: 'Rich almonds roasted with aromatic herbs.' },
      { id: 'n4', name: 'Flavored Macadamia', description: 'Buttery, creamy nuts often roasted with spices.' },
      { id: 'n5', name: 'Cashew', description: 'Sweet, soft, and kidney-shaped nuts.' },
      { id: 'n6', name: 'Hazelnuts', description: 'Sweet and crunchy, often associated with chocolate pairings.' },
      { id: 'n7', name: 'Walnuts', description: 'Rich, buttery flavor with a slight bitterness.' },
      { id: 'n8', name: 'Pecans', description: 'Sweet and buttery nuts with a crisp texture.' },
      { id: 'n9', name: 'Peanuts', description: 'Classic legumes, salty and crunchy.' },
      { id: 'n10', name: 'Pistachios', description: 'Mildly sweet, greenish nuts, often served in the shell.' },
      { id: 'n11', name: 'Garlic & Herb Roasted Marcona', description: 'Gourmet Spanish almonds roasted with savory garlic.' },
    ]
  },
  {
    id: 'crackers',
    title: 'Crackers',
    selectionLimit: 1,
    items: [
      { id: 'c1', name: 'Rustic Bakery - Olive Oil & Sel Gris', description: 'Crisp, organic flatbreads with sea salt.' },
      { id: 'c2', name: 'Rustic Bakery - Rosemary & Olive Oil', description: 'Aromatic flatbreads with dried rosemary.' },
      { id: 'c3', name: 'Tart Cherry, Cacao Nib, & Almond', description: 'Sweet and savory artisan crisps.' },
      { id: 'c4', name: 'Lesley Stowe Raincoats Crisps (Variety)', description: 'Hearty crisps with Fig, Garlic, or Onion flavors.' },
      { id: 'c5', name: '34 Degrees Variety', description: 'Wafer-thin, light crackers. GF, Cracked Pepper, Rosemary, etc.' },
      { id: 'c6', name: 'Manchego Dusted Chips', description: 'Crispy chips dusted with savory Manchego cheese powder.' },
    ]
  },
  {
    id: 'sweet_spreads',
    title: 'Sweet Spreads',
    selectionLimit: 1,
    items: [
      { id: 'ss1', name: 'Honey', description: 'Natural sweet nectar, pairs beautifully with cheese.' },
      { id: 'ss2', name: 'Fig Spread', description: 'Dense, sweet jam made from figs.' },
      { id: 'ss3', name: 'Apricot Preserves', description: 'Bright, fruity jam with chunks of apricot.' },
      { id: 'ss4', name: 'Jam', description: 'Assorted seasonal berry jams.' },
    ]
  },
  {
    id: 'savory_spreads',
    title: 'Savory Spreads',
    selectionLimit: 1,
    items: [
      { id: 'sas1', name: 'Mustard', description: 'Sharp, tangy condiment.' },
      { id: 'sas2', name: 'Olive Tapenade', description: 'Pureed or finely chopped olives, capers, and anchovies.' },
      { id: 'sas3', name: 'Roasted Garlic', description: 'Soft, spreadable garlic cloves with a mellow, sweet flavor.' },
      { id: 'sas4', name: 'Spicy Whole Grain Mustard', description: 'Textured mustard with a spicy kick.' },
      { id: 'sas5', name: 'Citrus Beet Hummus', description: 'Vibrant hummus blended with citrus and beets.' },
      { id: 'sas6', name: 'Hummus', description: 'Creamy dip made from chickpeas and tahini.' },
    ]
  },
  {
    id: 'berries',
    title: 'Fruit & Berries',
    selectionLimit: 1,
    items: [
      { id: 'b1', name: 'Strawberries', description: 'Sweet, juicy red berries.' },
      { id: 'b2', name: 'Raspberries', description: 'Tart and sweet delicate red berries.' },
      { id: 'b3', name: 'Blackberries', description: 'Deep purple, sweet and slightly tart.' },
      { id: 'b4', name: 'Blueberries', description: 'Small, sweet round berries.' },
      { id: 'b5', name: 'Dried Cranberries', description: 'Chewy, tart-sweet dried fruit.' },
      { id: 'b6', name: 'Oranges', description: 'Fresh citrus slices.' },
      { id: 'b7', name: 'Grapes', description: 'Sweet red or green grapes.' },
      { id: 'b8', name: 'Dried Apricots', description: 'Sweet, chewy dried fruit.' },
    ]
  },
  {
    id: 'olives',
    title: 'Olives',
    selectionLimit: 2,
    items: [
      { id: 'o1', name: 'Kalamata', description: 'Greek olives known for their rich, fruity flavor and deep purple color. Meaty texture.' },
      { id: 'o2', name: 'Castelvetrano', description: 'Large Italian olives, bright green, mild, buttery, and crisp.' },
      { id: 'o3', name: 'Cerignola', description: 'Large Italian olives. Green are mild; black are rich and fruity.' },
      { id: 'o4', name: 'Nicoise', description: 'Small, dark brown/black French olives with a nutty, slightly bitter flavor.' },
      { id: 'o5', name: 'Manzanilla', description: 'Spanish green olives, firm texture, slightly salty. Often stuffed.' },
    ]
  },
  {
    id: 'veggies',
    title: 'Veggies',
    selectionLimit: 1,
    items: [
      { id: 'v1', name: 'Carrot Sticks', description: 'Fresh, crunchy orange staples.' },
      { id: 'v2', name: 'Celery', description: 'Crisp, watery stalks.' },
      { id: 'v3', name: 'Bell Peppers', description: 'Sweet, sliced peppers in various colors.' },
      { id: 'v4', name: 'Radishes', description: 'Peppery, crisp root vegetables.' },
      { id: 'v5', name: 'Snap Peas', description: 'Sweet, edible-pod peas.' },
      { id: 'v6', name: 'Cucumbers', description: 'Cool, crisp sliced cucumbers.' },
      { id: 'v7', name: 'Tomatoes', description: 'Fresh cherry or grape tomatoes.' },
    ]
  },
  {
    id: 'pickles',
    title: 'Pickles',
    selectionLimit: 1,
    items: [
      { id: 'p1', name: 'Pickled Carrot Sticks', description: 'Crunchy carrots brined in vinegar.' },
      { id: 'p2', name: 'Pickled Green Beans', description: 'Crisp beans with a sour bite.' },
      { id: 'p3', name: 'Pickled Cauliflower', description: 'Tangy florets.' },
      { id: 'p4', name: 'Tipsy Onions', description: 'Cocktail onions, often pickled in vermouth or vinegar.' },
      { id: 'p5', name: 'Cornichons', description: 'Small, tart French gherkins.' },
    ]
  },
  {
    id: 'other',
    title: 'Other (Optional)',
    selectionLimit: 99,
    items: [
      { id: 'ot2', name: 'Labneh with Zaatar', description: 'Strained yogurt cheese, thick and tangy.' },
      { id: 'ot3', name: 'Chocolate', description: 'Sweet milk or semi-sweet chocolate chunks.' },
      { id: 'ot4', name: 'Dark Chocolate', description: 'Bitter-sweet rich chocolate.' },
      { id: 'ot5', name: 'Macaron', description: 'Delicate French almond meringue cookies (+$3.00).' },
    ]
  }
];