import React from "react"
import InputWithLabelWrapper from "highline/components/input_with_label_wrapper"

const InputWithLabel = (props) => (
  <InputWithLabelWrapper inputType= "standard" { ...props } />
)

export default InputWithLabel
