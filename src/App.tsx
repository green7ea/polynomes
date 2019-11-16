import React, { useState } from 'react';
import './App.css';
import _ from 'lodash';

interface Elem {
    scalar: number,
    degree: number,
}

type Poly = Elem[];

const make_poly = (): Poly => simplify_poly(
    [
        { scalar: _.random(-5, 5), degree: 3 },
        { scalar: _.random(-5, 5), degree: 2 },
        { scalar: _.random(-5, 5), degree: 1 },
        { scalar: _.random(-5, 5), degree: 0 },
    ],
);

const cartesian = (a: Poly, b: Poly): Poly[] => _.concat([], ...a.map((d: Elem) => b.map((e: Elem) => _.concat(d, e))));

const simplify_poly = (poly: Poly): Poly => _(poly)
    .groupBy((elem) => elem.degree)
    .values()
    .map((elems) => {
        const scalar = _(elems)
            .map(x => x.scalar)
            .sum();
        const first = _.first(elems);
        return {
            scalar,
            degree: (first && first.degree) || 0,
        };
    })
    .filter((x: Elem) => x.scalar != 0)
    .value();

const multiply_poly = (a: Poly, b: Poly): Poly => simplify_poly(
    _(cartesian(a, b))
        .map((x: Elem[]): Elem => {
            const a: Elem = x[0];
            const b: Elem = x[1];
            return {
                scalar: a.scalar * b.scalar,
                degree: a.degree + b.degree,
            };
        })
        .value()
);

const poly_to_string = (poly: Poly): string => {
    const expts = ['', 'x', 'x²', 'x³', 'x⁴', 'x⁵', 'x⁶'];

    return _(poly)
        .sort((a, b) => b.degree - a.degree)
        .reduce((acc, { scalar, degree }) => {
            const sign = scalar >= 0 ? '+' : '-';
            const num = Math.abs(scalar) === 1 && degree > 0 ?
                `${expts[degree]}` :
                `${Math.abs(scalar)}${expts[degree]}`;

            if (!acc) {
                return sign === '+' ? num : `${sign}${num}`;
            }

            return `${acc} ${sign} ${num}`
        }, '');
};

const App = () => {
    const [state, setState] = useState({
        a: make_poly(),
        b: make_poly(),
        visible: false
    });
    const c = multiply_poly(state.a, state.b);

    return (
      <div className="App">
        <header className="App-header">
          <p>
            <a onClick={ () => setState({
                a: make_poly(),
                b: make_poly(),
                visible: false,
            })}>
              new problem
            </a>
          </p>
          <p>
            { poly_to_string(c) }
          </p>
          <p>
            { poly_to_string(state.a) }
          </p>
          <p>
            { state.visible && poly_to_string(state.b) }
            { !state.visible &&
              <a onClick={ () => setState({
                  ...state,
                  visible: !state.visible,
              }) }>
                answer
              </a>
            }
          </p>
        </header>
      </div>
    );
};

export default App;
