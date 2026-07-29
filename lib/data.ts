import { Product } from '@/components/ProductCard';

export interface Subcategory {
  id: string;
  name: string;
  type: 'food' | 'toy' | 'medicine' | 'accessory';
  subSections: string[];
}

export interface PetCategoryGroup {
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

// Full Russian e-commerce catalog categories structure
export const CATALOG_STRUCTURE: Record<string, PetCategoryGroup> = {
  cat: {
    name: 'Кошки',
    icon: '🐱',
    subcategories: [
      {
        id: 'cat-food',
        name: 'Корм',
        type: 'food',
        subSections: ['Сухой корм', 'Влажный корм', 'Лечебный и диетический корм', 'Холистик', 'Заменитель молока']
      },
      {
        id: 'cat-flea',
        name: 'Защита от блох, клещей, гельминтов',
        type: 'medicine',
        subSections: ['Капли на холку', 'Ошейники от паразитов', 'Спреи', 'Таблетки комплексные']
      },
      {
        id: 'cat-litter',
        name: 'Наполнители для кошачьего туалета',
        type: 'accessory',
        subSections: ['Древесный', 'Силикагелевый', 'Комкующийся', 'Впитывающий']
      },
      {
        id: 'cat-treat',
        name: 'Лакомства',
        type: 'food',
        subSections: ['Мясные колбаски', 'Подушечки с начинкой', 'Жидкие крем-лакомства', 'Сушеные вкусняшки']
      },
      {
        id: 'cat-litterbox',
        name: 'Лотки и туалеты',
        type: 'accessory',
        subSections: ['Открытые лотки', 'Закрытые туалеты-био', 'Совки и коврики', 'Средства для приучения']
      },
      {
        id: 'cat-bed',
        name: 'Лежанки и домики',
        type: 'accessory',
        subSections: ['Мягкие лежаки', 'Закрытые домики', 'Гамаки на батарею', 'Матрасы ортопедические']
      },
      {
        id: 'cat-scratcher',
        name: 'Когтеточки и игровые комплексы',
        type: 'toy',
        subSections: ['Столбики', 'Комплексы с домиком', 'Картонные когтеточки', 'Угловые навесные']
      },
      {
        id: 'cat-clothes',
        name: 'Одежда и аксессуары',
        type: 'accessory',
        subSections: ['Комбинезоны', 'Свитера', 'Шлейки и поводки', 'Миски металлические']
      },
      {
        id: 'cat-smart',
        name: 'Умные товары',
        type: 'toy',
        subSections: ['Автопоилки-фонтаны', 'Автоматические кормушки', 'Лазерные роботы', 'Смарт-лабиринты']
      },
      {
        id: 'cat-toys',
        name: 'Игрушки',
        type: 'toy',
        subSections: ['Мышки и мячики', 'Удочки-дразнилки', 'Туннели шуршащие', 'Игрушки с кошачьей мятой']
      }
    ]
  },
  dog: {
    name: 'Собаки',
    icon: '🐶',
    subcategories: [
      {
        id: 'dog-food',
        name: 'Корм',
        type: 'food',
        subSections: ['Сухой корм', 'Влажные консервы', 'Лечебное питание', 'Холистик меню', 'Заменители молока']
      },
      {
        id: 'dog-flea',
        name: 'Защита от блох, клещей, гельминтов',
        type: 'medicine',
        subSections: ['Таблетки комплексные', 'Капли от внешних паразитов', 'Ошейники защитные', 'Шампуни гигиенические']
      },
      {
        id: 'dog-accessories',
        name: 'Ошейники, шлейки, поводки',
        type: 'accessory',
        subSections: ['Кожаные ошейники', 'Поводки и рулетки', 'Анатомические шлейки', 'Намордники мягкие']
      },
      {
        id: 'dog-litter',
        name: 'Пеленки и туалеты',
        type: 'accessory',
        subSections: ['Одноразовые пеленки', 'Многоразовые пеленки', 'Туалеты со столбиком']
      },
      {
        id: 'dog-bed',
        name: 'Лежанки и домики',
        type: 'accessory',
        subSections: ['Ортопедические диваны', 'Непромокаемые коврики', 'Будки в квартиру']
      },
      {
        id: 'dog-toys',
        name: 'Игрушки для питомцев',
        type: 'toy',
        subSections: ['Прочные мячи и пуллеры', 'Канаты для перетягивания', 'Развивающие игры', 'Мягкие пищалки']
      },
      {
        id: 'dog-groom',
        name: 'Гигиена и уход',
        type: 'accessory',
        subSections: ['Шампуни для мытья лап', 'Когтерезы', 'Пуходерки и расчески', 'Лосьоны для ушей']
      },
      {
        id: 'dog-treat',
        name: 'Лакомства',
        type: 'food',
        subSections: ['Сушеные легкие и рубец', 'Жевательные рога оленя', 'Дрессировочные дропсы']
      }
    ]
  },
  bird: {
    name: 'Птицы',
    icon: '🦜',
    subcategories: [
      {
        id: 'bird-food',
        name: 'Корм для птиц',
        type: 'food',
        subSections: ['Отборные зерносмеси', 'Лакомые палочки с медом', 'Минеральные подкормки']
      },
      {
        id: 'bird-toys',
        name: 'Игрушки и качели',
        type: 'toy',
        subSections: ['Качели деревянные', 'Зеркала с колокольчиком', 'Развивающие подвесы']
      },
      {
        id: 'bird-cage',
        name: 'Клетки и вольеры',
        type: 'accessory',
        subSections: ['Металлические клетки', 'Деревянные вольеры', 'Кормушки навесные']
      }
    ]
  },
  rodent: {
    name: 'Грызуны',
    icon: '🐹',
    subcategories: [
      {
        id: 'rodent-food',
        name: 'Питание грызунов',
        type: 'food',
        subSections: ['Травяное сено горное', 'Ореховые кормосмеси', 'Лакомства-дропсы']
      },
      {
        id: 'rodent-cage',
        name: 'Домики и лабиринты',
        type: 'accessory',
        subSections: ['Двухэтажные домики', 'Беговые колеса 20см', 'Пластиковые туннели']
      }
    ]
  },
  fish: {
    name: 'Рыбки',
    icon: '🐟',
    subcategories: [
      {
        id: 'fish-food',
        name: 'Корма для рыб',
        type: 'food',
        subSections: ['Сухие хлопья', 'Тонущие гранулы', 'Корм для макроподов']
      },
      {
        id: 'fish-accessory',
        name: 'Аквариумы и декор',
        type: 'accessory',
        subSections: ['Керамические замки', 'Светодиодные светильники', 'Навесные фильтры']
      }
    ]
  }
};

// Rich list of actual high-fidelity products corresponding to categories
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ownat Adult Sterilized Classic Сухой корм для стерилизованных кошек средней активности, с птицей',
    category: 'Корма',
    price: 2400,
    oldPrice: 2999,
    rating: 4.9,
    reviews: 142,
    onSale: true,
    salePct: 20,
    badge: 'Рекомендовано',
    type: 'food',
    animal: 'cat',
    brand: 'Ownat',
    sizes: ['300 г', '1,5 кг', '4 кг', '15 кг'],
    subcategoryId: 'cat-food',
    subSection: 'Сухой корм'
  },
  {
    id: '2',
    name: 'GRANDORF Holistic Adult Sterilised Гипоаллергенный сухой корм для кастрированных кошек, 4 вида мяса',
    category: 'Корма',
    price: 1185,
    oldPrice: 1480,
    rating: 5.0,
    reviews: 212,
    onSale: true,
    salePct: 25,
    badge: 'Хит',
    type: 'food',
    animal: 'cat',
    brand: 'Grandorf',
    sizes: ['400 г', '2 кг', '8 кг'],
    subcategoryId: 'cat-food',
    subSection: 'Холистик'
  },
  {
    id: '3',
    name: 'Ownat Adult Sterilized Grain Free Just Беззерновой сухой корм для взрослых стерилизованных кошек, с курицей',
    category: 'Корма',
    price: 1529,
    rating: 4.8,
    reviews: 95,
    onSale: false,
    badge: 'Редкое',
    type: 'food',
    animal: 'cat',
    brand: 'Ownat',
    sizes: ['400 г', '1 кг', '3 кг', '8 кг'],
    subcategoryId: 'cat-food',
    subSection: 'Сухой корм',
    inStock: false
  },
  {
    id: '4',
    name: 'Сбалансированное влажное суфле Mealfeel с фермерским кроликом в нежном соусе для котят',
    category: 'Корма',
    price: 95,
    oldPrice: 130,
    rating: 4.7,
    reviews: 320,
    onSale: true,
    salePct: 27,
    type: 'food',
    animal: 'cat',
    brand: 'Mealfeel',
    sizes: ['85 г', '200 г'],
    subcategoryId: 'cat-food',
    subSection: 'Влажный корм'
  },
  {
    id: '5',
    name: 'Кошачий защитный ошейник Foresto от блох, клещей и вшей для мелких собак и кошек Elanco Foresto',
    category: 'Ветаптека',
    price: 3450,
    oldPrice: 4300,
    rating: 4.9,
    reviews: 184,
    onSale: true,
    salePct: 20,
    badge: 'Рекомендовано',
    type: 'medicine',
    animal: 'cat',
    brand: 'Elanco',
    sizes: ['38 см'],
    subcategoryId: 'cat-flea',
    subSection: 'Ошейники от паразитов'
  },
  {
    id: '6',
    name: 'Впитывающий силикагелевый гигиенический наполнитель для кошачьего туалета Wellkiss Lavender',
    category: 'Наполнители',
    price: 890,
    rating: 4.6,
    reviews: 42,
    onSale: false,
    type: 'accessory',
    animal: 'cat',
    brand: 'Wellkiss',
    sizes: ['3.8 л', '5.0 л', '8.0 л'],
    subcategoryId: 'cat-litter',
    subSection: 'Силикагелевый'
  },
  {
    id: '7',
    name: 'Крем-лакомство для кошек Ciao Churu Ассорти из морепродуктов с диким тунцом и лососем в соусе',
    category: 'Лакомства',
    price: 490,
    oldPrice: 590,
    rating: 5.0,
    reviews: 415,
    onSale: true,
    salePct: 17,
    badge: 'Новинка',
    type: 'food',
    animal: 'cat',
    brand: 'Ciao Churu',
    sizes: ['4 шт', '20 шт'],
    subcategoryId: 'cat-treat',
    subSection: 'Жидкие крем-лакомства',
    inStock: false
  },
  // Dogs
  {
    id: '8',
    name: 'Ownat Adult Small Breed Lamb & Rice Сухой корм ультра-класса с ягненком и диким рисом для мелких собак',
    category: 'Корма',
    price: 1240,
    oldPrice: 1690,
    rating: 4.9,
    reviews: 142,
    onSale: true,
    salePct: 26,
    badge: 'Хит',
    type: 'food',
    animal: 'dog',
    brand: 'Ownat',
    sizes: ['1.5 кг', '3 кг', '7.5 кг'],
    subcategoryId: 'dog-food',
    subSection: 'Сухой корм'
  },
  {
    id: '9',
    name: 'GRANDORF Holistic Adult Medium-Large Breed Гипоаллергенный сухой корм для средних и крупных собак, индейка с рисом',
    category: 'Корма',
    price: 2850,
    rating: 5.0,
    reviews: 80,
    onSale: false,
    type: 'food',
    animal: 'dog',
    brand: 'Grandorf',
    sizes: ['3 кг', '10 кг', '12 кг'],
    subcategoryId: 'dog-food',
    subSection: 'Холистик меню'
  },
  {
    id: '10',
    name: 'Таблетки от блох и клещей для средних собак Симпарика Zoetis Simparica в дозировке 20-40 кг, 3 шт',
    category: 'Ветаптека',
    price: 3100,
    oldPrice: 3875,
    rating: 4.9,
    reviews: 156,
    onSale: true,
    salePct: 20,
    badge: 'Здоровье',
    type: 'medicine',
    animal: 'dog',
    brand: 'Zoetis',
    sizes: ['3 таб', '6 таб'],
    subcategoryId: 'dog-flea',
    subSection: 'Таблетки комплексные'
  },
  {
    id: '11',
    name: 'Ортопедический мягкий велюровый лежак с высокими упругими бортиками для собак «Соня Плюс»',
    category: 'Лежаки',
    price: 3400,
    rating: 4.7,
    reviews: 34,
    onSale: false,
    type: 'accessory',
    animal: 'dog',
    brand: 'Grandin',
    sizes: ['S (50х40)', 'M (70х55)', 'L (90х70)'],
    subcategoryId: 'dog-bed',
    subSection: 'Ортопедические диваны'
  },
  {
    id: '12',
    name: 'Кожаный двухслойный анатомический регулируемый ошейник с латунными заклепками для собак собак',
    category: 'Аксессуары',
    price: 890,
    rating: 4.6,
    reviews: 45,
    onSale: false,
    type: 'accessory',
    animal: 'dog',
    brand: 'Wellkiss',
    sizes: ['M (35-45)', 'L (45-55)'],
    subcategoryId: 'dog-accessories',
    subSection: 'Кожаные ошейники'
  },
  {
    id: '13',
    name: 'Игрушка развивающий прочный пуллер-кольцо из безвредного композитного полимера для собак Collar Puller',
    category: 'Игрушки',
    price: 1190,
    oldPrice: 1450,
    rating: 4.8,
    reviews: 98,
    onSale: true,
    salePct: 18,
    type: 'toy',
    animal: 'dog',
    brand: 'Collar',
    sizes: ['Micro', 'Midi', 'Standard'],
    subcategoryId: 'dog-toys',
    subSection: 'Прочные мячи и пуллеры'
  },
  // Birds, Rodents, Fish
  {
    id: '14',
    name: 'Натуральная зерновая смесь премиум-класса с сушеными абрикосами для средних и мелких попугаев Рио',
    category: 'Корма',
    price: 380,
    oldPrice: 480,
    rating: 4.9,
    reviews: 76,
    onSale: true,
    salePct: 21,
    badge: 'Новинка',
    type: 'food',
    animal: 'bird',
    brand: 'Рио',
    sizes: ['500 г', '1 кг'],
    subcategoryId: 'bird-food',
    subSection: 'Отборные зерносмеси'
  },
  {
    id: '15',
    name: 'Натуральный двухэтажный деревянный домик с лесенкой и плоской крышей для хомяков и песчанок',
    category: 'Домики',
    price: 640,
    rating: 4.9,
    reviews: 42,
    onSale: false,
    type: 'accessory',
    animal: 'rodent',
    brand: 'Grandin',
    sizes: ['Стандарт'],
    subcategoryId: 'rodent-cage',
    subSection: 'Двухэтажные домики'
  },
  {
    id: '16',
    name: 'Питательный сухой сбалансированный корм в виде тонких хлопьев для аквариумных рыбок TetraMin',
    category: 'Корма',
    price: 320,
    rating: 5.0,
    reviews: 138,
    onSale: false,
    type: 'food',
    animal: 'fish',
    brand: 'Tetra',
    sizes: ['100 мл', '250 мл', '500 мл'],
    subcategoryId: 'fish-food',
    subSection: 'Сухие хлопья'
  },
  {
    id: '17',
    name: 'Декоративный керамический грот «Замок Посейдона» ручной работы для укрытия сомиков в аквариум',
    category: 'Аксессуары',
    price: 950,
    oldPrice: 1200,
    rating: 4.7,
    reviews: 21,
    onSale: true,
    salePct: 21,
    badge: 'Редкое',
    type: 'accessory',
    animal: 'fish',
    brand: 'Barbus',
    sizes: ['Малый', 'Средний'],
    subcategoryId: 'fish-accessory',
    subSection: 'Керамические замки'
  },
  {
    id: '18',
    name: 'Farmina N&D Prime Cat Беззерновой сухой корм для кошек, курица с гранатом',
    category: 'Корма',
    price: 1890,
    oldPrice: 2250,
    rating: 4.9,
    reviews: 165,
    onSale: true,
    salePct: 16,
    badge: 'Премиум',
    type: 'food',
    animal: 'cat',
    brand: 'Farmina',
    sizes: ['300 г', '1.5 кг', '5 кг'],
    subcategoryId: 'cat-food',
    subSection: 'Холистик'
  },
  {
    id: '19',
    name: 'Royal Canin Fit 32 Сухой сбалансированный корм для взрослых кошек с умеренной активностью',
    category: 'Корма',
    price: 1450,
    rating: 4.8,
    reviews: 280,
    onSale: false,
    type: 'food',
    animal: 'cat',
    brand: 'Royal Canin',
    sizes: ['400 г', '2 кг', '4 кг', '10 кг'],
    subcategoryId: 'cat-food',
    subSection: 'Сухой корм'
  },
  {
    id: '20',
    name: 'Pro Plan Nutrisavour Sterilised Влажный корм для стерилизованных кошек, нежные кусочки с уткой в соусе',
    category: 'Корма',
    price: 110,
    oldPrice: 145,
    rating: 4.7,
    reviews: 195,
    onSale: true,
    salePct: 24,
    type: 'food',
    animal: 'cat',
    brand: 'Pro Plan',
    sizes: ['85 г'],
    subcategoryId: 'cat-food',
    subSection: 'Влажный корм'
  },
  {
    id: '21',
    name: 'Натуральный глиняный комкующийся наполнитель супер-класса Pi-Pi Bent Классик без ароматизаторов',
    category: 'Наполнители',
    price: 650,
    rating: 4.8,
    reviews: 82,
    onSale: false,
    type: 'accessory',
    animal: 'cat',
    brand: 'Pi-Pi Bent',
    sizes: ['5 кг', '10 кг'],
    subcategoryId: 'cat-litter',
    subSection: 'Комкующийся'
  },
  {
    id: '22',
    name: 'Лакомство Dreamies Подушечки с нежным паштетом и сочной курицей для взрослых кошек',
    category: 'Лакомства',
    price: 120,
    oldPrice: 155,
    rating: 4.9,
    reviews: 512,
    onSale: true,
    salePct: 22,
    badge: 'Хит',
    type: 'food',
    animal: 'cat',
    brand: 'Dreamies',
    sizes: ['60 г', '140 г'],
    subcategoryId: 'cat-treat',
    subSection: 'Подушечки хрустящие'
  },
  {
    id: '23',
    name: 'Acana Wild Prairie Dog Беззерновой гипоаллергенный сухой корм для собак всех пород, цыпленок и индейка',
    category: 'Корма',
    price: 4500,
    rating: 5.0,
    reviews: 64,
    onSale: false,
    badge: 'Премиум',
    type: 'food',
    animal: 'dog',
    brand: 'Acana',
    sizes: ['2 кг', '6 кг', '11.4 кг'],
    subcategoryId: 'dog-food',
    subSection: 'Холистик меню'
  },
  {
    id: '24',
    name: 'Brit Premium By Nature Adult L Сухой корм с высоким содержанием курицы для взрослых собак крупных пород',
    category: 'Корма',
    price: 1950,
    oldPrice: 2450,
    rating: 4.8,
    reviews: 110,
    onSale: true,
    salePct: 20,
    type: 'food',
    animal: 'dog',
    brand: 'Brit',
    sizes: ['3 кг', '8 кг', '15 кг'],
    subcategoryId: 'dog-food',
    subSection: 'Сухой корм'
  },
  {
    id: '25',
    name: 'Консервы Cesar из нежной отборной говядины с добавлением аппетитных садовых овощей в густом соусе',
    category: 'Корма',
    price: 130,
    rating: 4.7,
    reviews: 240,
    onSale: false,
    type: 'food',
    animal: 'dog',
    brand: 'Cesar',
    sizes: ['100 г'],
    subcategoryId: 'dog-food',
    subSection: 'Влажный корм'
  },
  {
    id: '26',
    name: 'Капли на холку от блох, иксодовых клещей и власоедов для средних собак Фронтлайн Комбо M (10-20 кг)',
    category: 'Ветаптека',
    price: 1800,
    oldPrice: 2100,
    rating: 4.9,
    reviews: 73,
    onSale: true,
    salePct: 14,
    badge: 'Здоровье',
    type: 'medicine',
    animal: 'dog',
    brand: 'Merial',
    sizes: ['1 пипетка', '3 пипетки'],
    subcategoryId: 'dog-flea',
    subSection: 'Капли от клещей'
  },
  {
    id: '27',
    name: 'Мягкий успокаивающий круглый лежак-пончик из пушистого длинного ворса Wellkiss Fluffy для мелких собак',
    category: 'Лежаки',
    price: 2100,
    rating: 4.9,
    reviews: 58,
    onSale: false,
    type: 'accessory',
    animal: 'dog',
    brand: 'Wellkiss',
    sizes: ['XS (40х40)', 'S (50х50)', 'M (60х60)'],
    subcategoryId: 'dog-bed',
    subSection: 'Круглые лежаки'
  },
  {
    id: '28',
    name: 'Поводок-рулетка Flexi New Classic S лента 5 метров для собак весом до 15 кг, эргономичная рукоятка',
    category: 'Аксессуары',
    price: 2200,
    oldPrice: 2600,
    rating: 4.8,
    reviews: 94,
    onSale: true,
    salePct: 15,
    badge: 'Рекомендовано',
    type: 'accessory',
    animal: 'dog',
    brand: 'Flexi',
    sizes: ['5 метров лента'],
    subcategoryId: 'dog-accessories',
    subSection: 'Поводки-рулетки'
  },
  {
    id: '29',
    name: 'Игрушка-неваляшка сверхпрочная каучуковая пирамидка для лакомств Kong Classic для собак',
    category: 'Игрушки',
    price: 1490,
    rating: 5.0,
    reviews: 185,
    onSale: false,
    badge: 'Хит',
    type: 'toy',
    animal: 'dog',
    brand: 'Kong',
    sizes: ['S', 'M', 'L', 'XL'],
    subcategoryId: 'dog-toys',
    subSection: 'Интеллектуальные игры'
  },
  {
    id: '30',
    name: 'Versele-Laga Prestige Budgies Полнорационный зерновой корм премиум-класса для волнистых попугаев',
    category: 'Корма',
    price: 550,
    rating: 4.9,
    reviews: 104,
    onSale: false,
    type: 'food',
    animal: 'bird',
    brand: 'Versele-Laga',
    sizes: ['1 кг'],
    subcategoryId: 'bird-food',
    subSection: 'Отборные зерносмеси'
  },
  {
    id: '31',
    name: 'Little One корм для декоративных кроликов с добавлением полезных травяных гранул и сушеных овощей',
    category: 'Корма',
    price: 420,
    rating: 4.8,
    reviews: 118,
    onSale: false,
    type: 'food',
    animal: 'rodent',
    brand: 'Little One',
    sizes: ['900 г', '3 кг'],
    subcategoryId: 'rodent-cage',
    subSection: 'Двухэтажные домики'
  },
  {
    id: '32',
    name: 'Тонущие гранулы Hikari Cichlid Gold премиум-корм для цихлид и крупных тропических аквариумных рыб',
    category: 'Корма',
    price: 850,
    oldPrice: 1050,
    rating: 4.9,
    reviews: 37,
    onSale: true,
    salePct: 19,
    type: 'food',
    animal: 'fish',
    brand: 'Hikari',
    sizes: ['100 г', '250 г'],
    subcategoryId: 'fish-food',
    subSection: 'Тонущие гранулы'
  }
];

export const MOCK_DISTRICTS = [
  { value: 'central', label: 'Центральный административный округ (ЦАО)' },
  { value: 'north', label: 'Северный АО (САО)' },
  { value: 'east', label: 'Восточный АО (ВАО)' },
  { value: 'south', label: 'Южный АО (ЮАО)' },
  { value: 'west', label: 'Западный АО (ЗАО)' },
  { value: 'suburbs', label: 'Пригород / Московская область (до 30 км)' },
];
