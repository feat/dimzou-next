import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

class Flipper extends React.PureComponent {

  constructor(props) {
    super(props);

    /**
     * @type {object}
     * @property {object} toggle - flag for switching index of current digit index
     */
    this.state = { toggle: false };
  }

  /**
   * Inverse state.toggle flag
   */
  tick() {
    this.setState({ toggle: !this.state.toggle });
  }

  /**
   * Returns next/prev value of digits linked list
   * @param {number} current - currently active value
   * @param {string} direction - list move direction
   * @return {number} linked list value
   */
  getCount(current, direction) {
    const isRev = this.props.reverse;
    const isNext = direction === "next";
    const head = this.props[isRev ? "min" : "max"];
    const tail = this.props[isRev ? "max" : "min"];

    return isNext ?
      current == head ? tail : current + (isRev ? -1 : 1) :
      current == tail ? head : current + (isRev ? 1 : -1);
  }

  /**
   * Execute flip action in 'props.now' value has been changed
   * @param {object} newProps - next props object
   */
  componentWillReceiveProps(newProps) {
    newProps.now !== this.props.now && this.tick();
  }

  /**
   * Generate semi linked list structure with siblings of active number
   * Index of active number depends of 'state.toggle' flag
   * @param {object} newProps - next props object
   * @return {array} linked list slice
   */
  getRange(initial) {
    const prev = this.getCount(initial, "prev");
    const arr = [initial, prev, this.getCount(prev, "prev")];

    arr[!this.state.toggle ?
      "unshift" :
      "push"
    ](!this.state.toggle ?
      this.getCount(initial, "next") :
      this.getCount(prev, "prev"));

    return arr;
  }

  /**
   * Render card sets for number
   * @return {ReactElement} markup
   */
  render() {
    const { namespace, size } = this.props;
    const cardName = `${namespace}-FlipCard`;
    return (
      <div className={`${namespace}-FlipCards ${namespace}-FlipCards_${size}`}>
        {this.getRange(this.props.now).map((val, i) => (
          <div
            key={`flip-card${i}`}
            className={classNames(`${cardName} ${cardName}_${size}`, {
              now: this.props.now === val,
            })}
          >
            <div className={`${cardName}__sides`}>
              {["front", "back"].map((key) => (
                <div key={`side${key}`} className={`${cardName}__side ${cardName}__side_${key}`}>
                  <div className={`${cardName}__sideNum ${cardName}__sideNum_${key}`}>
                    {key === "front" ? val : this.getCount(val, "next")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Flipper.propTypes = {
  namespace: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  reverse: PropTypes.bool,
  now: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
}

Flipper.defaultProps = {
  namespace: defaultNamespace,
  size: "md",
  reverse: false,
  now: 0,
  min: 0,
  max: 9,
}

export default Flipper;
