// Подключаем источники данных
// Ингредиенты
const ingredientBunCyDataLink = '[data-cy="ingredient-bun"]';
const ingredientMainCyDataLink = '[data-cy="ingredient-main"]';
const ingredientSauceCyDataLink = '[data-cy="ingredient-sauce"]';
// Конструктор
const constructorCyDataLink = '[data-cy="constructor"]';
const constructorBunTopCyDataLink = '[data-cy="constructor-bun-top"]';
const constructorBunBottomCyDataLink = '[data-cy="constructor-bun-bottom"]';
const constructorIngredientsCyDataLink = '[data-cy="constructor-ingredients"]';
const constructorOrderCyDataLink = '[data-cy="constructor-order"]';
// Модальное окно
const modalCyDataLink = '[data-cy="modal"]';
const modalOverlayCyDataLink = '[data-cy="modal-overlay"]';
// Заказ
const orderNumberCyDataLink = '[data-cy="order-number"]';

// Подставляем фейковый токен и storage
beforeEach(() => {
  cy.setCookie('accessToken', 'Bearer test-token');
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  // Перехватываем запросы
  // Запрос ингредиентов
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  // Авторизация покупателя
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
    'getUser'
  );
  // Размещение заказа
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
    'createOrder'
  );

  // Открываем наш сайт
  cy.visit('/');
  // Получаем мокнутые ингредиенты
  cy.wait('@getIngredients');
  cy.wait('@getUser');
});

// Чистим за собой
afterEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

describe('Проверяем загрузку ингредиентов', function () {
  it('Список булок не пуст', function () {
    cy.get(ingredientBunCyDataLink).should('have.length.greaterThan', 0);
  });
  it('Список основных ингредиентов не пуст', function () {
    cy.get(ingredientMainCyDataLink).should('have.length.greaterThan', 0);
  });
  it('Список соусов не пуст', function () {
    cy.get(ingredientSauceCyDataLink).should('have.length.greaterThan', 0);
  });
});

describe('Проверяем добавление ингредиентов в конструкторе', function () {
  it('Булка добавлена', function () {
    cy.get(ingredientBunCyDataLink).first().find('button').click();
    cy.get(constructorBunTopCyDataLink).should('have.length.greaterThan', 0);
    cy.get(constructorBunTopCyDataLink).should(
      'contain',
      'Краторная булка N-200i'
    );

    cy.get(constructorBunBottomCyDataLink).should('have.length.greaterThan', 0);
    cy.get(constructorBunBottomCyDataLink).should(
      'contain',
      'Краторная булка N-200i'
    );
  });

  it('Основной ингредиент добавлен', function () {
    cy.get(ingredientMainCyDataLink).first().find('button').click();
    cy.get(constructorIngredientsCyDataLink).should(
      'have.length.greaterThan',
      0
    );
    cy.get(constructorIngredientsCyDataLink).should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Соус добавлен', function () {
    cy.get(ingredientSauceCyDataLink).first().find('button').click();
    cy.get(constructorIngredientsCyDataLink).should(
      'have.length.greaterThan',
      0
    );
    cy.get(constructorIngredientsCyDataLink).should('contain', 'Соус Spicy-X');
  });
});

describe('Проверяем открытие и закрытие модальных окон', function () {
  it('Модальное окно открыто при клике на первую булку', function () {
    cy.get(ingredientBunCyDataLink).first().click();
    cy.get(modalCyDataLink).should('be.visible');
    cy.get(modalCyDataLink).should('contain', 'Краторная булка N-200i');
  });

  it('Закрытие модального окна по крестику', function () {
    // Сначала открываем
    cy.get(ingredientBunCyDataLink).first().click();
    // Находим единственную кнопку (закрыть) и кликаем
    cy.get(modalCyDataLink).find('button').click();
    // Проверяем, что модальное окно закрылось
    cy.get(modalCyDataLink).should('not.exist');
  });

  it('Закрытие модального окна по оверлею', function () {
    // Сначала открываем
    cy.get(ingredientBunCyDataLink).first().click();
    // Кликаем на оверлей (принудительно, т.к. не кнопка)
    cy.get(modalOverlayCyDataLink).click({ force: true });
    // Проверяем, что модальное окно закрылось
    cy.get(modalCyDataLink).should('not.exist');
  });
});

describe('Проверяем создание заказа', function () {
  it('Создаем простой заказ', function () {
    // Добавляем булку
    cy.get(ingredientBunCyDataLink).first().find('button').click();
    // Добавляем основной ингредиент
    cy.get(ingredientMainCyDataLink).first().find('button').click();
    // Добавляем соус
    cy.get(ingredientSauceCyDataLink).first().find('button').click();

    // Кликаем на "Оформить заказ"
    cy.get(constructorOrderCyDataLink).first().find('button').click();
    cy.wait('@createOrder');

    // Проверяем модальное окно (открыто и номер заказа)
    cy.get(modalCyDataLink).should('be.visible');
    cy.get(orderNumberCyDataLink).should('contain', '1');

    // Закрываем модальное окно и проверяем, что оно закрылось
    cy.get(modalCyDataLink).find('button').click();
    cy.get(modalCyDataLink).should('not.exist');

    // Проверяем очистку конструктора
    cy.get(constructorBunTopCyDataLink).should('not.exist');
    cy.get(constructorBunBottomCyDataLink).should('not.exist');
    cy.get(constructorIngredientsCyDataLink).should('have.length', 1);
    cy.get(constructorIngredientsCyDataLink).should(
      'contain',
      'Выберите начинку'
    );
  });
});
