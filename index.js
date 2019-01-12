import React from 'react';
import { createStyle, getStyle } from 'react-native-styler';
import PropTypes from 'prop-types';

// React Native Component Styler
const PREFIX = '__RNCS';
let globalStyleRaw = {};

/**
 * Add global container variants
 * @param {Object} style 
 * @example
 * ```
 * {
 *   XS: { marginBottom: '2h4s' },
 *   S: { marginBottom: '4h4s' },
 *   M: { marginBottom: '8h4s' },
 *   L: { marginBottom: '16h4s' },
 *   XL: { marginBottom: '32h4s' },
 *   XXL: { marginBottom: '64h4s' }
 * }
 * ```
 */
function addGlobalContainerVariants(block) {
    const definition = {};

    Object
        .keys(block)
        .forEach(variant => {
            definition[`${PREFIX}__${variant}`] = block[variant]; 
        });

    globalStyleRaw = block;
    createStyle(definition);
}

/**
 * Convert a string divided by underscores into camelcase
 * @param {String} value 
 * @returns {String}
 */
function uppercaseUnderscoreToCamel(value) {
    return value.toLowerCase().replace(/_([a-z])/gi, (m, $1) => $1.toUpperCase());
}

/**
 * Get complete style for all active variants for a single element
 * @param {Object} component 
 * @param {Object} props
 * @param {String} elementName 
 * @returns {Object}
 */
function getTotalStyleForElement(component, props, elementName) {
    const variants = component.variants || ['DEFAULT'];

    const styles = variants.map(variant => {
        if (props[uppercaseUnderscoreToCamel(variant)] || variant === 'DEFAULT') {
            return getStyle(`${component.name}__${elementName}__${variant}`);
        }
    });

    Object
        .keys(globalStyleRaw)
        .forEach(function(globalStyleVariant) {
            if (elementName === 'Container') {
                if (props[globalStyleVariant]) {
                    styles.push(getStyle(`${PREFIX}__${globalStyleVariant}`))
                }
            }
        });

    return styles;
}

/**
 * Get all variant related propTypes to add to the component
 * @param {React.Component} component 
 */
function getPropTypesForVariants(component) {
    const propTypes = {};

    (component.variants || ['DEFAULT']).forEach(variant => {
        if (variant !== 'DEFAULT') {
            propTypes[uppercaseUnderscoreToCamel(variant)] = PropTypes.bool;
        }
    });

    return propTypes;
}

/**
 * Create Styled Component
 * @param {Object} style 
 * @param {Function} render 
 * @returns {React.Component}
 * @example
 * ```
 *   export default createStyledComponent({
 *     Container: {
 *       borderRadius: '2h4s'
 *     }
 *   }, function (props, s) {
 *     return (
 *       <View
 *         style={s('Container')}
 *       >
 *       
 *       </View>
 *     );
 *   })
 * ```
 */
function createStyledComponent(style, render) {
    const name = `${PREFIX}${Date.now()}`;

    createStyle({
        [name]: style
    });
    
    StyledComponent.variants = Object.keys(style).map(key => uppercaseUnderscoreToCamel(key));
    StyledComponent.propTypes = {
        ...(render.PropTypes || {}),
        ...getPropTypesForVariants(StyledComponent)
    };

    function StyledComponent(props) {
        return render(props, getTotalStyleForElement.bind(null, name, props || {}));
    }

    return StyledComponent;
}

export {
    addGlobalContainerVariants,
    createStyledComponent
};