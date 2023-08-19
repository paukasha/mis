export const BlockBox = {
  template: `<div class='block__box'>
    <div class='box__header'>
      <slot name='box-header'></slot> 
    </div>
    <div class='box__body'>
      <slot name='box-body'></slot>
    </div>
  </div>`,
};
