# React Native Component Styler

[![NPM](https://nodei.co/npm/react-native-component-styler.png)](https://npmjs.org/package/react-native-component-styler)

Lib to create UI components in React Native

## createStyledComponent method

The `createStyledComponent` method expects three parameters:

* variants (collection of strings)
* style definition (object)
* component function

### Describe the component

```jsx
    import { createStyledComponent } from 'react-native-component-styler';
    import MyComponentView from './View';
    import style from './style.json';

    const VARIANTS = [
        'DEFAULT',
        'PRIMARY',
        'FOCUS'
    ]

    export default createStyledComponent(
        VARIANTS,
        style,
        MyComponentView
    );
```

### Style definition (can be json)

The style definition needs three levels:

- Element name
    - Variant
        - Style property

All functionality of [React Native Styler](https://github.com/dejakob/react-native-styler) can be used inside this definition.

```json
    {
        "Container": {
            "DEFAULT": {
                "backgroundColor": "theme:sheet"
            }
        },
        "TextInput": {
            "DEFAULT": {
                "width": "100%"
            },
            "FOCUS": {
                "borderBottomColor": "theme:accent"
            }
        }
    }
```

### Component function (stateless component)

```jsx
    function MyComponentView(props, s) {
        return (
            <View
                style={s('Container')}
            >
                <TextInput
                    style={s('TextInput')}
                />
            </View>
        );
    }

    export default MyComponentView;
```

## addGlobalContainerVariants method

Add variants to all elements named `Container`. One use case can be spacing

```jsx
    addGlobalContainerVariants({
        SPACE: {
            marginBottom: '4h4s'
        }
    })
```
