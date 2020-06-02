import React from "react";
import Form from "@feat/feat-ui/lib/form/Form";
import FormItem from "@feat/feat-ui/lib/form/FormItem";
import Button from "@feat/feat-ui/lib/button";
import TextInput from "@feat/feat-ui/lib/text-input";
import FormLabel from "@feat/feat-ui/lib/form/FormLabel";
import Checkbox from "@feat/feat-ui/lib/checkbox";

/** 栅格系统为24等分 */
const Example = () => (
  <div style={{ maxWidth: 300, margin: "0 auto" }}>
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;
        console.log("handle Submit: ", username, password);
      }}
    >
      <FormItem modifier="dashed" label={<FormLabel>Username</FormLabel>}>
        {({ handleFocus, handleBlur, bindWidget }) => (
          <TextInput
            ref={(n) => {
              bindWidget(n);
            }}
            block
            name="username"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
      </FormItem>
      <FormItem modifier="dashed" label={<FormLabel>Password</FormLabel>}>
        {({ handleFocus, handleBlur, bindWidget }) => (
          <TextInput
            ref={(n) => {
              bindWidget(n);
            }}
            block
            name="password"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
      </FormItem>
      <FormItem modifier="dashed">
        <Checkbox name="remember">Remember me</Checkbox>
      </FormItem>
      <Button style={{ marginTop: 12 }} htmlType="submit" block type="primary">
        Login
      </Button>
    </Form>
  </div>
);

export default Example;
