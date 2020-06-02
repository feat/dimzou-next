import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '@feat/feat-ui/lib/text-input';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';

class PasswordField extends React.PureComponent {
  state = {
    passwordMode: 'text',
  };

  togglePasswordMode = () => {
    const next = this.state.passwordMode === 'text' ? 'password' : 'text';
    this.setState({
      passwordMode: next,
    });
    if (this.passwordInput) {
      this.passwordInput.focus();
    }
  };

  render() {
    const { label, field, form } = this.props;
    const error = form.errors[field.name];
    const touched = form.touched[field.name];
    const validateStatus = touched && error ? 'error' : undefined;

    return (
      <FormItem
        modifier="dashed"
        validateStatus={validateStatus}
        label={<FormLabel>{label}</FormLabel>}
        help={validateStatus ? <FormHelp data={error} /> : undefined}
      >
        {({ handleFocus, handleBlur }) => (
          <TextInput
            size={this.props.size}
            autoFocus={this.props.autoFocus}
            type={this.state.passwordMode}
            name={field.name}
            value={field.value}
            ref={(n) => {
              this.passwordInput = n;
            }}
            onChange={field.onChange}
            onFocus={handleFocus}
            onBlur={(e) => {
              field.onBlur(e);
              handleBlur();
            }}
            autoComplete="off"
            addonAfter={
              <SquareButton
                tabIndex={-1}
                size="md"
                onClick={this.togglePasswordMode}
                style={{ lineHeight: '1.45' }}
              >
                {this.state.passwordMode === 'text' ? (
                  <i>
                    <svg
                      className="icon"
                      style={{
                        width: '1.45em',
                        height: '1.45em',
                        verticalAlign: 'middle',
                        fill: 'currentColor',
                        overflow: 'hidden',
                      }}
                      viewBox="0 0 1037 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="14554"
                    >
                      <path
                        d="M512.144286 892.582925c-215.006865 0-442.904319-166.612669-508.024455-371.380332-1.989307-6.300496-1.989307-13.077853 0.020466-19.357883 65.389266-204.249871 293.14141-370.427634 507.692904-370.427634 218.653929 0 441.785845 163.130358 508.002966 371.401822 1.989307 6.28003 1.989307 13.057387-0.020466 19.337417C953.348893 729.867006 730.342844 892.582925 512.144286 892.582925zM68.017116 511.585561c66.259076 190.239785 281.059234 317.328275 444.12717 317.328275 185.534624 0 382.261147-141.099598 443.795619-316.499397C894.63363 336.558246 697.761798 195.086164 511.833201 195.086164 349.117282 195.086164 134.50439 321.822636 68.017116 511.585561zM511.376807 759.297292c-138.550543 0-251.275907-112.726388-251.275907-251.275907s112.726388-251.275907 251.275907-251.275907c138.571009 0 251.297396 112.726388 251.297396 251.275907S649.947815 759.297292 511.376807 759.297292zM511.376807 341.635891c-91.75168 0-166.384471 74.632791-166.384471 166.384471s74.632791 166.384471 166.384471 166.384471 166.404937-74.632791 166.404937-166.384471S603.12951 341.635891 511.376807 341.635891zM395.480216 529.243733c-11.730159 0-21.223371-9.492188-21.223371-21.223371 0-75.627445 61.512982-137.140427 137.119961-137.140427 11.731182 0 21.223371 9.492188 21.223371 21.223371 0 11.730159-9.492188 21.223371-21.223371 21.223371-52.208059 0-94.674243 42.487673-94.674243 94.694709C416.703587 519.751544 407.210375 529.243733 395.480216 529.243733z"
                        p-id="14555"
                      />
                    </svg>
                  </i>
                ) : (
                  <i>
                    <svg
                      className="icon"
                      style={{
                        width: '1.45em',
                        height: '1.45em',
                        verticalAlign: 'middle',
                        fill: 'currentColor',
                        overflow: 'hidden',
                      }}
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2012"
                    >
                      <path
                        d="M950.784 603.136c12.8 13.824 11.264 35.84-2.56 48.128-6.656 5.632-14.848 8.704-22.528 8.704-9.216 0-18.432-3.584-25.6-11.264l-84.48-94.208c-0.512-0.512-0.512-1.024-1.024-1.536-44.032 24.576-94.208 43.008-152.064 53.248l35.328 107.52c6.144 17.92-3.584 37.376-21.504 43.008-3.584 1.024-7.168 1.536-10.752 1.536-14.336 0-27.648-9.216-32.256-23.552l-39.424-119.808c-25.088 2.048-51.2 3.072-78.848 3.072-31.232 0-59.904-1.536-86.528-4.096l-37.888 114.688c-4.608 14.336-17.92 23.552-32.256 23.552-3.584 0-7.168-0.512-10.752-1.536-17.92-6.144-27.648-25.088-21.504-43.008l34.304-103.936c-61.952-12.8-111.616-32.768-152.064-57.856l-90.112 100.352c-6.656 7.68-15.872 11.264-25.6 11.264-8.192 0-16.384-3.072-22.528-8.704-13.824-12.8-15.36-34.304-2.56-48.128l85.504-95.744c-31.232-25.6-56.832-54.272-80.384-82.944-11.776-14.848-9.728-36.352 5.12-48.128 14.848-11.776 36.352-9.728 48.128 5.12 58.88 72.192 139.776 171.52 388.608 171.52 252.416 0 338.944-95.744 381.952-167.424 9.728-16.384 30.72-21.504 46.592-11.776 16.384 9.728 21.504 30.72 11.776 46.592-22.528 37.888-51.2 69.632-83.968 96.768l79.872 88.576z"
                        p-id="2013"
                      />
                    </svg>
                  </i>
                )}
              </SquareButton>
            }
          />
        )}
      </FormItem>
    );
  }
}

PasswordField.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
  label: PropTypes.node,
  size: PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default PasswordField;
