import { Children } from "react";

const Label = (props, ...Children) => {
  return <label {...props}>{Children}</label>;
};

export default Label;
