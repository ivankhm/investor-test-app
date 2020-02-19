# Тестовое задание "Виртуальный портфель"

## Использование

Можно создать несколько портфелей и добавлять в них акции.Искать их можно по названию или символу.При добавлении в портфель можно указать количество "покупаемых" акций по текущей рыночной цене. Каждые 30 секунд акции обновляют свою стоимость и процент роста.

При ошибке сети/api информация корректно выводится пользователю, а не валидные акции подсвечиваются красным.

Статусы загрузки и обновления корректно отображаются в UI.

## Нюансы реализации

Для написания редюсеров был использован пакет [redux-toolkit](https://redux-toolkit.js.org/). Функции редюсеров внутри методов `createSlice` и `createReducer` обернуты в [immer](https://github.com/immerjs/immer) и позволяют использовать код с мутациями состояния. В моем случае это было оптимально, так как у меня много вложенных объектов в структуре хранилища и это делает код более читаемым.

Для сохранения состояния был использован пакет [redux-persist](https://github.com/rt2zz/redux-persist), потому что удобно. Кроме миграций хранилища, которые крайне сложно сделать "type safe", но это проблемы самой концепции миграций, вот [обсуждение и возможное решение](https://stackoverflow.com/questions/51624096/typescript-typed-redux-persist-migrationmanifest) на SO.

Для mock-а `axios` был использован готовый [адаптер](https://github.com/ctimmerm/axios-mock-adapter).

Для внешнего вида был использован [Material-UI](https://material-ui.com/), потому что красиво.

## Ограничения

### Ограничения использования

* Сумма портфеля выводится в рублях, и у пользователя нет возможности поменять валюту. Технических прeпятствий для реализации этой фитчи нет, просто в техническом задании её не было. Сумма считается корректно на основе курсов валют подгружаемых по api.

* Процент изменения портфолио считается на основе новых значений поля `change percent` у обновленных акций, а не путем сравнения предыдущей сумы и текущей. Был выбор: самостоятельно высчитывать процент каждые 30 секунд на основе дневного отчета от api [AlphaVantage](https://www.alphavantage.co/documentation/) или использовать метод `GlobalQuote` для получения готового процента.Оба варианта приемлемы, но второй менее затратный по времени.

* Т.к. api бесплатный, максимальное число запросов в день по api ключу - 500, а в минуту - 5. Из-за этого при превышении лимита показывается предупреждение с сообщением об ошибке.

### Ограничения реализации

По сути, здесь я опишу неудачные решения на стадии проектирования.

1. Стоило использовать одну из библиотек по работе с валютами. Я понял это слишком поздно, поэтому внедрение такой библиотеки было бы слишком затратно по времени. Все операции я выполнял, "передвигая" знак запятой так, чтобы не осталось дробной части, выполнял действие/округления и возвращал его обратно.

2. Стоило использовать [Redux-Saga](https://redux-saga.js.org/), а не Thunk как midleware для редукторов, так-как первый намного проще в тестировании.

### Ограничения деплоя

Проект размещен на [heroku](http://investor-test-app.herokuapp.com/), однако при долгом неиспользовании приложение "засыпает" для экономии ресурсов, поэтому первая загрузка может быть крайне долгой, пока оно просыпается.

### Ограничения тестирования

Не все компоненты и хуки протестированы, т.к. `enzyme` и `act` крайне странно обращается с функциональными компонентами. В [официальной документации](https://reactjs.org/docs/test-utils.html#act) рекомендуют оборачивать выражения, которые потенциально изменяют state, в функцию `act`, однако в чистом виде это **не работает**.

При обертывании изменения в `act` не происходит ререндера, а следовательно не срабатывает хук `useEffect`. Приходится вызывать **каждый** ререндер вручную с помощью `wrapper.setProps({})` (`wrapper.update()` не форсит ререндер компонента).

Если в компоненте используется *async* логика, судя по всему необходимо использовать `await act` и делать весь тест *async*. Данный подход почему-то не задокументирован, однако упоминается например в [заметках](https://github.com/threepointone/react-act-examples/blob/master/sync.md#async--await) от одно из контрибьютеров react-а, [threepointone](https://github.com/threepointone).

> -Видишь async act в документации? 
> -Нет.
> -И я нет.А он есть.

Пример элементов в `AddStockItemForm.spec.tsx` :

```javascript
const container = mount(<AddStockItemForm/>);
const autocomplete = container.find(StockItemSearchField);
let buttonSubmit = container.find(Collapse).find(Button);
```

Вот синхронный пример такого взаимодействия:

```javascript
act(() => {
    buttonSubmit.simulate('click');
    // expects
})

container.setProps({}); //без этого не работает
```

И асинхронного:

```javascript
//если убрать await и async, не работает
await act(async () => {
    autocomplete.prop('onChange')({}, mockSearchMatch);
})

container.setProps({});
```

На решение этой проблемы ушло непозволительно много времени, поэтому не сто процентный code coverage, однако все ненаписанные тесты, делались бы аналогично написанным. Если я ошибаюсь насчет act-a, пожалуйста поправьте, мог замылиться глаз.Так же, глаз косится на `axios-mock-adapter` или его некорректное использование.

Redux редюсеры протестированы в полной мере, с ними проблем нет.

