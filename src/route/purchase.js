// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    totalAmount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.totalAmount = totalAmount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/id/2/200/300?blur=1',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  28000,
  10,
)

Product.add(
  'https://picsum.photos/id/5/200/300?blur=2',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [{ id: 2, text: 'Топ продажів' }],
  20000,
  9,
)

Product.add(
  'https://picsum.photos/id/8/200/300?blur=3',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [{ id: 1, text: 'Готовий до відправки' }],
  24000,
  8,
)

Product.add(
  'https://picsum.photos/id/7/200/300?blur=4',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [{ id: 1, text: 'Готовий до відправки' }],
  22000,
  7,
)

Product.add(
  'https://picsum.photos/id/3/200/300?blur=5',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [{ id: 1, text: 'Готовий до відправки' }],
  26000,
  6,
)

// ================================================================

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.name = data.name
    this.surname = data.surname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0
    this.promo = data.promo || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.addbonus = this.totalPrice * 0.1

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse().map((purchase) => ({
      id: purchase.id,
      title: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: purchase.addbonus,
    }))
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.name) purchase.name = data.name
      if (data.surname) purchase.surname = data.surname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else return false
  }
}

// ================================================================

class Promo {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromo = new Promo(name, factor)
    Promo.#list.push(newPromo)
    return newPromo
  }

  static getByName = (name) => {
    return this.#list.find((prom) => prom.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promo.add('SUMMER23', 0.9)
Promo.add('DISCO50', 0.5)
Promo.add('SALE25', 0.75)

// ================================================================

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    title: 'Товари',
    info: `Комп'ютери та ноутбуки/Комп'ютери, неттопи, моноблоки`,
    data: {
      list: Product.getList(),
    },
  })
})

// ================================================================

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',
    title: 'Інформація про товар',
    info: `Інші товари`,
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

// ================================================================

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Введіть коректну кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.totalAmount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount) // щоб відслідковувати потік передачі даних в консолі

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт.)`,
          price: productPrice,
        },
        {
          text: `Вартість доставки`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

// ================================================================

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    name,
    surname,
    email,
    phone,
    comment,

    promo,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }

  if (amount > product.totalAmount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Вказана кількість товару не доступна',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (!name || !surname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: `Заповніть всі обов'язкові поля`,
        link: '/purchase-list',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promo) {
    promo = Promo.getByName(promo)

    if (promo) {
      totalPrice = Promo.calc(promo, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      name,
      surname,
      email,
      phone,

      promo,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      info: 'Замовлення створено',
      link: '/purchase-list',
    },
  })
})

// ================================================================

router.get('/purchase-list', function (req, res) {
  //   console.log(`list: `, Purchase.getList())

  res.render('purchase-list', {
    style: 'purchase-list',
    data: Purchase.getList(),
  })
})

// ================================================================

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-info', {
    style: 'purchase-info',
    data: Purchase.getById(id),
  })
})

// ================================================================

router.get('/data-change', function (req, res) {
  const id = Number(req.query.id)

  res.render('data-change', {
    style: 'data-change',
    data: Purchase.getById(id),
  })
})

// ================================================================

router.post('/data-change', function (req, res) {
  const id = Number(req.query.id)
  const { surname, name, email, phone } = req.body
  console.log(id)

  Purchase.updateById(id, {
    surname,
    name,
    email,
    phone,
  })

  console.log(`NEW:`, Purchase.getById(id))

  res.render('alert', {
    style: 'alert',
    data: {
      info: 'Операція успішна',
      link: '/purchase-list',
    },
  })
})

// ================================================================

router.get('/alert', function (req, res) {
  res.render('alert', {
    style: 'alert',
    data: {
      info: 'Операція успішна',
      link: '/purchase-list',
    },
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
